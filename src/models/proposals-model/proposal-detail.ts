import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import {
  GetDownloadSignedUrl,
  GetSignedUrl,
  GetSingleProposal,
  PutFile,
} from "../../services/api-types"
import { SubmissionStatus } from "../../services/response-types"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-status"
import { UserModel } from "../user-model/user-model"
import { ProposalModel } from "./proposal-model"
import { SubmissionModel } from "./submission-model"

export const ProposalDetailModel = types
  .model("ProposalDetailModel")
  .props({
    proposal: types.maybeNull(ProposalModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => {
    return {
      getProposal: flow(function* (id: string) {
        self.setStatus("pending")
        try {
          const response: GetSingleProposal = yield self.environment.api.getProposal(id)
          if (response.kind !== "ok") {
            throw response
          }
          self.proposal = response.proposal as any
          self.setStatus("idle")
        } catch (err) {
          self.setStatus("error")
        }
      }),
      putFile: flow(function* (
        fileName: string,
        file: File,
        userId: string,
        proposalId: string,
        progress: (event: any) => void,
      ) {
        try {
          const response: PutFile = yield self.environment.api.submitFile(
            fileName,
            file,
            userId,
            proposalId,
            progress,
          )
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          return response
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
      getSignedUrl: flow(function* (fileName: string) {
        self.setStatus("pending")
        try {
          const response: GetSignedUrl = yield self.environment.api.getSignedUrl(fileName)
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
      getDownloadUrl: flow(function* (fileName: string, submissionId: string) {
        try {
          const response: GetDownloadSignedUrl = yield self.environment.api.getFileDownloadUrl(
            fileName,
            submissionId,
          )
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")
          return response.resp
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
      setSubmissionStatus: flow(function* (submissionId: number, status: SubmissionStatus) {
        try {
          const response: GetDownloadSignedUrl = yield self.environment.api.setSubmissionStatus(
            submissionId,
            self.proposal?.id ?? 0,
            status,
          )
          if (response.kind !== "ok") {
            throw response
          }
          self.setStatus("idle")

          return response
        } catch (err) {
          console.log(err)
          self.setStatus("error")
        }
      }),
    }
  })

type ProposalDetailModelType = Instance<typeof ProposalDetailModel>
export interface ProposalDetailModel extends ProposalDetailModelType {}
type ProposalDetailModelSnapshotType = SnapshotOut<typeof ProposalDetailModel>
export interface ProposalDetailModelSnapshot extends ProposalDetailModelSnapshotType {}
