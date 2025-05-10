import type {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0]?.msg || 'Datos inválidos'
        res.status(400).json({ error: firstError })
        return
    }
    
    next()
}