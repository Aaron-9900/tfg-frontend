export interface ApiConfig {
  baseUrl: string
  timeout: number
}

export const API_CONFIG: ApiConfig = {
  baseUrl: "https://tfg-api.hoffman-garcia.eu",
  timeout: 10000,
}
