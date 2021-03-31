import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user-model/user-model"

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
  })
  .actions((self) => {
    return {}
  })

type ProposalModelType = Instance<typeof ProposalModel>
export interface ProposalModel extends ProposalModelType {}
type ProposalModelSnapshotType = SnapshotOut<typeof ProposalModel>
export interface ProposalModelSnapshot extends ProposalModelSnapshotType {}
