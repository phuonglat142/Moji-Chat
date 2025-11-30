import { Types } from 'mongoose'

export interface ISession {
  userId: Types.ObjectId
  refreshToken: string
  expiresAt: Date
}
