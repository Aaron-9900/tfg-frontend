export interface User {
  id: number
  created_at: Date
  name: string
  privacy_policy?: string
  balance?: number
}
export interface Login {
  access_token: string
  refresh_token: string
  user: User
}

export interface ProposalList {
  count: number
  proposals: ProposalDetail[]
}

export interface ProposalDetail {
  id: number
  created_at: Date
  user: User
  limit: number
  name: string
  description: string
  rate: number
  type: string
  submissions?: Submission[]
  submission_count: number
  has_user_submission: boolean
}
export interface PrivacyTemplate {
  id: number
  content: string
  name: string
  description: string
}

export interface ProposalType {
  value: string
  id: number
}

export interface BackendSignedUrlResponse {
  file_name: string
  url: string
}
export interface Submission {
  id: number
  created_at: Date
  user: User
  file_name: string
  content_type: string
  proposal: ProposalDetail
  status: SubmissionStatus
}

export type BackendSubmissions = Submission[]

export type SubmissionStatus = "pending" | "accepted" | "rejected" | ""
