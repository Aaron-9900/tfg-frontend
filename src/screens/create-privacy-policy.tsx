import { Typography, Layout, Button } from "antd"
import { Content } from "antd/lib/layout/layout"

import { observer } from "mobx-react-lite"
import React, { ReactElement, useState } from "react"
import { useStores } from "../models/root-store/root-store-context"
import styled from "styled-components"
import { TopMenu } from "../components/menu/menu"

import { Header } from "../components"
import { Link, Redirect, useHistory, useParams } from "react-router-dom"
import { colors } from "../colors/colors"
import TextArea from "antd/lib/input/TextArea"

const { Text } = Typography
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
  const [privacyPolicy, setPrivacyPolicy] = useState("")
  const { id } = useParams<any>()
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
          <Text>Please, remember that your privacy policy must be GDPR compliant.</Text>
          <TextArea
            showCount
            value={privacyPolicy}
            onChange={({ target: { value } }) => {
              setPrivacyPolicy(value)
            }}
            minLength={900}
            maxLength={10000}
            autoSize={{ minRows: 20, maxRows: 60 }}
          />
        </StyledTypeArea>
        <StyledButton
          type="primary"
          onClick={async () =>
            await authStore.putUserSetting([{ key: "privacy_policy", value: privacyPolicy }])
          }
          disabled={authStore.loading}
        >
          Submit
        </StyledButton>
      </StyledContent>
    </Layout>
  )
})

export default CreatePrivacyPolicy
