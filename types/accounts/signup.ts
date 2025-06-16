import { User } from "./user"

export type APISignUp = {
    user: User,
    access_token: string,
    refresh_token: string
}