import apisauce, { ApiResponse, ApisauceInstance } from "apisauce"
import Cookies from "universal-cookie/es6"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { parseAuth, parseProposals } from "./api-helpers"
import { getGeneralApiProblem } from "./api-problem"
import { GetProposals, GetUsersResult, PostRegister } from "./api-types"
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
}
