import { CorsOptions } from "cors";

const whiteList = [
  process.env.FRONTEND_URL,                // URL de Vercel (desde variables de entorno)
  "http://localhost:5173"                  // Para pruebas locales (si las hacés)
];

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    console.log("Solicitud desde ORIGIN:", origin);
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true
};
