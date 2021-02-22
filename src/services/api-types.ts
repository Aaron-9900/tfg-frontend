import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { GeneralApiProblem } from "./api-problem"

export type GetUsersResult =
  | { kind: "ok"; tokens: { accessToken: string; refreshToken: string } }
  | GeneralApiProblem
export type PostRegister = { kind: "ok"; username: string } | GeneralApiProblem
export type GetProposals = { kind: "ok"; proposals: ProposalsModelStore } | GeneralApiProblem
