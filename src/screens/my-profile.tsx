import { Avatar, List, Typography, Layout } from "antd"
import { Content, Footer } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { TopMenu } from "../components/menu/menu"
import { RightOutlined } from "@ant-design/icons"

import { Header } from "../components"
import { Link, Redirect, useHistory, useParams } from "react-router-dom"
import { colors } from "../colors/colors"

const StyledList = styled(List)`
  display: flex;
  flex: 1;
  flex-direction: column;
`
const StyledListItem = styled(List.Item)`
  flex: 1;
  padding: 5vh 5vw 5vh 5vw;
  display: flex;
  align-items: center !important;
  &:hover {
    background-color: ${colors.lightGrey};
  }
`
const StyledIcon = styled(RightOutlined)`
  float: right;
  font-size: 3em;
`
const StyledContent = styled(Content)`
  text-align: initial;
  display: flex;
  padding-right: 100px;
  padding-left: 100px;
  flex: 1;
  background-color: ${colors.backgroundPrimary};
`
const MyProfile = observer(function MyProfile(props): ReactElement {
  const { authStore } = useStores()
  const history = useHistory()
  const { id } = useParams<any>()
  const options = [
    { title: "Sumbissions", url: `/user/${id}/submissions` },
    { title: "Privacy Policy", url: `/user/${id}/user-info` },
  ]
  console.log(authStore.user?.id, id)
  if (authStore.user?.id !== parseInt(id)) {
    return <Redirect to={`/user/${id}/user-info`} />
  }
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="1" />
      </Header>
      <StyledContent>
        <StyledList itemLayout="vertical">
          {options.map((option) => (
            <StyledListItem key={option.title} onClick={() => history.push(option.url)}>
              {option.title}
              <StyledIcon />
            </StyledListItem>
          ))}
        </StyledList>
      </StyledContent>
    </Layout>
  )
})

export default MyProfile
