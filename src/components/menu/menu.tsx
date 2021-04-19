import React from "react"
import { Button, Menu } from "antd"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { useStores } from "../../models/root-store/root-store-context"
import { observer } from "mobx-react-lite"

const StyledMenu = styled(Menu)`
  align-items: center;
  display: flex;
  width: 100vw;
  padding: 0 30px 0 30px;
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
    <StyledMenu theme="light" mode="horizontal" defaultSelectedKeys={[currentIndex]}>
      <Menu.Item
        key="1"
        onClick={() => {
          if (!authStore.isLogged) {
            history.push("/login")
          } else {
            history.push("/user/" + authStore.user?.id)
          }
        }}
      >
        {authStore.isLogged ? authStore.user?.name : "Log in"}
      </Menu.Item>
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
      {authStore.isLogged && (
        <Menu.Item
          key="3"
          style={{ float: "right" }}
          onClick={() => {
            authStore.logout()
            history.push("/login")
          }}
        >
          Log out
        </Menu.Item>
      )}
    </StyledMenu>
  )
})
