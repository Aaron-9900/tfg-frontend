import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { type } from "node:os"
import { GetDownloadSignedUrl, PostSubmissionStatus } from "../../services/api-types"
import { SubmissionStatus } from "../../services/response-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { UserModel } from "../user-model/user-model"
import { ProposalModel } from "./proposal-model"
import { ProposalSubmissionModel } from "./proposal-submission-model"

export const SubmissionModel = types
  .model("SubmissionModel")
  .props({
    id: types.identifierNumber,
    fileName: "",
    user: UserModel,
    fileType: "",
    proposal: types.maybeNull(ProposalSubmissionModel),
    submissionStatus: types.union(
      types.literal("pending"),
      types.literal("accepted"),
      types.literal("rejected"),
      types.literal(""),
    ),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => {
    return {
      setSubmissionStatus: flow(function* (proposalId: number, status: SubmissionStatus) {
        try {
          console.log(proposalId, status)
          const response: PostSubmissionStatus = yield self.environment.api.setSubmissionStatus(
            self.id,
            proposalId,
            status,
          )
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          self.submissionStatus = status
          return response
        } catch (err) {
          self.setStatus("error")
          return err
        }
      }),
    }
  })

type SubmissionModelType = Instance<typeof SubmissionModel>
export interface SubmissionModel extends SubmissionModelType {}
type SubmissionModelSnapshotType = SnapshotOut<typeof SubmissionModel>
export interface SubmissionModelSnapshot extends SubmissionModelSnapshotType {}
