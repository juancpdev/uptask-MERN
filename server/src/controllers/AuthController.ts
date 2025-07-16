import { Request, Response} from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { Error } from 'mongoose'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmails } from '../emails/AuthEmails'
import { generateJWT } from '../utils/jwt'

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
                res.status(404).json({error: 'Token no válido o expirado'})
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

    static login = async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
          }

          if (!user.confirmed) {
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // enviar mail
            AuthEmails.sendConfirmationEmail({
              email: user.email,
              name: user.name,
              token: token.token,
            });

            res.status(401).json({ error: "Usuario no confirmado, revisa tu e-mail" });
            return;
          }

          // Password validation
          const validatePassword = await checkPassword(password, user.password);

          if (!validatePassword) {
            res.status(401).json({ error: "Password incorrecto" });
            return;
          }

          const token = generateJWT({id: user.id})
          res.send(token)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({email})
            if (!user) { 
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({error: error.message})
                return
            }

            if (user.confirmed) { 
                const error = new Error('El Usuario ya esta confirmado')
                res.status(403).json({error: error.message})
                return
            }
            
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
            res.send('Token enviado correctamente, revisa tu e-mail')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({email})
            if (!user) { 
                const error = new Error('El Usuario no esta registrado')
                res.status(404).json({error: error.message})
                return
            }

            const existingToken = await Token.findOne({ user });

            if(existingToken === null) {
                // Generate token
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()
                
                // enviar mail
                AuthEmails.sendResetPassword({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

            res.send('Token enviado correctamente, revisa tu e-mail')
            } else {
                // eliminar token previo
                await existingToken.deleteOne()
                // Generate token
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()
                
                // enviar mail
                AuthEmails.sendResetPassword({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
            res.send('Token reenviado correctamente, revisa tu e-mail')
            }
            

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist) {
                res.status(404).json({error: 'Token no válido o expirado'})
                return
            }

            res.send('Token valido, Define tu nuevo password')
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.params
            const {password} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist) {
                res.status(404).json({error: 'Token no válido o expirado'})
                return
            }

            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Password cambiado correctamente')
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
        return
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExist = await User.findOne({email})
        if(userExist && userExist.id.toString() !== req.user.id.toString()) {
            res.status(409).json({error: 'Ese email ya esta registrado'})
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)
        
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            res.status(401).json({error: 'Contraseña actual incorrecta'})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Contraseña actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
} 