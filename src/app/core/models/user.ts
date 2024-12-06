export interface Root {
    users: User[]
}

export interface User {
    id: number
    username: string
    password: string
    role: string
}
