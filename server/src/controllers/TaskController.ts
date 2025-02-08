import type { Request, Response } from "express"
import Task from "../models/Task"
import Project from "../models/Project"

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskByProject = async (req: Request, res: Response) => { 
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project')
            res.json(tasks)
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => { 
        try {
            const { taskId, projectId } = req.params
            const task = await Task.findOne({_id: taskId, project: projectId})

            if(!task) {
                res.status(404).json({error: 'Tarea no encontrada'})
                return
            }

            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateTask = async (req: Request, res: Response) => { 
        try {
            const { taskId, projectId } = req.params
            const task = await Task.findById(taskId)

            if(!task) {
                res.status(404).json({error: 'Tarea no encontrada'})
                return
            }

            if(task.project.toString() !== projectId) {
                res.status(404).json({error: 'Accion no valida'})
                return
            }

            task.name = req.body.name
            task.description = req.body.description
            await task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => { 
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId)

            if(!task) {
                res.status(404).json({error: 'Tarea no encontrada'})
                return
            }
            
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId)

            await Promise.allSettled([task.deleteOne(), req.project.save()])

            res.send('Tarea Eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateStatus = async (req: Request, res: Response) => { 
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId)

            if(!task) {
                res.status(404).json({error: 'Tarea no encontrada'})
                return
            }
            
            const { status } = req.body

            task.status = status
            await task.save()
            res.send('Estado Actualizado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}