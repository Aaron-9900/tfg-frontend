import React, { useState } from "react"
import { Modal, Button } from "antd"
import { Typography } from "antd"
import { Form, InputNumber, Spin } from "antd"
import { useForm } from "antd/lib/form/Form"

const { Text } = Typography
interface AsyncModalProps {
  onAccept: (ammount: number) => Promise<any>
  onCancel: () => any
  visible: boolean
  setVisible: (visible: boolean) => any
}

export const RechargeFormModal = (props: AsyncModalProps): JSX.Element => {
  const { onAccept, onCancel, visible, setVisible } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form] = useForm()
  const handleOk = async () => {
    const values = form.getFieldsValue()
    const ammount: number = values["ammount"]
    if (!ammount && ammount !== 0) {
      return
    }

    setConfirmLoading(true)
    setErrorMessage(null)
    try {
      await onAccept(ammount)
      setConfirmLoading(false)
      setVisible(false)
    } catch (err) {
      setErrorMessage("Process error")
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel()
    setVisible(false)
  }

  return (
    <>
      <Modal
        title="Confirm payment"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            label="Ammount"
            name="ammount"
            rules={[{ required: true, message: "Please, introduce an ammount" }]}
          >
            <InputNumber placeholder="Min. 10" min={10} />
          </Form.Item>
        </Form>
        {errorMessage ? <Text type="danger">{errorMessage}</Text> : null}
      </Modal>
    </>
  )
}
