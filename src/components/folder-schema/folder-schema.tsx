import { List, Row, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { FolderFilled } from "@ant-design/icons"
import { colors } from "../../colors/colors"
import { Folder } from "../../services/local-types"
const { Text, Link } = Typography

interface FolderSchemaProps {
  onFolderClick: (child: Folder) => void
  onBackPressed: () => void
  onPathPressed: (child: Folder, index: number) => void
  schema: Folder | null
  stack: Folder[]
}

const StyledList = styled(List)`
  width: 100%;
  max-height: 40vh;
  overflow-y: scroll;
  overflow-x: hidden;
`
const StyledListItem = styled(List.Item)`
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background: ${colors.lightGrey};
  }
`
const StyledFolderPath = styled(Link)``
const StyledPathWrapper = styled.div`
  font-size: 1em;
  width: 100%;
  padding: 10px;
  overflow: hidden;
`
const StyledFolderName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const FolderSchema = (props: FolderSchemaProps): JSX.Element => {
  const { schema, stack, onFolderClick, onBackPressed, onPathPressed } = props
  if (schema === null) {
    return <></>
  }
  return (
    <>
      <StyledPathWrapper>
        {[...stack, schema].map((child, idx, arr) => (
          <StyledFolderPath onClick={() => onPathPressed(child, idx)} key={child.path}>
            {child.name}
            {idx < arr.length - 1 ? "/" : null}
          </StyledFolderPath>
        ))}
      </StyledPathWrapper>
      <StyledFolderPath onClick={() => onBackPressed()}>Back</StyledFolderPath>
      <StyledList itemLayout="vertical">
        {schema?.children.map((child) => {
          return (
            <StyledListItem
              key={child.path}
              onClick={() => onFolderClick(child)}
              extra={child.isDirectory ? <FolderFilled /> : null}
            >
              <StyledFolderName>{child.name}</StyledFolderName>
            </StyledListItem>
          )
        })}
      </StyledList>
    </>
  )
}
