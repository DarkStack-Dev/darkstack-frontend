import { User } from "./user"

export type APISignIn = {
    user: User,
    authToken: string,
    refreshToken: string
}