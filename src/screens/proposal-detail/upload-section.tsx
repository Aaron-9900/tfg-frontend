import { List, Progress } from "antd"
import { DraggerProps } from "antd/lib/upload"
import Dragger from "antd/lib/upload/Dragger"
import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import { PutFile } from "../../services/api-types"
import { observer } from "mobx-react-lite"

interface UploadSectionProps {
  userId: string
  proposalId: string
  enabled: boolean
  store: {
    putFile: (name: string, file: File, userId: string, proposalId: string, progress: any) => any
  }
  onSuccess?: () => void
}

export const UploadSection = observer(
  (props: UploadSectionProps): JSX.Element => {
    const { store, userId, proposalId, enabled, onSuccess } = props
    const [progress, setProgress] = useState(0)
    const [enableUpload, setEnableUpload] = useState(true)
    const [uploadList, setUploadList] = useState<Array<string>>([])
    const uploader: DraggerProps = {
      customRequest: async function (options) {
        const { onError, file, onProgress } = options
        const progress = (event: any) => {
          const percent = Math.floor((event.loaded / event.total) * 100)
          setProgress(percent)
          if (onProgress) {
            // @ts-expect-error Wrong interface usage
            onProgress({ percent: (event.loaded / event.total) * 100 })
          }
        }
        setUploadList((list) => [...list, file.name])
        const fileResp = await store.putFile(file.name, file, userId, proposalId, progress)
        if (fileResp?.kind === "ok") {
          setEnableUpload(false)
          if (onSuccess) onSuccess()
        }
      },
      disabled: !enableUpload,
      multiple: false,
      showUploadList: false,
    }
    return (
      <>
        <Dragger {...uploader} disabled={!enabled}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
        {uploadList.length > 0 && (
          <List
            size="small"
            bordered
            dataSource={uploadList}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item} description={<Progress percent={progress} />} />
              </List.Item>
            )}
          />
        )}
      </>
    )
  },
)
