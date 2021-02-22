import { ProposalsModelStore } from "../models/proposals-model/proposals-model-store"
import { UserModel } from "../models/user-model/user-model"

export function parseUser(backendUser: any): UserModel {
  return {
    name: backendUser.name,
    id: backendUser.id,
  }
}

export function parseProposals(proposalsList): ProposalsModelStore {
  return proposalsList.map((prop) => {
    return {
      id: prop.id,
      user: parseUser(prop.user),
      limit: prop.limit,
      name: prop.name,
      description: prop.description,
    }
  })
}
