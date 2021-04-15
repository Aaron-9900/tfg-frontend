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
import { Link, useParams } from "react-router-dom"
import { ItemList } from "../components/items-list/item-list"
import { colors } from "../colors/colors"

const StyledList = styled(List)`
  width: 100%;
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
  const { submissionsStore, authStore } = useStores()
  const { id } = useParams<any>()
  useEffect(() => {
    submissionsStore.getUserSubmissions()
  }, [])
  const onFileClick = async (fileName: string, submissionId: string) => {
    const resp = await submissionsStore.getDownloadUrl(fileName, submissionId)
    window.open(resp?.url ?? "")
    return resp?.url ?? ""
  }
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="1" />
      </Header>
      <StyledContent>
        <StyledList itemLayout="vertical">
          <ItemList
            onFileClick={onFileClick}
            items={submissionsStore}
            withProposal
            withStatus
            hasUserPermissions={authStore.id === parseInt(id)}
          />
        </StyledList>
      </StyledContent>
      <Footer></Footer>
    </Layout>
  )
})

export default MyProfile
