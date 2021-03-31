import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetSignedUrl, GetSingleProposal, PutFile } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { UserModel } from "../user-model/user-model"
import { ProposalModel } from "./proposal-model"

export const ProposalDetailModel = types
  .model("ProposalDetailModel")
  .props({
    proposal: types.maybeNull(ProposalModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => {
    return {
      getProposal: flow(function* (id: string) {
        self.setStatus("pending")
        try {
          const response: GetSingleProposal = yield self.environment.api.getProposal(id)
          if (response.kind !== "ok") {
            throw response
          }

          self.proposal = response.proposal as any
          self.setStatus("idle")
        } catch (err) {
          self.setStatus("error")
        }
      }),
      putFile: flow(function* (fileName: string, file: File, progress: (event: any) => void) {
        self.setStatus("pending")
        try {
          const response: PutFile = yield self.environment.api.submitFile(fileName, file, progress)
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          return response
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
      getSignedUrl: flow(function* (fileName: string) {
        self.setStatus("pending")
        try {
          const response: GetSignedUrl = yield self.environment.api.getSignedUrl(fileName)
          console.log(response)
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          return response.url
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
    }
  })

type ProposalDetailModelType = Instance<typeof ProposalDetailModel>
export interface ProposalDetailModel extends ProposalDetailModelType {}
type ProposalDetailModelSnapshotType = SnapshotOut<typeof ProposalDetailModel>
export interface ProposalDetailModelSnapshot extends ProposalDetailModelSnapshotType {}
