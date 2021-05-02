import React, { useState } from "react"
import { Modal, Button } from "antd"
import { Typography } from "antd"
const { Text } = Typography
interface AsyncModalProps {
  onAccept: () => Promise<any>
  onCancel: () => any
  modalPrimaryText: string
  visible: boolean
  setVisible: (visible: boolean) => any
  InnerComponent: () => JSX.Element
}

export const AsyncModal = (props: AsyncModalProps): JSX.Element => {
  const { onAccept, onCancel, modalPrimaryText, visible, setVisible, InnerComponent } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState(modalPrimaryText)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const showModal = () => {
    setVisible(true)
  }

  const handleOk = async () => {
    setConfirmLoading(true)
    setErrorMessage(null)
    try {
      const resp = await onAccept()
      if (resp.kind === "precondition-failed") {
        setErrorMessage("Not enough balance")
        setConfirmLoading(false)
      } else {
        setVisible(false)
      }
    } catch (err) {
      setConfirmLoading(false)
    }
    setConfirmLoading(false)
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
        <InnerComponent />
        {errorMessage ? <Text type="danger">{errorMessage}</Text> : null}
      </Modal>
    </>
  )
}
