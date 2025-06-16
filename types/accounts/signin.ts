import { User } from "./user"

export type APISignIn = {
    user: User,
    access_token: string,
    refresh_token: string
}