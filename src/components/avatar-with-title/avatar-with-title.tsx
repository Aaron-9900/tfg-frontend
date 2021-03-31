import React from "react"
import { Row, Col, Avatar } from "antd"
import styled from "styled-components"
import Title from "antd/lib/typography/Title"
import { color } from "../../utils/colors"
const StyledUsernameWrapper = styled.div`
  display: flex;
  margin-bottom: 3vh;
`
const StyledAvatar = styled(Avatar)`
  margin-right: 10px;
`
interface AvatarProps {
  value: string
  size: 2 | 5 | 1 | 3 | 4 | undefined
}
export const AvatarWithTitle = (props: AvatarProps): JSX.Element => {
  const { value, size } = props
  return (
    <Row>
      <Col offset={2} span={18}>
        <StyledUsernameWrapper>
          <StyledAvatar style={{ backgroundColor: color(value) }}>{value[0]}</StyledAvatar>
          <Title level={size}>{value}</Title>
        </StyledUsernameWrapper>
      </Col>
    </Row>
  )
}
