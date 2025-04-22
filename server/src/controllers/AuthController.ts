import { Request, Response} from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { Error } from 'mongoose'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { transporter } from '../config/nodemailer'
import { AuthEmails } from '../emails/AuthEmails'

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
            
            // Generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            
            // enviar mail
            AuthEmails.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada correctamente, revisa tu e-mail')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist) {
                res.status(401).json({error: 'Token no válido o expirado'})
                return
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true
            await Promise.allSettled([ user.save(), tokenExist.deleteOne() ])
            res.send('Cuenta confirmada correctamente')
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}