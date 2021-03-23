import apisauce, { ApiResponse, ApisauceInstance } from "apisauce"
import { AxiosRequestConfig } from "axios"
import Cookies from "universal-cookie/es6"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { parseAuth, parseProposal, parseProposals } from "./api-helpers"
import { getGeneralApiProblem } from "./api-problem"
import { GetProposals, GetUsersResult, PostProposal, PostRegister } from "./api-types"
import { ApiConfig, API_CONFIG } from "./apiconfig"

export class Api {
  client: ApisauceInstance
  config: ApiConfig
  cookies: Cookies

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
    // TODO: Delete on deploy
    this.client.addAsyncRequestTransform((request) => {
      return new Promise((resolve) => setTimeout(resolve, 2000))
    })

    this.client.addAsyncResponseTransform(async (response) => {
      console.log(response)
      if (response.status === 401) {
        await this.refresh()
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
  ): Promise<PostProposal> {
    this.client.headers["Authorization"] = "Bearer " + this.cookies.get("access")
    const response: ApiResponse<any> = await this.client.post("/api/protected/proposal", {
      name: name,
      description: description,
      rate: rate,
      limit: limit,
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
}
