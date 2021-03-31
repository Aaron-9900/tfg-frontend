import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetProposals, GetProposalTypes, PostProposal } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { ProposalModel } from "./proposal-model"

export const ProposalsModelStore = types
  .model("ProposalsModelStore")
  .props({
    proposals: types.array(ProposalModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => {
    return {
      getProposals: flow(function* (from: number, to: number) {
        try {
          self.setStatus("pending")
          const response: GetProposals = yield self.environment.api.getProposals(from, to)
          self.setStatus("done")
          if (response.kind === "ok") {
            const proposals = response.proposals
            applySnapshot(self.proposals, proposals as any)
          } else {
            throw response
          }
        } catch (err) {
          self.setStatus("error")

          throw err
        }
      }),
      postProposal: flow(function* (
        name: string,
        description: string,
        rate: number,
        limit: number,
        type: string,
      ) {
        try {
          self.setStatus("pending")
          const response: PostProposal = yield self.environment.api.postProposal(
            name,
            description,
            rate,
            limit,
            type,
          )
          self.setStatus("done")
          if (response.kind === "ok") {
            self.proposals.push(response.proposal)
            return true
          } else {
            throw response
          }
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
      getProposalTypes: flow(function* () {
        //
        try {
          const response: GetProposalTypes = yield self.environment.api.getProposalTypes()
          if (response.kind === "ok") {
            const types = response.types
            return types
          } else {
            throw response
          }
        } catch (err) {
          self.setStatus("error")
        }
      }),
    }
  })

type ProposalsModelStoreType = Instance<typeof ProposalsModelStore>
export interface ProposalsModelStore extends ProposalsModelStoreType {}
type ProposalsModelStoreSnapshotType = SnapshotOut<typeof ProposalsModelStore>
export interface ProposalsModelStoreSnapshot extends ProposalsModelStoreSnapshotType {}
