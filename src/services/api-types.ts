import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { GeneralApiProblem } from "./api-problem"
import { LocalLogin } from "./local-types"

export type GetUsersResult = { kind: "ok"; response: LocalLogin } | GeneralApiProblem
export type PostRegister = { kind: "ok"; username: string } | GeneralApiProblem
export type GetProposals = { kind: "ok"; proposals: ProposalsModelStore } | GeneralApiProblem
