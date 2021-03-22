import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetProposals, PostProposal } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { ProposalModel } from "./proposal-model"

export const ProposalsModelStore = types
  .model("ProposalsModelStore")
  .props({
    proposals: types.array(ProposalModel),
    loading: false,
  })
  .extend(withEnvironment)
  .actions((self) => {
    return {
      getProposals: flow(function* (from: number, to: number) {
        try {
          self.loading = true
          const response: GetProposals = yield self.environment.api.getProposals(from, to)
          self.loading = false
          if (response.kind === "ok") {
            const proposals = response.proposals
            applySnapshot(self.proposals, proposals as any)
          } else {
            throw response
          }
        } catch (err) {
          self.loading = false
          throw err
        }
      }),
      postProposal: flow(function* (
        name: string,
        description: string,
        rate: number,
        limit: number,
      ) {
        try {
          self.loading = true
          const response: PostProposal = yield self.environment.api.postProposal(
            name,
            description,
            rate,
            limit,
          )
          self.loading = false
          if (response.kind === "ok") {
            return true
          } else {
            throw response
          }
        } catch (err) {}
      }),
    }
  })

type ProposalsModelStoreType = Instance<typeof ProposalsModelStore>
export interface ProposalsModelStore extends ProposalsModelStoreType {}
type ProposalsModelStoreSnapshotType = SnapshotOut<typeof ProposalsModelStore>
export interface ProposalsModelStoreSnapshot extends ProposalsModelStoreSnapshotType {}
