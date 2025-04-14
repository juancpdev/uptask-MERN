import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    origin : function(origin, callback) {
        // Lista de orígenes permitidos
        const whiteList = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

        // Permitir solicitudes sin origen (como las del mismo servidor o herramientas como Postman)
        if (!origin) {
            return callback(null, true);
        }

        if(whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true // Permite enviar cookies en solicitudes cross-origin
}