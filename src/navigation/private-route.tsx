import React, { ReactNode } from "react"
import { Redirect, Route, RouteProps } from "react-router-dom"
import { useStores } from "../models/root-store/root-store-context"

type PrivateRouteProps = {
  path: RouteProps["path"]
  exact?: RouteProps["exact"]
  children: ReactNode
}
export const PrivateRoute = (props: PrivateRouteProps): JSX.Element => {
  const { authStore } = useStores()
  return authStore.isLogged ? (
    <Route path={props.path} exact={props.exact}>
      {props.children}
    </Route>
  ) : (
    <Redirect to="/login"></Redirect>
  )
}
