import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ITokenPayload } from 'src/interfaces/User.interface'
import User from 'src/models/User.model'

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy access token' })
    }
    // xác nhận token hợp lệ
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, decodedUser: ITokenPayload) => {
      if (err) {
        console.error(err)
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
      }
      // tìm user
      const user = await User.findById(decodedUser.userId).select('-password')

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' })
      }

      // trả về user trong req
      req.user = user
      next()
    })
  } catch (error) {
    console.error('Lỗi khi xác thực người dùng: ', error)
    res.status(500).json({ message: 'Lỗi hệ thống' })
  }
}

export { protectedRoute }
