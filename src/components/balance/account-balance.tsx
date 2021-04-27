import { Row, Col, Statistic, Button } from "antd"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { RechargeFormModal } from "../modals/recharge-form-modal"

interface AccountBalanceProps {
  value: number
  recharge: (ammount: number) => Promise<any>
}

export const AccountBalance = observer((props: AccountBalanceProps) => {
  const { value, recharge } = props
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  async function onFormAccept(ammount: number) {
    setLoading(true)
    await recharge(ammount)
    setLoading(false)
  }
  return (
    <Row gutter={16}>
      <Col span={20}>
        <Statistic title="Account Balance (USD)" value={value} precision={2} />
        <Button
          style={{ marginTop: 16 }}
          onClick={() => setFormVisible(true)}
          loading={loading}
          type="primary"
        >
          Recharge
        </Button>
      </Col>
      <RechargeFormModal
        visible={formVisible}
        setVisible={setFormVisible}
        onAccept={onFormAccept}
        onCancel={() => {
          null
        }}
      />
    </Row>
  )
})
