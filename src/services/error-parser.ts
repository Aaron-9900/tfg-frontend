import { GeneralApiProblem } from "./api-problem"

export const parseError = (error: GeneralApiProblem): string => {
  switch (error.kind) {
    case "unauthorized":
      return "Please, provide a valid email or password"
    case "rejected":
      return "Email is already in use"
    default:
      return "Process error"
  }
}
