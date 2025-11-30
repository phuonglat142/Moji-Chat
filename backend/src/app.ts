import 'dotenv/config'
import express from 'express'
import authRoutes from 'src/routes/auth.router'
import userRoutes from 'src/routes/user.router'
import { connectDB } from 'src/libs/db'
import cookieParser from 'cookie-parser'
import { protectedRoute } from 'src/middlewares/auth.middleware'

const app = express()
const PORT = process.env.PORT || 8080

//middleware
app.use(express.json())
app.use(cookieParser())

//public routes
app.use('/api/auth', authRoutes)

//private routes
app.use(protectedRoute)
app.use('/api/users', userRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
