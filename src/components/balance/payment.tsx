/* eslint-disable @typescript-eslint/no-extra-semi */
import { Row, Col, Statistic, List, Divider } from "antd"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { useStores } from "../../models/root-store/root-store-context"
import { Folder } from "../../services/local-types"
import { FolderSchema } from "../folder-schema/folder-schema"

interface PaymentProps {
  yourValue: number
  yourPayment: number
  id: string
}
export const Payment = observer(
  (props: PaymentProps): JSX.Element => {
    const { submissionsStore } = useStores()
    const { yourValue, yourPayment, id } = props
    const [schema, setSchema] = useState<Folder | null>(null)
    const [schemaStack, setSchemaStack] = useState<Folder[]>([])
    const [currentSchema, setCurrentSchema] = useState<Folder | null>(null)
    useEffect(() => {
      ;(async () => {
        const schema = await submissionsStore.getFileSchema(id)
        setSchema(schema ?? null)
        setCurrentSchema(schema ?? null)
      })()
    }, [submissionsStore, id])
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Account Balance (USD)" value={yourValue} precision={2} />
          </Col>
          <Col span={12}>
            <Statistic title="You pay (USD)" value={yourPayment} precision={2} />
          </Col>
        </Row>
        <Divider>Preview</Divider>
        <Row gutter={16}>
          <FolderSchema
            schema={currentSchema}
            stack={schemaStack}
            onBackPressed={() => {
              const newSchema = schemaStack[schemaStack.length - 1]
              if (newSchema) {
                setCurrentSchema(newSchema)
                setSchemaStack((prevValue) => prevValue.slice(0, schemaStack.length - 1))
              }
            }}
            onFolderClick={(child: Folder) => {
              if (child.children.length) {
                setCurrentSchema(() => child)
                setSchemaStack((prevValue) => [...prevValue, currentSchema!])
              }
            }}
            onPathPressed={(child: Folder, index: number) => {
              if (index >= schemaStack.length) {
                return
              }
              setCurrentSchema(child)
              setSchemaStack((prevValue) => prevValue.slice(0, index))
            }}
          />
        </Row>
      </>
    )
  },
)
