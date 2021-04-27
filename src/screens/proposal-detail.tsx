import React, { useEffect, useState } from "react"
import { Col, Divider, Layout, Row, Spin, Typography } from "antd/lib"
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
import { ItemList } from "../components/items-list/item-list"
import { SubmissionStatus } from "../services/response-types"

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
const StyledSpinner = styled(Spin)`
  height: 100%;
  width: 100%;
  margin-top: 50vh;
  position: "absolute";
`
const ProposalDetail = observer(function (props) {
  const { id } = useParams<ProposalDetailParams>()
  const { proposalDetailStore, authStore } = useStores()
  const [proposal, setProposal] = useState<ProposalModel | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      await proposalDetailStore.getProposal(id)
      setProposal(proposalDetailStore.proposal)
      await authStore.getUserSettings()
    })()
  }, [])
  const onFileClick = async (fileName: string, submissionId: string) => {
    const resp = await proposalDetailStore.getDownloadUrl(fileName, submissionId)
    window.open(resp?.url ?? "")
    return resp?.url ?? ""
  }
  const displayProposals = (): boolean => {
    return (
      proposalDetailStore.proposal?.user.id === authStore.user?.id ||
      (proposalDetailStore.proposal?.hasUserSubmission ?? false)
    )
  }
  const setSubmissionStatus = (submissionId: number, status: SubmissionStatus) => {
    proposalDetailStore.setSubmissionStatus(submissionId, status)
  }
  const isAdmin = () => proposalDetailStore.proposal?.user.id === authStore.user?.id
  if (proposalDetailStore.status === "pending") {
    return <StyledSpinner size="large" />
  }
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
              <Text type="secondary">
                Rate: {proposal.rate.toString()}$ | Submissions: {proposal.submissionCount}/
                {proposal.limit.toString()}
              </Text>
            </Col>
          </Row>
          {displayProposals() ? (
            <>
              <Divider>Submissions</Divider>
              <Row>
                <Col offset={2} span={18}>
                  <ItemList
                    onFileClick={onFileClick}
                    items={proposal}
                    withActions={isAdmin()}
                    proposalId={proposal.id}
                    rate={proposal.rate}
                    balance={authStore.user?.balance}
                    hasUserPermissions={
                      proposalDetailStore.proposal?.user.id === authStore.user?.id
                    }
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Divider>Upload</Divider>
              <UploadSection
                store={proposalDetailStore}
                userId={authStore.user?.id.toString() ?? "0"}
                proposalId={id}
                onSuccess={() => proposalDetailStore.proposal?.setHasUserSubmission(true)}
              />
            </>
          )}
        </StyledBody>
      </StyledContent>
      <Footer></Footer>
    </Layout>
  )
})

export default ProposalDetail
