import express from 'express'
import { signIn, signOut, signUp } from 'src/controllers/auth.controller'

const router = express.Router()

router.post('/signup', signUp)

router.post('/signin', signIn)

router.post('/signout', signOut)

export default router
