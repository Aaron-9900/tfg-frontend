import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { UserModel } from "../user-model/user-model"

export const ProposalModel = types
  .model("ProposalModel")
  .props({
    name: "",
    description: "",
    limit: 0,
    user: UserModel,
  })
  .actions((self) => {
    return {}
  })

type ProposalModelType = Instance<typeof ProposalModel>
export interface ProposalModel extends ProposalModelType {}
type ProposalModelSnapshotType = SnapshotOut<typeof ProposalModel>
export interface ProposalModelSnapshot extends ProposalModelSnapshotType {}
