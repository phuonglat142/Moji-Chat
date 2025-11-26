import { model, Schema } from 'mongoose'
import { IUser } from '../interfaces/User.interface'



const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String
    },
    avatarId: {
      type: String
    },
    bio: {
      type: String,
      maxLength: 500
    },
    phone: {
      type: String,
      sparse: true
    }
  },
  {
    timestamps: true
  }
)

const User = model<IUser>('User', userSchema)

export default User
