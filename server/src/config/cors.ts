import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    origin : function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL, 'http://localhost:4000']

        if(whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }

    }
}