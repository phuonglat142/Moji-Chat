import mongoose, { model, Schema } from 'mongoose'
import { ISession } from 'src/interfaces/Session.interface'

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Tự động xóa khi hết hạn
sessionSchema.index(
  {
    expiresAt: 1
  },
  {
    expireAfterSeconds: 0
  }
)

const Session = model<ISession>('Session', sessionSchema)
export default Session
