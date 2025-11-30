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

export interface ILoginBody {
  username: string
  password: string
}

export interface ITokenPayload {
  userId: string
}
