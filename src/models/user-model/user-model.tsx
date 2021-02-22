import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

export const UserModel = types
  .model("UserModel")
  .props({
    name: "",
    id: types.identifierNumber,
  })
  .actions((self) => {
    return {}
  })

type UserModelType = Instance<typeof UserModel>
export interface UserModel extends UserModelType {}
type UserModelSnapshotType = SnapshotOut<typeof UserModel>
export interface UserModelSnapshot extends UserModelSnapshotType {}
