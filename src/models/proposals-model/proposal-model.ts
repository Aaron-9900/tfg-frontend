import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetDownloadSignedUrl } from "../../services/api-types"
import { SubmissionStatus } from "../../services/response-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { UserModel } from "../user-model/user-model"
import { SubmissionModel } from "./submission-model"

export const ProposalModel = types
  .model("ProposalModel")
  .props({
    id: types.identifierNumber,
    name: "",
    description: "",
    limit: 0,
    user: UserModel,
    type: types.string,
    rate: 0,
    submissions: types.array(SubmissionModel),
    submissionCount: 0,
    hasUserSubmission: false,
  })
  .actions((self) => {
    return {
      setHasUserSubmission: function (val: boolean) {
        self.hasUserSubmission = val
      },
    }
  })

type ProposalModelType = Instance<typeof ProposalModel>
export interface ProposalModel extends ProposalModelType {}
type ProposalModelSnapshotType = SnapshotOut<typeof ProposalModel>
export interface ProposalModelSnapshot extends ProposalModelSnapshotType {}
