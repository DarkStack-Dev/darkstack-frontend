import { User } from "./user"

export type APISignUp = {
    user: User,
    authToken: string,
    refreshToken: string
}