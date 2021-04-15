import { applySnapshot, cast, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import {
  GetDownloadSignedUrl,
  GetProposals,
  GetProposalTypes,
  GetUserSubmissions,
  PostProposal,
} from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { ProposalModel } from "./proposal-model"
import { SubmissionModel } from "./submission-model"

export const SubmissionsModelStore = types
  .model("SubmissionsModelStore")
  .props({
    submissions: types.array(SubmissionModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => {
    return {
      getUserSubmissions: flow(function* () {
        try {
          const resp: GetUserSubmissions = yield self.environment.api.getUserSubmissions()
          if (resp.kind !== "ok") {
            throw resp
          }
          self.submissions = cast(resp.submissions)
        } catch (err) {
          console.error(err)
        }
      }),
      getDownloadUrl: flow(function* (fileName: string, submissionId: string) {
        try {
          const response: GetDownloadSignedUrl = yield self.environment.api.getFileDownloadUrl(
            fileName,
            submissionId,
          )
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          return response.resp
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
    }
  })

type SubmissionsModelStoreType = Instance<typeof SubmissionsModelStore>
export interface SubmissionsModelStore extends SubmissionsModelStoreType {}
type SubmissionsModelStoreSnapshotType = SnapshotOut<typeof SubmissionsModelStore>
export interface SubmissionsModelStoreSnapshot extends SubmissionsModelStoreSnapshotType {}
