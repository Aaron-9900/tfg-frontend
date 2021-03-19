import { Avatar, List, PageHeader, Typography } from "antd"
import { observer } from "mobx-react-lite"
import React, { ReactElement, useEffect } from "react"
import { CenteredBody } from "../components"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { color } from "../utils/colors"
const { Paragraph } = Typography

const StyledList = styled(List)`
  width: 100%;
`
const StyledBody = styled(CenteredBody)`
  text-align: initial;
  display: flex;
  margin-right: 100px;
  margin-left: 100px;
`
const StyledHeader = styled(PageHeader)`
  width: 100vw;
  text-align: right;
  position: relative;
  top: 0;
`
const Home = observer(function Home(props): ReactElement {
  const { proposalsStore, authStore } = useStores()
  useEffect(() => {
    proposalsStore.getProposals(0, 30)
  }, [])
  return (
    <StyledBody>
      <StyledHeader title={authStore.username} subTitle="Welcome" />
      <StyledList>
        {proposalsStore.proposals.map((e) => {
          return (
            <List.Item key={e.id}>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: color(e.user.name) }}>{e.user.name[0]}</Avatar>
                }
                title={<a href="https://ant.design">{e.name}</a>}
                description={<Paragraph ellipsis={{ rows: 2 }}>{e.description}</Paragraph>}
              />
            </List.Item>
          )
        })}
      </StyledList>
    </StyledBody>
  )
})

export default Home
