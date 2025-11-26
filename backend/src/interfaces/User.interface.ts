export interface IUser {
  username: string
  password: string
  displayName: string
  email: string
  avatarUrl?: string
  avatarId?: string
  bio?: string
  phone?: string
}

export interface IRegisterBody {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}
