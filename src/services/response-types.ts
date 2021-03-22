export interface User {
  id: number
  created_at: Date
  name: string
}
export interface Login {
  access_token: string
  refresh_token: string
  user: User
}

export interface Proposal {
  id: number
  created_at: Date
  user: User
  limit: number
  name: string
  description: string
  rate: number
}
