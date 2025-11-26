import express from 'express'
import 'dotenv/config'
import { connectDB } from 'libs/db'
import authRoutes from 'src/routes/auth.router'

const app = express()
const PORT = process.env.PORT || 8080

//middleware
app.use(express.json())

//public routes

app.use('/api/auth', authRoutes)

//private routes

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
