import type {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import Project, { IProject } from "../models/Project";

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