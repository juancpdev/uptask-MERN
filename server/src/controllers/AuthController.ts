import { Request, Response} from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { Error } from 'mongoose'

export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            const { password, email } = req.body

            // Prevenir duplicados
            const userExist = await User.findOne({email})
            if (userExist) { 
                const error = new Error('El email ya esta registrado')
                res.status(409).json({error: error.message})
                return
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)
            await user.save()

            res.send('Cuenta creada correctamente, revisa tu e-mail')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}