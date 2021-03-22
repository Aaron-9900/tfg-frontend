import { Avatar, List, Typography, Layout, Menu } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement, ReactNode, useEffect } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { color } from "../utils/colors"
import { ProposalModel } from "../models/proposals-model/proposal-model"
const { Paragraph } = Typography

const StyledList = styled(List)`
  width: 100%;
`
const StyledContent = styled(Content)`
  text-align: initial;
  display: flex;
  margin-right: 100px;
  margin-left: 100px;
`
const StyledHeader = styled(Header)`
  color: #ffffff;
`
const Home = observer(function Home(props): ReactElement {
  const { proposalsStore, authStore } = useStores()
  useEffect(() => {
    proposalsStore.getProposals(0, 30)
  }, [])
  return (
    <Layout>
      <StyledHeader>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">{authStore.username}</Menu.Item>
          <Menu.Item key="2">Home</Menu.Item>
        </Menu>
      </StyledHeader>
      <StyledContent>
        <StyledList>
          {proposalsStore.proposals.map(
            (e: ProposalModel): ReactNode => {
              return (
                <List.Item key={e.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: color(e.user.name) }}>
                        {e.user.name[0]}
                      </Avatar>
                    }
                    title={<a href="https://ant.design">{e.name}</a>}
                    description={<Paragraph ellipsis={{ rows: 2 }}>{e.description}</Paragraph>}
                  />
                </List.Item>
              )
            },
          )}
        </StyledList>
      </StyledContent>
      <Footer></Footer>
    </Layout>
  )
})

export default Home
