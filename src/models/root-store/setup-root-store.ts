/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RootStoreModel } from "./root-store"
import { Environment } from "../environment"

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

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  const env = await createEnvironment()
  const rootStore = RootStoreModel.create({}, env)
  return rootStore
}
export {}
