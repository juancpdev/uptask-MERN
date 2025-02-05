import type {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import Project, { IProject } from "../models/Project";
import mongoose from "mongoose";

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export const validateProjectExist = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { projectId } = req.params

        // Validar si es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                errors: [{
                    type: "field",
                    value: projectId,
                    msg: "ID de proyecto no válido",
                    path: "projectId",
                    location: "params"
                }]
            });
        }

        const project = await Project.findById(projectId)
        console.log(project);

        if(!project) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        req.project = project
        next()

    } catch (error) {
        console.log(error);
    }
}