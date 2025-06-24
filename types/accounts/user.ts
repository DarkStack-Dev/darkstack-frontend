
export type User = {
    id: string,
    // avatar: string,
    name: string,
    email: string,
    roles: string[],
    // last_access: string,
    // is_superuser: boolean,
    createdAt: string,
    updatedAt: string
}

export type APIUser = {
    user: User
}

type UserUpdate = {
    id: string,
    avatar: string,
    name: string,
    email: string,
    type_account: string,
    last_access: string,
    is_superuser: boolean,
    created_date: string,
    deleted_at: string
}
// depois tenho que vim aqui editar por que tem mais campo para editar
export type APIUserUpdate = {
    user: UserUpdate
}

export type APIUserDelete = {
    message: string
}