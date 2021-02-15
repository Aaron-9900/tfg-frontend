import { GeneralApiProblem } from "./api-problem"

export const parseError = (error: GeneralApiProblem): string => {
  switch (error.kind) {
    case "unauthorized":
      return "Please, provide a valid email or password"
    default:
      return "Process error"
  }
}
