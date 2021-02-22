import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetProposals } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { ProposalModel } from "./proposal-model"

export const ProposalsModelStore = types
  .model("ProposalsModelStore")
  .props({
    proposals: types.array(ProposalModel),
  })
  .extend(withEnvironment)
  .actions((self) => {
    return {
      getProposals: flow(function* (from: number, to: number) {
        try {
          const response: GetProposals = yield self.environment.api.getProposals(from, to)
          if (response.kind === "ok") {
            const proposals = response.proposals
            applySnapshot(self.proposals, proposals as any)
          } else {
            throw response
          }
        } catch (err) {
          throw err
        }
      }),
    }
  })

type ProposalsModelStoreType = Instance<typeof ProposalsModelStore>
export interface ProposalsModelStore extends ProposalsModelStoreType {}
type ProposalsModelStoreSnapshotType = SnapshotOut<typeof ProposalsModelStore>
export interface ProposalsModelStoreSnapshot extends ProposalsModelStoreSnapshotType {}
