export default interface UserJwt {
    id: number
    role: string
    name: string
    profilePic: string | null
    emailVerified: boolean
    classId?: number
}