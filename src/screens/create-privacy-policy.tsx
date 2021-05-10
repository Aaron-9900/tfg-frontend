/* eslint-disable @typescript-eslint/no-extra-semi */
import { Typography, Layout, Button, List, Card, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement, useEffect, useState } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { TopMenu } from "../components/menu/menu"

import { Header } from "../components"
import { Link, Redirect, useHistory, useParams } from "react-router-dom"
import { colors } from "../colors/colors"
import TextArea from "antd/lib/input/TextArea"
import { PrivacyTemplate } from "../services/response-types"
import { UserModel } from "../models/user-model/user-model"
import { GetUserSettings } from "../services/api-types"

const { Text, Title } = Typography
const StyledContent = styled(Content)`
  text-align: initial;
  display: flex;
  padding-right: 100px;
  padding-left: 100px;
  flex: 1;
  background-color: ${colors.backgroundPrimary};
  flex-direction: column;
`

const StyledTypeArea = styled.div`
  padding: 5vh 5vw 5vh 5vw;
  width: 100%;
`
const StyledButton = styled(Button)`
  max-width: 180px;
  margin: 0 5vw 0 5vw;
`

const CreatePrivacyPolicy = observer(function CreatePrivacyPolicy(props): ReactElement {
  const { authStore } = useStores()
  const history = useHistory()
  const [privacyPolicy, setPrivacyPolicy] = useState(authStore.user?.privacyPolicy ?? "")
  const [templates, setTemplates] = useState<PrivacyTemplate[]>([])
  const [status, setStatus] = useState<"success" | "error" | "idle" | "pending">("idle")
  const { id } = useParams<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const userSettings: GetUserSettings = await authStore.getUserSettings()
        if (userSettings.kind !== "ok") {
          throw userSettings
        }
        setPrivacyPolicy(userSettings.user.privacyPolicy ?? "")
        const resp: PrivacyTemplate[] = (await authStore.getPrivactTemplates()) ?? []
        setTemplates(resp)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])
  if (authStore.user?.id !== parseInt(id)) {
    return <Redirect to={`/user/${id}/user-info`} />
  }

  return (
    <Layout>
      <Header>
        <TopMenu currentIndex="1" />
      </Header>
      <StyledContent>
        <StyledTypeArea>
          <Title level={2}>Templates</Title>
          <List
            grid={{ gutter: 20, column: 2 }}
            dataSource={templates}
            renderItem={(item) => (
              <List.Item
                style={{ width: 300, marginTop: 16 }}
                onClick={() => setPrivacyPolicy(item.content)}
              >
                <Skeleton loading={authStore.loading} paragraph={{ rows: 4 }} active>
                  <Card title={item.name}>{item.description}</Card>
                </Skeleton>
              </List.Item>
            )}
          />
          {status === "error" && <Text type="danger">Process failed</Text>}
          {status === "success" && (
            <Text type="success">Privacy policy submitted successfully.</Text>
          )}
          <Skeleton loading={authStore.loading} paragraph={{ rows: 20 }} active>
            <TextArea
              showCount
              value={privacyPolicy}
              onChange={({ target: { value } }) => {
                setPrivacyPolicy(value)
                setStatus("idle")
              }}
              minLength={900}
              maxLength={30000}
              autoSize={{ minRows: 20, maxRows: 60 }}
            />
          </Skeleton>
        </StyledTypeArea>
        <StyledButton
          type="primary"
          onClick={async () => {
            setStatus("pending")
            try {
              await authStore.putUserSetting([{ key: "privacy_policy", value: privacyPolicy }])
              setStatus("success")
            } catch (err) {
              setStatus("error")
            }
          }}
          disabled={authStore.loading}
        >
          Submit
        </StyledButton>
      </StyledContent>
    </Layout>
  )
})

export default CreatePrivacyPolicy
