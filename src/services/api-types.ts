import { ProposalDetailModel } from "../models/proposals-model/proposal-detail"
import { ProposalModel } from "../models/proposals-model/proposal-model"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { GeneralApiProblem } from "./api-problem"
import { LocalLogin } from "./local-types"
import { ProposalType } from "./response-types"

export type GetUsersResult = { kind: "ok"; response: LocalLogin } | GeneralApiProblem
export type PostRegister = { kind: "ok"; username: string } | GeneralApiProblem
export type GetProposals = { kind: "ok"; proposals: ProposalsModelStore } | GeneralApiProblem
export type PostProposal = { kind: "ok"; proposal: ProposalModel } | GeneralApiProblem
export type GetProposalTypes = { kind: "ok"; types: ProposalType[] } | GeneralApiProblem
export type GetSingleProposal = { kind: "ok"; proposal: ProposalDetailModel } | GeneralApiProblem
export type GetSignedUrl = { kind: "ok"; url: string } | GeneralApiProblem
export type PutFile = { kind: "ok" } | GeneralApiProblem
