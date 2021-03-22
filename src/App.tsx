import { observer } from "mobx-react-lite"
import React, { useState, useEffect } from "react"
import { RootStore } from "./models/root-store/root-store"
import { RootStoreProvider } from "./models/root-store/root-store-context"
import { setupRootStore } from "./models/root-store/setup-root-store"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./screens/home"
import Login from "./screens/login"
import Register from "./screens/register"

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
            <Route exact path="/">
              <Home></Home>
            </Route>
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
