export interface LocalLogin {
  accessToken: string
  refreshToken: string
  username: string
  id: number
}
export type Folder = { name: string; children: Folder[]; path?: string; isDirectory?: boolean }
export type SignedUrlType = { url: string; fileName: string }
export type SignedDownloadUrlType = { url: string }
