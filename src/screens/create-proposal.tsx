import { Form, Input, InputNumber, Button } from "antd"
import { SizeType } from "antd/lib/config-provider/SizeContext"
import Layout, { Content } from "antd/lib/layout/layout"
import { observer } from "mobx-react-lite"
import React from "react"
import { Switch } from "react-router-dom"
import styled from "styled-components"
import { Header } from "../components"
import { TopMenu } from "../components/menu/menu"
import { useStores } from "../models/root-store/root-store-context"
const StyledContent = styled(Content)`
  padding-top: 5vh;
  padding-bottom: 5vh;
`
const StyledButton = styled(Button)`
  align-self: center;
  width: 20vw;
  max-width: 120px;
`
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`
type FormFields = {
  name: string
  description: string
  rate: number
  limit: number
}
const textValidator = (_: any, value: string, callback: any) => {
  if (value.split(" ").length < 100) {
    callback("Minimum text length is 200")
  } else {
    callback()
  }
}
const CreateProposal = observer(function CreateProposal(props) {
  const { proposalsStore } = useStores()
  const onFinish = async (value: FormFields) => {
    const { name, description, rate, limit } = value
    const resp = await proposalsStore.postProposal(name, description, rate, limit)
  }
  return (
    <Layout>
      <Header>
        <TopMenu currentIndex=""></TopMenu>
      </Header>
      <StyledContent>
        <StyledForm
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={(value) => onFinish(value as FormFields)}
        >
          <Form.Item
            name="name"
            label="Proposal Name"
            rules={[{ message: "This field is required", required: true }]}
          >
            <Input placeholder="Set your proposal name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { message: "This field is required", required: true },
              { validator: textValidator },
            ]}
          >
            <Input.TextArea placeholder="Describe what type of data do you need. Yo may also include why it's neccessary, although that will appear in the privacy prompt." />
          </Form.Item>
          <Form.Item
            name="rate"
            label="Rate"
            extra="Set how much you will pay per submission."
            rules={[{ message: "This field is required", required: true }]}
          >
            <InputNumber min={0} max={1000} />
          </Form.Item>
          <Form.Item
            label="Limit"
            name="limit"
            extra="Set the maximum number of submissions."
            rules={[{ message: "This field is required", required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <StyledButton type="primary" htmlType="submit">
            Create
          </StyledButton>
        </StyledForm>
      </StyledContent>
    </Layout>
  )
})

export default CreateProposal
