import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthModel } from "../auth-model/auth-model"
import { ProposalsModelStore } from "../proposals-model/proposals-model-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authStore: types.optional(AuthModel, {}),
  proposalsStore: types.optional(ProposalsModelStore, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
