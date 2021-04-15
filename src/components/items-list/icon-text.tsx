import { Space } from "antd"
import React from "react"

export const IconText = ({
  icon,
  text,
  onClick,
}: {
  icon?: any
  text?: any
  onClick?: any
}): JSX.Element => (
  <div onClick={onClick} style={{ cursor: "pointer" }}>
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  </div>
)
