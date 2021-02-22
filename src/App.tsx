import { observer } from "mobx-react-lite"
import React, { useState, useEffect, Suspense } from "react"
import { RootStore } from "./models/root-store/root-store"
import { RootStoreProvider } from "./models/root-store/root-store-context"
import { setupRootStore } from "./models/root-store/setup-root-store"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Spin } from "antd"
const Home = React.lazy(() => import("./screens/home"))
const Login = React.lazy(() => import("./screens/login"))
const Register = React.lazy(() => import("./screens/register"))

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
    <div className="App">
      <RootStoreProvider value={rootStore}>
        <Suspense fallback={<Spin size="large" style={{ color: "red" }} />}>
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
        </Suspense>
      </RootStoreProvider>
    </div>
  )
})

export default App
