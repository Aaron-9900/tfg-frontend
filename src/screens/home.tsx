import { Avatar, List, Typography, Layout } from "antd"
import { Content, Footer } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement, ReactNode, useEffect } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { color } from "../utils/colors"
import { ProposalModel } from "../models/proposals-model/proposal-model"
import { TopMenu } from "../components/menu/menu"
import Text from "antd/lib/typography/Text"
import { Header } from "../components"
const { Paragraph } = Typography

const StyledList = styled(List)`
  width: 100%;
`
const StyledContent = styled(Content)`
  text-align: initial;
  display: flex;
  margin-right: 100px;
  margin-left: 100px;
  flex: 1;
`

const Home = observer(function Home(props): ReactElement {
  const { proposalsStore } = useStores()
  useEffect(() => {
    proposalsStore.getProposals(0, 30)
  }, [])
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="2" />
      </Header>
      <StyledContent>
        <StyledList itemLayout="vertical">
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
                    description={e.user.name}
                  />
                  <Text>{e.description}</Text>
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
