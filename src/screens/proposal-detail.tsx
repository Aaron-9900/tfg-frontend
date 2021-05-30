import React, { useEffect, useState } from "react"
import { Checkbox, Col, Divider, Layout, Row, Spin, Typography } from "antd/lib"
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
const StyledPrivacyPolicyContainer = styled.div`
  max-height: 500px;
  overflow: scroll;
  overflow-x: hidden;
  font-size: 1.5em;
`
const ProposalDetail = observer(function (props) {
  const { id } = useParams<ProposalDetailParams>()
  const { proposalDetailStore, authStore } = useStores()
  const [proposal, setProposal] = useState<ProposalModel | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

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
              <Title level={2}>Privacy policy</Title>
            </Col>
          </Row>
          <StyledPrivacyPolicyContainer>
            <Col offset={2} span={18}>
              <Text>{proposal.user.privacyPolicy}</Text>
            </Col>
          </StyledPrivacyPolicyContainer>
          <Row>
            <Col offset={2} span={18}>
              <Text type="secondary">
                Rate: {proposal.rate.toString()}$ | Submissions: {proposal.submissionCount}/
                {proposal.limit.toString()}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col offset={2} span={18}>
              <Checkbox onChange={(e: any) => setAccepted(e.target.checked)}>
                Accept privacy policy
              </Checkbox>
            </Col>
          </Row>
          <>
            <Divider>Upload</Divider>
            {submissionSuccess && <Text type="success">Submission submitted successfully.</Text>}
            <UploadSection
              enabled={accepted}
              store={proposalDetailStore}
              userId={authStore.user?.id.toString() ?? "0"}
              proposalId={id}
              onSuccess={() => {
                proposalDetailStore.proposal?.setHasUserSubmission(true)
                setSubmissionSuccess(true)
              }}
            />
          </>
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
                  hasUserPermissions={proposalDetailStore.proposal?.user.id === authStore.user?.id}
                />
              </Col>
            </Row>
          </>
        </StyledBody>
      </StyledContent>
      <Footer></Footer>
    </Layout>
  )
})

export default ProposalDetail
