import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetUsersResult } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"

export const AuthModel = types
  .model("AuthModel")
  .props({
    loading: false,
    username: "",
    id: 0,
  })
  .extend(withEnvironment)
  .views((self) => {
    return {
      get isLogged(): boolean {
        return !!self.username
      },
    }
  })
  .actions((self) => {
    return {
      login: flow(function* (email: string, password: string) {
        self.loading = true
        try {
          const resp: GetUsersResult = yield self.environment.api.login(email, password)
          if (resp.kind !== "ok") {
            throw resp
          }
          self.loading = false
          self.username = resp.response.username
          self.id = resp.response.id
          return resp
        } catch (err) {
          self.loading = false
          throw err
        }
      }),
      register: flow(function* (email: string, name: string, password: string) {
        self.loading = true
        try {
          const resp = yield self.environment.api.register(email, name, password)
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
