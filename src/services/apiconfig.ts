export interface ApiConfig {
  baseUrl: string
  timeout: number
}

export const API_CONFIG: ApiConfig = {
  baseUrl: "http://localhost:3000",
  timeout: 10000,
}
