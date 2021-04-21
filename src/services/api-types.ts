import { ProposalDetailModel } from "../models/proposals-model/proposal-detail"
import { ProposalModel } from "../models/proposals-model/proposal-model"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { SubmissionModel } from "../models/proposals-model/submission-model"
import { UserModel } from "../models/user-model/user-model"
import { GeneralApiProblem } from "./api-problem"
import { LocalLogin, SignedDownloadUrlType, SignedUrlType } from "./local-types"
import { PrivacyTemplate, ProposalType } from "./response-types"

export type GetUsersResult = { kind: "ok"; response: LocalLogin } | GeneralApiProblem
export type GetPrivacyTemplates = { kind: "ok"; response: PrivacyTemplate[] } | GeneralApiProblem
export type GetUserSettings = { kind: "ok"; user: UserModel } | GeneralApiProblem
export type PostRegister = { kind: "ok"; username: string } | GeneralApiProblem
export type GetProposals = { kind: "ok"; proposals: ProposalsModelStore } | GeneralApiProblem
export type PostProposal = { kind: "ok"; proposal: ProposalModel } | GeneralApiProblem
export type GetProposalTypes = { kind: "ok"; types: ProposalType[] } | GeneralApiProblem
export type GetSingleProposal = { kind: "ok"; proposal: ProposalModel } | GeneralApiProblem
export type GetSignedUrl = { kind: "ok"; resp: SignedUrlType } | GeneralApiProblem
export type GetDownloadSignedUrl = { kind: "ok"; resp: SignedDownloadUrlType } | GeneralApiProblem
export type PutFile = { kind: "ok" } | GeneralApiProblem
export type PostSubmission = { kind: "ok" } | GeneralApiProblem
export type GetUserSubmissions = { kind: "ok"; submissions: SubmissionModel[] } | GeneralApiProblem
export type PostSubmissionStatus = { kind: "ok" } | GeneralApiProblem
