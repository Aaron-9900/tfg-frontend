import { ProposalModel } from "../models/proposals-model/proposal-model"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { UserModel } from "../models/user-model/user-model"
import { LocalLogin, SignedUrlType } from "./local-types"
import {
  BackendSignedUrlResponse,
  BackendSubmissions,
  Login,
  ProposalDetail,
  Submission,
  User,
} from "./response-types"
import { cast } from "mobx-state-tree"
import { SubmissionModel } from "../models/proposals-model/submission-model"

export function parseUser(backendUser: User): UserModel {
  return {
    name: backendUser.name,
    id: backendUser.id,
  }
}
export function parseSubmission(submission: Submission): SubmissionModel {
  return cast({
    fileName: submission.file_name,
    id: submission.id,
    user: parseUser(submission.user),
    fileType: submission.content_type,
    proposal: submission.proposal,
    submissionStatus: submission.status,
  })
}
export function parseProposal(proposal: ProposalDetail): ProposalModel {
  return {
    ...proposal,
    submissionCount: proposal.submission_count,
    submissions: cast(proposal.submissions?.map((submission) => parseSubmission(submission))),
    hasUserSubmission: proposal.has_user_submission,
  }
}

export function parseAuth(auth: Login): LocalLogin {
  return {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    username: auth.user.name,
    id: auth.user.id,
  }
}

export function parseSignedUrlResponse(signedUrlResponse: BackendSignedUrlResponse): SignedUrlType {
  return { fileName: signedUrlResponse.file_name, url: signedUrlResponse.url }
}

export function parseProposals(proposalsList: ProposalDetail[]): ProposalsModelStore {
  return cast(
    proposalsList.map((prop) => {
      return {
        ...parseProposal(prop),
      }
    }),
  )
}
export function parseSubmissions(submissions: BackendSubmissions): SubmissionModel[] {
  return submissions.map((submission) => parseSubmission(submission))
}
