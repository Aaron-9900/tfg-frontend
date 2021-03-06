import { observer } from "mobx-react-lite"
import React, { useState, useEffect } from "react"
import { RootStore } from "./models/root-store/root-store"
import { RootStoreProvider } from "./models/root-store/root-store-context"
import { setupRootStore } from "./models/root-store/setup-root-store"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./screens/home"
import Login from "./screens/login"
import Register from "./screens/register"
import { PrivateRoute } from "./navigation/private-route"
import CreateProposal from "./screens/create-proposal"
import ProposalDetail from "./screens/proposal-detail"
import MyProfile from "./screens/my-profile"
import UserSubmissions from "./screens/user-submissions"
import CreatePrivacyPolicy from "./screens/create-privacy-policy"

const App = observer(function App() {
  const [rootStore, setRootStore] = useState<RootStore | null>(null)
  useEffect(() => {
    async function setup() {
      setupRootStore().then(setRootStore)
    }
    setup()
  }, [])
  if (!rootStore) return null
  return (
    <RootStoreProvider value={rootStore}>
      <div className="App">
        <Router>
          <Switch>
            <PrivateRoute exact path="/">
              <Home></Home>
            </PrivateRoute>
            <PrivateRoute exact path="/user/:id">
              <MyProfile />
            </PrivateRoute>
            <PrivateRoute exact path="/user/:id/submissions">
              <UserSubmissions />
            </PrivateRoute>
            <PrivateRoute exact path="/user/:id/user-info">
              <CreatePrivacyPolicy />
            </PrivateRoute>
            <PrivateRoute path="/proposal/create">
              <CreateProposal />
            </PrivateRoute>
            <PrivateRoute path="/proposal/:id">
              <ProposalDetail />
            </PrivateRoute>
            <Route path="/login">
              <Login></Login>
            </Route>
            <Route path="/register">
              <Register></Register>
            </Route>
          </Switch>
        </Router>
      </div>
    </RootStoreProvider>
  )
})

export default App
