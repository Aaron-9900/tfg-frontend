import apisauce, { ApiResponse, ApisauceInstance } from "apisauce"
import { AxiosRequestConfig } from "axios"
import Cookies from "universal-cookie/es6"
import { ProposalDetailModel } from "../models/proposals-model/proposal-detail"
import { parseAuth, parseProposal, parseProposals } from "./api-helpers"
import { getGeneralApiProblem } from "./api-problem"
import {
  GetProposals,
  GetProposalTypes,
  GetSignedUrl,
  GetSingleProposal,
  GetUsersResult,
  PostProposal,
  PostRegister,
  PutFile,
} from "./api-types"
import { ApiConfig, API_CONFIG } from "./apiconfig"
import { ProposalType } from "./response-types"

export class Api {
  client: ApisauceInstance
  config: ApiConfig
  cookies: Cookies
  awsClient: ApisauceInstance

  constructor(config: ApiConfig = API_CONFIG) {
    this.config = config
    this.cookies = new Cookies()
    this.client = apisauce.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.awsClient = apisauce.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: "*/*",
      },
    })
    // TODO: Delete on deploy
    this.client.addAsyncRequestTransform((request) => {
      if (!request.headers["Authorization"]) {
        request.headers["Authorization"] = "Bearer " + this.cookies.get("access")
      }
      return new Promise((resolve) => setTimeout(resolve, 2000))
    })

    this.client.addResponseTransform(async (response) => {
      if (response.status === 401) {
        await this.refresh()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        response.config!.headers["Authorization"] = "Bearer " + this.cookies.get("access")
        const newResponse = await this.client.axiosInstance.request(
          response.config as AxiosRequestConfig,
        )
        response = {
          ...newResponse,
          ok: newResponse.status === 200,
          problem: null,
          originalError: null,
        } as ApiResponse<any>
      }
    })
  }
  hasCredentials(): boolean {
    return this.cookies.get("access") && this.cookies.get("refresh")
  }
  async login(email: string, password: string): Promise<GetUsersResult> {
    const response: ApiResponse<any> = await this.client.post("/api/public/login", {
      email: email,
      password: password,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      const { access_token: accessToken, refresh_token: refreshToken } = response.data
      this.client.headers["Authorization"] = "Bearer " + accessToken
      this.cookies.set("refresh", refreshToken)
      this.cookies.set("access", accessToken)
      return {
        kind: "ok",
        response: parseAuth(response.data),
      }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async register(email: string, name: string, password: string): Promise<PostRegister> {
    const response: ApiResponse<any> = await this.client.post("/api/public/signup", {
      name: name,
      email: email,
      password: password,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      const username = response.data.name
      return { kind: "ok", username: username }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async refresh(): Promise<void> {
    this.client.headers["Authorization"] = "Bearer " + this.cookies.get("refresh")
    const response: ApiResponse<any> = await this.client.get("api/protected/refresh")
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      this.cookies.remove("refresh")
      this.cookies.remove("access")
      if (problem) throw problem
    }
    this.cookies.set("refresh", response.data.refresh_token)
    this.cookies.set("access", response.data.access_token)
    this.client.headers["Authorization"] = "Bearer " + response.data.access_token
  }
  async logout(): Promise<void> {
    this.client.headers["Authorization"] = "Bearer " + this.cookies.get("refresh")
    const response: ApiResponse<any> = await this.client.post("api/protected/logout")
    if (response.status === 500) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    this.cookies.remove("refresh")
    this.cookies.remove("access")
    this.client.headers["Authorization"] = "Bearer "
  }
  async getProposals(from: number, to: number): Promise<GetProposals> {
    const response: ApiResponse<any> = await this.client.get("/api/public/proposals", {
      from: from,
      to: to,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      const proposals = parseProposals(response.data)
      return { kind: "ok", proposals: proposals }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async postProposal(
    name: string,
    description: string,
    rate: number,
    limit: number,
    type: string,
  ): Promise<PostProposal> {
    this.client.headers["Authorization"] = "Bearer " + this.cookies.get("access")
    const response: ApiResponse<any> = await this.client.post("/api/protected/proposal", {
      name: name,
      description: description,
      rate: rate,
      limit: limit,
      type: type,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      const proposal = parseProposal(response.data)
      return { kind: "ok", proposal: proposal }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async getProposalTypes(): Promise<GetProposalTypes> {
    const response: ApiResponse<any> = await this.client.get("/api/public/proposal-types")
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      return { kind: "ok", types: response.data as ProposalType[] }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async getProposal(id: string): Promise<GetSingleProposal> {
    const response: ApiResponse<any> = await this.client.get("/api/protected/proposal", {
      proposal_id: id,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      return { kind: "ok", proposal: response.data as ProposalDetailModel }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async getSignedUrl(fileName: string): Promise<GetSignedUrl> {
    const response: ApiResponse<any> = await this.client.get("/api/protected/signed-url", {
      file_name: fileName,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      return { kind: "ok", url: response.data.url as string }
    } catch {
      return { kind: "bad-data" }
    }
  }
  async submitFile(
    fileName: string,
    file: File,
    onProgress: (event: any) => void,
  ): Promise<PutFile> {
    const urlResponse: GetSignedUrl = await this.getSignedUrl(fileName)
    if (urlResponse.kind !== "ok") {
      throw urlResponse
    }
    const response: ApiResponse<any> = await this.awsClient.put(urlResponse.url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (event) => {
        onProgress(event)
      },
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    return { kind: "ok" }
  }
}
