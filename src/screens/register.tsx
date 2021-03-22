import { Form, Input, Button, Spin, Typography } from "antd"
import React, { useState } from "react"
import { colors } from "../colors/colors"
import { CenteredBody } from "../components"
import { useStores } from "../models/root-store/root-store-context"
import { parseError } from "../services/error-parser"
import styled from "styled-components"
import { Link, Redirect } from "react-router-dom"
import Title from "antd/lib/typography/Title"
import { observer } from "mobx-react-lite"

const { Text, Link: AntdLink } = Typography

const StyledForm = styled(Form)`
  padding: 70px;
  background-color: ${colors.backgroundSecondary};
  width: 45vw;
  border-color: ${(props: StyledFormProps) =>
    props.err ? colors.error : colors.secondaryBackground};
`
const StyledTitle = styled(Title)`
  text-align: "left";
  margin-bottom: "20px";
`
const StyledSpinner = styled(Spin)`
  height: "100%";
  width: "100%";
`
const StyledLink = styled(AntdLink)`
  margin-bottom: 20px;
`
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const StyledTextWrapper = styled.div`
  padding: 20px;
`

type StyledFormProps = {
  err: string | false
}

type FormFields = {
  email: string
  name: string
  password: string
}

const Register = observer(() => {
  const [form] = Form.useForm()
  const { authStore } = useStores()
  const [err, setErr] = useState<string | false>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const verifyPasswordValidator = (
    _: any,
    verifyPassword: string,
    callback: (arg0?: string) => void,
  ) => {
    if (verifyPassword !== form.getFieldValue("password")) {
      callback("Passwords do not match!")
    } else {
      callback()
    }
  }
  const onFinish = async (value: FormFields) => {
    try {
      const resp = await authStore.register(value.email, value.name, value.password)
      setRedirect(true)
      console.log(resp)
    } catch (e) {
      console.log(e)
      setErr(parseError(e))
    }
  }
  if (redirect) {
    return <Redirect to="/login"></Redirect>
  }
  return (
    <CenteredBody>
      <StyledForm
        {...layout}
        form={form}
        name="basic"
        onFinish={(value) => onFinish(value as FormFields)}
        err={err}
        onFieldsChange={() => setErr(false)}
      >
        <StyledTitle level={2}>Register</StyledTitle>
        <StyledTextWrapper>
          <StyledLink>
            <Link to="/">Already have an account? Login here</Link>
          </StyledLink>
        </StyledTextWrapper>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input your name!" },
            { min: 4, message: "Username must be minimum 5 characters." },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "" },
            {
              type: "email",
              message: "Please provide a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Verify password"
          name="verifyPassword"
          rules={[
            { required: true, message: "" },
            { validator: verifyPasswordValidator },
            { min: 6, message: "Password must be minimum 6 characters." },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={authStore.loading}>
            {authStore.loading ? <StyledSpinner /> : "Submit"}
          </Button>
        </Form.Item>
        {err && <Text type="danger">{err.toString()}</Text>}
      </StyledForm>
    </CenteredBody>
  )
})

export default Register
