import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

export const AuthModel = types
  .model("AuthModel")
  .props({
    loading: false,
  })
  .extend(withEnvironment)
  .actions((self) => {
    return {
      login: flow(function* (email: string, password: string) {
        self.loading = true
        try {
          const resp = yield self.environment.api.login(email, password)
          self.loading = false
          return resp
        } catch (err) {
          self.loading = false
          throw err
        }
      }),
    }
  })

type AuthModelType = Instance<typeof AuthModel>
export interface AuthModel extends AuthModelType {}
type AuthModelSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthModelSnapshot extends AuthModelSnapshotType {}
