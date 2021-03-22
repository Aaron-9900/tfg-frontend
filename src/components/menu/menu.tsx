import React, { ReactNode } from "react"
import { Button, Menu } from "antd"
import styled from "styled-components"
import { Redirect } from "react-router"
import { useHistory } from "react-router-dom"
import { useStores } from "../../models/root-store/root-store-context"
import { observer } from "mobx-react-lite"

const StyledMenu = styled(Menu)`
  align-items: center;
  display: flex;
`
const StyledButton = styled(Button)`
  margin-left: auto;
`
type MenuProps = {
  currentIndex: string
}

export const TopMenu = observer(function (props: MenuProps): JSX.Element {
  const { currentIndex } = props
  const { authStore } = useStores()
  const history = useHistory()
  return (
    <StyledMenu theme="dark" mode="horizontal" defaultSelectedKeys={[currentIndex]}>
      <Menu.Item key="1">{authStore.username}</Menu.Item>
      <Menu.Item key="2" onClick={() => history.push("/")}>
        Home
      </Menu.Item>
      <StyledButton
        type="primary"
        style={{ float: "right" }}
        onClick={() => history.push("/proposal/create")}
      >
        Create Proposal
      </StyledButton>
    </StyledMenu>
  )
})
