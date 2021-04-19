import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetUsersResult } from "../../services/api-types"
import { withEnvironment } from "../extensions/with-environment"
import { UserModel } from "../user-model/user-model"

export const AuthModel = types
  .model("AuthModel")
  .props({
    loading: false,
    user: types.maybeNull(UserModel),
  })
  .extend(withEnvironment)
  .views((self) => {
    return {
      get isLogged(): boolean {
        return !!self.user?.name && self.environment.api.hasCredentials()
      },
    }
  })
  .actions((self) => {
    function reset() {
      self.loading = false
      self.user = null
    }
    return {
      login: flow(function* (email: string, password: string) {
        self.loading = true
        try {
          const resp: GetUsersResult = yield self.environment.api.login(email, password)
          if (resp.kind !== "ok") {
            throw resp
          }
          self.loading = false
          self.user = { name: resp.response.username, id: resp.response.id, privacyPolicy: "" }
          return resp
        } catch (err) {
          self.loading = false
          throw err
        }
      }),
      getUserSettings: flow(function* () {
        self.loading = true
        try {
          const resp = yield self.environment.api.getSettings(self.user?.id ?? 0)
          self.loading = false
          return resp
        } catch (err) {
          self.loading = false
          throw err
        }
      }),
      putUserSetting: flow(function* (settingsList: { key: string; value: string }[]) {
        self.loading = true
        try {
          const resp = yield self.environment.api.putUserSettings(settingsList)
          self.loading = false
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
      logout: flow(function* () {
        try {
          yield self.environment.api.logout()
          reset()
          return true
        } catch (err) {
          return false
        }
      }),
    }
  })

type AuthModelType = Instance<typeof AuthModel>
export interface AuthModel extends AuthModelType {}
type AuthModelSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthModelSnapshot extends AuthModelSnapshotType {}
