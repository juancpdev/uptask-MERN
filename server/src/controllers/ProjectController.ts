import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        console.log(req.user);
        
        project.manager = req.user.id
        
        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: {$in: req.user.id} },
                    { team: {$in: req.user.id} }
                ]
            })
            res.send(projects)
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {

            if(req.project.manager.toString() !== req.user.id.toString() && !req.project.team.some(id => id.toString() === req.user.id.toString()) ){ 
                res.status(404).json({error: 'No tienes permisos'})
                return
            }
            res.json(req.project)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error);
        }
    }

}