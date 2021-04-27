import { Row, Col, Statistic } from "antd"
import React from "react"

export const Payment = (props: { yourValue: number; yourPayment: number }): JSX.Element => {
  const { yourValue, yourPayment } = props
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title="Account Balance (USD)" value={yourValue} precision={2} />
      </Col>
      <Col span={12}>
        <Statistic title="You pay (USD)" value={yourPayment} precision={2} />
      </Col>
    </Row>
  )
}
