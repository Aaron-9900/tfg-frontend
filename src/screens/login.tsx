import { Form, Input, Button, Spin } from "antd"
import Title from "antd/lib/typography/Title"
import React, { ReactElement, useState } from "react"
import styled from "styled-components"
import { colors } from "../colors/colors"
import { CenteredBody } from "../components/index"
import { useStores } from "../models/root-store/root-store-context"
import { parseError } from "../services/error-parser"
import { Typography } from "antd"
import { observer } from "mobx-react-lite"
import { Link, Redirect } from "react-router-dom"

const { Text, Link: AntdLink } = Typography

const StyledForm = styled(Form)`
  padding: 50px;
  background-color: ${colors.backgroundSecondary};
  border-width: "1px";
  border-color: ${(props) => (props.err ? colors.error : colors.secondaryBackground)};
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
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
const StyledTextWrapper = styled.div`
  padding: 20px;
`

const Login = observer(function Login(): ReactElement {
  const { authStore } = useStores()
  const [err, setErr] = useState<string | false>(false)
  const [isLogged, setLogged] = useState<boolean>(false)
  const onFinish = async (value) => {
    try {
      await authStore.login(value.email, value.password)
      setLogged(true)
    } catch (e) {
      console.log(e)
      setErr(parseError(e))
    }
  }
  if (isLogged) {
    return <Redirect to="/"></Redirect>
  }
  return (
    <CenteredBody>
      <StyledForm
        {...layout}
        name="basic"
        onFinish={onFinish}
        err={err}
        onFieldsChange={() => setErr(false)}
      >
        <StyledTitle level={2}>Login</StyledTitle>
        <StyledTextWrapper>
          <StyledLink>
            <Link to="/register">If you dont have an account, please register</Link>
          </StyledLink>
        </StyledTextWrapper>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={authStore.loading}>
            {authStore.loading ? <StyledSpinner /> : "Submit"}
          </Button>
        </Form.Item>
        {err && <Text type="danger">{err}</Text>}
      </StyledForm>
    </CenteredBody>
  )
})

export default Login
