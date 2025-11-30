import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { ILoginBody, IRegisterBody } from '../interfaces/User.interface'
import { TypedRequestBody } from '../type'
import User from '../models/User.model'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import crypto from 'crypto'
import Session from 'src/models/Session.model'

const signUp = async (req: TypedRequestBody<IRegisterBody>, res: Response) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Không được để trống username, password, email, firstName, lastName'
      })
    }

    //Kiểm tra username tồn tại chưa
    const duplicate = await User.findOne({ username }).lean()

    if (duplicate) {
      return res.status(409).json({
        message: 'username đã tồn tại'
      })
    }

    //Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    //Tạo user mới
    await User.create({
      username,
      password: hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`
    })

    //return
    return res.sendStatus(204)
  } catch (error) {
    console.error('Lỗi khi gọi signUp', error)
    return res.status(500).json({
      message: 'Lỗi hệ thống'
    })
  }
}

const signIn = async (req: TypedRequestBody<ILoginBody>, res: Response) => {
  try {
    // lấy inputs
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Thiếu username hoặc password'
      })
    }
    // lấy hassPassword từ db so sánh với password
    const user = await User.findOne({ username }).lean()

    if (!user) {
      return res.status(401).json({
        message: 'Username hoặc password không đúng'
      })
    }

    const checkPassword = bcrypt.compareSync(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({
        message: 'Username hoặc password không đúng'
      })
    }
    // nếu khớp tạo accessToken với JWT
    const accessToken = jwt.sign(
      {
        userId: user._id
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ms(process.env.ACCESS_TOKEN_TTL as ms.StringValue) / 1000
      }
    )

    // tạo session mới để lưu refreshToken
    const refreshToken = crypto.randomBytes(64).toString('hex')

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL as ms.StringValue) / 1000)
    })

    // gửi refreshToken vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms(process.env.REFRESH_TOKEN_TTL as ms.StringValue) / 1000
    })

    // trả accessToken về cho client
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken
    })
  } catch (error) {
    console.error('Lỗi khi gọi signIn', error)
    return res.status(500).json({
      message: 'Lỗi hệ thống'
    })
  }
}

const signOut = async (req: TypedRequestBody<null>, res: Response) => {
  try {
    // Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken

    if (token) {
      // xóa refreshToken trong session
      await Session.deleteOne({
        refreshToken: token
      })

      // xóa cookie
      res.clearCookie('refreshToken')
    }

    return res.sendStatus(204)
  } catch (error) {
    console.error('Lỗi khi gọi signOut', error)
    return res.status(500).json({
      message: 'Lỗi hệ thống'
    })
  }
}

export { signUp, signIn, signOut }
