import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { GeneralApiProblem } from "./api-problem"

export type GetUsersResult =
  | {
      kind: "ok"
      response: {
        accessToken: string
        refreshToken: string
        username: string
        id: number
      }
    }
  | GeneralApiProblem
export type PostRegister = { kind: "ok"; username: string } | GeneralApiProblem
export type GetProposals = { kind: "ok"; proposals: ProposalsModelStore } | GeneralApiProblem
