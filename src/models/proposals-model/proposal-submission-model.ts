import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user-model/user-model"
import { SubmissionModel } from "./submission-model"

export const ProposalSubmissionModel = types
  .model("ProposalSubmissionModel")
  .props({
    id: types.identifierNumber,
    name: "",
    description: "",
    limit: 0,
    user: UserModel,
    type: types.string,
    rate: 0,
  })
  .actions((self) => {
    return {}
  })

type ProposalSubmissionModelType = Instance<typeof ProposalSubmissionModel>
export interface ProposalSubmissionModel extends ProposalSubmissionModelType {}
type ProposalSubmissionModelSnapshotType = SnapshotOut<typeof ProposalSubmissionModel>
export interface ProposalSubmissionModelSnapshot extends ProposalSubmissionModelSnapshotType {}
