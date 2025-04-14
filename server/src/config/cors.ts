import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    origin : function(origin, callback) {
        // Lista de orígenes permitidos
        const whiteList = [process.env.FRONTEND_URL];


        if(whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true // Permite enviar cookies en solicitudes cross-origin
}