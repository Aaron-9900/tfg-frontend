import { Form, Input, InputNumber, Button, Typography, Spin, Select } from "antd"
import Layout, { Content } from "antd/lib/layout/layout"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { colors } from "../colors/colors"
import { Header } from "../components"
import { TopMenu } from "../components/menu/menu"
import { useStores } from "../models/root-store/root-store-context"
const { Text } = Typography
const { Option } = Select

const StyledContent = styled(Content)`
  padding-top: 5vh;
  padding-bottom: 5vh;
  background-color: ${colors.backgroundPrimary};
`
const StyledButton = styled(Button)`
  align-self: center;
  width: 20vw;
  max-width: 120px;
`
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledSpinner = styled(Spin)`
  height: "100%";
  width: "100%";
`
const StyledFormItem = styled(Form.Item)`
  width: 100%;
`

type FormFields = {
  name: string
  description: string
  rate: number
  limit: number
  type?: string
}
const textValidator = (_: any, value: string, callback: any) => {
  if (value.length < 200) {
    callback("Minimum number of characters is 200")
  } else {
    callback()
  }
}
const CreateProposal = observer(function CreateProposal(props) {
  const { proposalsStore, authStore } = useStores()
  const [types, setTypes] = useState<string[]>([])
  const [form] = Form.useForm()
  const onFinish = async (value: FormFields) => {
    const { name, description, rate, limit } = value
    try {
      await proposalsStore.postProposal(name, description, rate, limit, "Facebook")
      form.resetFields()
    } catch (err) {}
  }
  useEffect(() => {
    proposalsStore.setStatus("idle")
    ;(async function () {
      const types = await proposalsStore.getProposalTypes()
      if (types) {
        setTypes(types.map((type) => type.value))
      }
      await authStore.getUserSettings()
    })()
  }, [])
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex=""></TopMenu>
      </Header>
      <StyledContent>
        <StyledForm
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFieldsChange={() => {
            if (proposalsStore.status !== "idle") {
              proposalsStore.setStatus("idle")
            }
          }}
          onFinish={(value) => onFinish(value as FormFields)}
        >
          <StyledFormItem
            name="name"
            label="Proposal Name"
            rules={[{ message: "This field is required", required: true }]}
          >
            <Input placeholder="Set your proposal name" />
          </StyledFormItem>
          <StyledFormItem
            name="description"
            label="Description"
            rules={[
              { message: "This field is required", required: true },
              { validator: textValidator },
            ]}
          >
            <Input.TextArea placeholder="Describe what type of data do you need. Yo may also include why it's neccessary, although that will appear in the privacy prompt." />
          </StyledFormItem>
          <StyledFormItem
            name="rate"
            label="Rate"
            extra="Set how much you will pay per submission."
            rules={[{ message: "This field is required", required: true }]}
          >
            <InputNumber min={0} max={1000} />
          </StyledFormItem>
          <StyledFormItem
            label="Limit"
            name="limit"
            extra="Set the maximum number of submissions."
            rules={[{ message: "This field is required", required: true }]}
          >
            <InputNumber min={1} />
          </StyledFormItem>
          <StyledButton
            type="primary"
            htmlType="submit"
            disabled={!authStore.user?.privacyPolicy.length}
          >
            {proposalsStore.status === "pending" ? <StyledSpinner /> : "Submit"}
          </StyledButton>
          {!authStore.user?.privacyPolicy.length && (
            <Text type="danger">You must have a privacy policy before creating a proposal.</Text>
          )}
          {proposalsStore.status === "error" && <Text type="danger">Process failed</Text>}
          {proposalsStore.status === "done" && (
            <Text type="success">Proposal submitted successfully.</Text>
          )}
        </StyledForm>
      </StyledContent>
    </Layout>
  )
})

export default CreateProposal
