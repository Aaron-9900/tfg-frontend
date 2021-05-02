import { Avatar, List, Typography } from "antd"
import React, { useState } from "react"
import { CloseSquareOutlined, CheckOutlined, DownloadOutlined } from "@ant-design/icons"
import { SubmissionModel } from "../../models/proposals-model/submission-model"
import { IconText } from "./icon-text"
import { ProposalSubmissionModel } from "../../models/proposals-model/proposal-submission-model"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { color } from "../../utils/colors"
import styled from "styled-components"
import { colors } from "../../colors/colors"
import { SubmissionStatus } from "../../services/response-types"
import CSS from "csstype"
import { AsyncModal } from "../modals/async-modal"
import { AccountBalance } from "../balance/account-balance"
import { Payment } from "../balance/payment"
import { PostSubmissionStatus } from "../../services/api-types"

const { Text } = Typography

const StyledItemListBody = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledProposalLink = styled(Link)`
  color: ${colors.semiTransparent};
`

interface ItemListProps {
  items: { submissions: SubmissionModel[] }
  onFileClick: (fileName: string, submissionId: string) => Promise<string>
  withStatus?: boolean
  withActions?: boolean
  withProposal?: boolean
  proposalId?: number
  hasUserPermissions: boolean
  rate?: number
  balance?: number
}
interface IconTextProps {
  status: SubmissionStatus
  action: "accepted" | "rejected"
}

const statusToColor = (status: SubmissionStatus) => {
  switch (status) {
    case "accepted":
      return colors.success
    case "pending":
      return ""
    case "rejected":
      return colors.error
    case "":
      return ""
  }
}
const StyledIconText = styled(IconText)<IconTextProps>`
  color: ${(props) => statusToColor(props.status)};
`
const getBadgeColorStatus = (status: SubmissionStatus): string => {
  console.log(status)
  switch (status) {
    case "accepted":
      return colors.success
    case "rejected":
      return colors.danger
    case "pending":
    case "":
      return colors.pending
  }
}

export const ItemList = observer(
  (props: ItemListProps): JSX.Element => {
    const {
      items,
      proposalId,
      onFileClick,
      withActions,
      withProposal,
      withStatus,
      hasUserPermissions,
      rate,
      balance,
    } = props
    const [modalOpen, setModalOpen] = useState(false)
    return (
      <List itemLayout="vertical">
        {items.submissions.map((submission: SubmissionModel) => {
          const listWithStatusStyle: CSS.Properties = {
            borderLeft: `20px ${getBadgeColorStatus(submission.submissionStatus)} solid`,
            paddingLeft: "20px",
            marginTop: "20px",
            marginBottom: "20px",
            borderBottom: 0,
          }
          return (
            <List.Item
              key={submission.id}
              style={withStatus ? listWithStatusStyle : {}}
              actions={
                withActions && submission.submissionStatus === "pending"
                  ? [
                      <StyledIconText
                        status={submission.submissionStatus}
                        action="accepted"
                        icon={CheckOutlined}
                        onClick={() => setModalOpen(true)}
                        key="list-vertical-like-o"
                      />,
                      <StyledIconText
                        status={submission.submissionStatus}
                        action="rejected"
                        icon={CloseSquareOutlined}
                        onClick={() => submission.setSubmissionStatus(proposalId ?? 0, "rejected")}
                        key="list-vertical-message"
                      />,
                    ]
                  : undefined
              }
            >
              <AsyncModal
                onAccept={async () => {
                  const resp: PostSubmissionStatus = await submission.setSubmissionStatus(
                    proposalId ?? 0,
                    "accepted",
                  )
                  return resp
                }}
                visible={modalOpen}
                setVisible={setModalOpen}
                onCancel={() => null}
                modalPrimaryText={""}
                InnerComponent={() => <Payment yourValue={balance ?? 0} yourPayment={rate ?? 0} id={submission.id.toString()}/>}
              />
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: color(submission.user.name) }}>
                    {submission.user.name[0]}
                  </Avatar>
                }
                title={submission.user.name}
                description={"Status: " + submission.submissionStatus}
              />
              <StyledItemListBody>
                {withProposal && (
                  <div>
                    <Text type="secondary">Proposal: </Text>
                    <StyledProposalLink to={"/proposal/" + submission.proposal?.id ?? 0}>
                      {submission.proposal?.name ?? ""}
                    </StyledProposalLink>
                  </div>
                )}
                {submission.submissionStatus === "accepted" && hasUserPermissions ? (
                  <a onClick={() => onFileClick(submission.fileName, submission.id.toString())}>
                    Download
                  </a>
                ) : null}
              </StyledItemListBody>
            </List.Item>
          )
        })}
      </List>
    )
  },
)
