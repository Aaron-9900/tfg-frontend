import React, { ReactElement, useEffect } from "react"
import { useStores } from "../models/root-store/root-store-context"

export function Home(props): ReactElement {
  const { proposalsStore } = useStores()
  useEffect(() => {
    proposalsStore.getProposals(0, 15)
  }, [])
  return <div></div>
}
