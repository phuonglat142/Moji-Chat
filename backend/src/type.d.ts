import { Request } from 'express'
import { IUser } from 'src/interfaces/User.interface'

declare module 'express' {
  interface Request {
    user?: IUser
    cookies?: {
      refreshToken?: string
    }
  }
}

export interface TypedRequestBody<T> extends Request {
  body: T
}
