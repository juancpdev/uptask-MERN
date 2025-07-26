import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmails {
    static sendConfirmationEmail = async (user : IEmail)  => {
        await transporter.sendMail({
            from: 'UpTask <jpdevsoporte@gmail.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            
            `
        })
    }

        static sendResetPassword = async (user : IEmail)  => {
        await transporter.sendMail({
            from: 'UpTask <jpdevsoporte@gmail.com>',
            to: user.email,
            subject: 'UpTask - Reestablecer password',
            text: 'UpTask - Reestablecer password',
            html: `<p>Hola ${user.name}, Recibimos una solicitud para restablecer la password de tu cuenta. Si fuiste vos quien hizo esta solicitud, hacé clic en el siguiente enlace para crear una nueva contraseña:</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos. Si no solicitaste cambiar tu password, podés ignorar este mensaje y no se realizará ningún cambio.</p>
                <p>Gracias</p>
            
            `
        })
    }
}