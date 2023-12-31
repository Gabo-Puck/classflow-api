export default interface UserJwt {
    id: number
    role: string
    name: string
    lastname: string
    profilePic: string | null
    emailVerified: boolean
    email: string
    classId?: number
}