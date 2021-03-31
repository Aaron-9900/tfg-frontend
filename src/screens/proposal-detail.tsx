import React, { useEffect, useState } from "react"
import { Col, Divider, Layout, Row, Typography } from "antd"
import { Content, Footer } from "antd/lib/layout/layout"
import Paragraph from "antd/lib/typography/Paragraph"
import Title from "antd/lib/typography/Title"
import { observer } from "mobx-react-lite"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { colors } from "../colors/colors"
import { Header } from "../components"
import { TopMenu } from "../components/menu/menu"
import { ProposalModel } from "../models/proposals-model/proposal-model"
import { useStores } from "../models/root-store/root-store-context"
import { UploadSection } from "./proposal-detail/upload-section"
import { AvatarWithTitle } from "../components/avatar-with-title/avatar-with-title"

const { Text } = Typography

interface ProposalDetailParams {
  id: string
}

const StyledContent = styled(Content)`
  background-color: ${colors.backgroundPrimary};
`
const StyledBody = styled.div`
  margin-top: 3vh;
  margin-bottom: 5vh;
`
const ProposalDetail = observer(function (props) {
  const { id } = useParams<ProposalDetailParams>()
  const { proposalDetailStore } = useStores()
  const [proposal, setProposal] = useState<ProposalModel | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      await proposalDetailStore.getProposal(id)
      setProposal(proposalDetailStore.proposal)
    })()
  }, [])
  if (!proposal) {
    return <></>
  }
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="2" />
      </Header>
      <StyledContent>
        <StyledBody>
          <AvatarWithTitle value={proposal.user.name} size={4} />
          <Row>
            <Col offset={2} span={18}>
              <Title level={2}>{proposal.name}</Title>
            </Col>
          </Row>
          <Row>
            <Col offset={2} span={18}>
              <Paragraph>{proposal.description}</Paragraph>
            </Col>
          </Row>
          <Row>
            <Col offset={2} span={18}>
              <Text type="secondary">Rate: {proposal.rate.toString()}$ | Submissions: 2/100</Text>
            </Col>
          </Row>
        </StyledBody>
        <Divider>Upload</Divider>
        <UploadSection store={proposalDetailStore} />
      </StyledContent>
      <Footer></Footer>
    </Layout>
  )
})

export default ProposalDetail
