import { ProposalModel } from "../models/proposals-model/proposal-model"
import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { UserModel } from "../models/user-model/user-model"
import { LocalLogin } from "./local-types"
import { Login, Proposal, User } from "./response-types"

export function parseUser(backendUser: User): UserModel {
  return {
    name: backendUser.name,
    id: backendUser.id,
  }
}
export function parseProposal(proposal: Proposal): ProposalModel {
  return { ...proposal }
}

export function parseProposals(proposalsList: Proposal[]): ProposalsModelStore {
  return proposalsList.map((prop) => {
    return {
      ...parseProposal(prop),
      user: parseUser(prop.user),
    }
  })
}

export function parseAuth(auth: Login): LocalLogin {
  return {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    username: auth.user.name,
    id: auth.user.id,
  }
}
