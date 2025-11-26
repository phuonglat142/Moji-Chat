import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { IRegisterBody } from '../interfaces/User.interface'
import { TypedRequestBody } from '../type'
import User from '../models/User.model'

const signUp = async(req: TypedRequestBody<IRegisterBody>, res: Response) => {
    try {
        const {username, password, email, firstName, lastName} = req.body

        if(!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Không được để trống username, password, email, firstName, lastName"
            })
        }

        //Kiểm tra username tồn tại chưa
        const duplicate = await User.findOne({username}).lean()

        if(duplicate) {
            return res.status(409).json({
                message: "username đã tồn tại"
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
        console.error("Lỗi khi gọi signUp", error)
        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
  
}

export { signUp }
