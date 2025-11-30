import { Response } from 'express'
import { TypedRequestBody } from 'src/type'

const authMe = async (req: TypedRequestBody<null>, res: Response) => {
  try {
    const user = req.user

    return res.status(200).json({ user })
  } catch (error) {
    console.error('Lỗi khi gọi authMe: ', error)
    return res.status(500).json({
      message: 'Lỗi hệ thống'
    })
  }
}

export { authMe }
