import type {Request, Response, NextFunction} from "express"
import mongoose from "mongoose";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export const TaskExist = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { taskId } = req.params

        // Validar si es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                errors: [{
                    type: "field",
                    value: taskId,
                    msg: "ID de la tarea no válido",
                    path: "taskId",
                    location: "params"
                }]
            });
        }

        const task = await Task.findById(taskId)
        console.log(task);

        if(!task) {
            const error = new Error('Tarea no encontrada')
            res.status(404).json({error: error.message})
            return
        }
        req.task = task
        next()

    } catch (error) {
        console.log(error);
    }
}

export function taskBelongsToProject(req : Request, res : Response, next : NextFunction) {
    if(req.task.project.toString() !== req.project.id.toString()) {
        res.status(404).json({error: 'Accion no valida'})
        return
    }
    next()
}