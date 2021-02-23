/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RootStore, RootStoreModel } from "./root-store"
import { Environment } from "../environment"
import { onSnapshot } from "mobx-state-tree"

/**
 * The key we'll be saving our state as within async storage.
 */

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()
  return env
}

const ROOT_STATE_STORAGE_KEY = "root"

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore

  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  if (localStorage.getItem(ROOT_STATE_STORAGE_KEY) !== null) {
    const data = JSON.parse(localStorage.getItem(ROOT_STATE_STORAGE_KEY) as string)
    rootStore = RootStoreModel.create(data, env)
  } else {
    rootStore = RootStoreModel.create({}, env)
  }
  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) =>
    localStorage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot)),
  )

  return rootStore
}
