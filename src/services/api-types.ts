import { GeneralApiProblem } from "./api-problem"

export type GetUsersResult = { kind: "ok"; token: string } | GeneralApiProblem
