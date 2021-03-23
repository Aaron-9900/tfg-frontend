import React from "react"
import { BasicProps, Header as AntdHeader } from "antd/lib/layout/layout"
import styled from "styled-components"

const StyledHeader = styled(AntdHeader)`
  color: #ffffff;
  padding: 0px;
`
export function Header(props: BasicProps): JSX.Element {
  return <StyledHeader {...props}></StyledHeader>
}
