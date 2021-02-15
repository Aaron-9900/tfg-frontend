import apisauce, { ApiResponse, ApisauceInstance } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { GetUsersResult } from "./api-types"
import { ApiConfig, API_CONFIG } from "./apiconfig"

export class Api {
  client: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = API_CONFIG) {
    this.config = config
    this.client = apisauce.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.client.addAsyncRequestTransform((request) => {
      return new Promise((resolve) => setTimeout(resolve, 2000))
    })
  }

  async login(email: string, password: string): Promise<GetUsersResult> {
    const response: ApiResponse<any> = await this.client.post("/session/login", {
      email: email,
      password: password,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) throw problem
    }
    try {
      const token = response.data.token
      return { kind: "ok", token: token }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
