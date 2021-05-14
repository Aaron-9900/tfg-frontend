import { Avatar, List, Typography, Layout } from "antd"
import { Content, Footer } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { color } from "../utils/colors"
import { ProposalModel } from "../models/proposals-model/proposal-model"
import { TopMenu } from "../components/menu/menu"
import Text from "antd/lib/typography/Text"
import { Header } from "../components"
import { Link } from "react-router-dom"
import { colors } from "../colors/colors"
import { toJS } from "mobx"

const StyledList = styled(List)`
  width: 100%;
  margin-bottom: 30px;
`
const StyledContent = styled(Content)`
  text-align: initial;
  display: flex;
  padding-right: 100px;
  padding-left: 100px;
  flex: 1;
  background-color: ${colors.backgroundPrimary};
`

const Home = observer(function Home(props): ReactElement {
  const { proposalsStore } = useStores()
  const maxItems = 15
  useEffect(() => {
    proposalsStore.getProposals(0, maxItems)
  }, [])
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="2" />
      </Header>
      <StyledContent>
        <StyledList
          itemLayout="vertical"
          pagination={{
            pageSize: maxItems,
            total: proposalsStore.count ?? 0,
            onChange: async (page) => {
              await proposalsStore.getProposals((page - 1) * maxItems, page * maxItems)
              window.scrollTo(0, 0)
            },
          }}
          dataSource={toJS(proposalsStore.proposals)}
          renderItem={(item, index): ReactNode => {
            const proposal = item as ProposalModel
            return (
              <List.Item key={proposal.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: color(proposal.user.name) }}>
                      {proposal.user.name[0]}
                    </Avatar>
                  }
                  title={<Link to={`/proposal/${proposal.id}`}>{proposal.name}</Link>}
                  description={proposal.user.name}
                />
                <Text>{proposal.description}</Text>
              </List.Item>
            )
          }}
        />
      </StyledContent>

      <Footer></Footer>
    </Layout>
  )
})

export default Home
