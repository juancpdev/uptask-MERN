import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("email name id");
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate({
            path: 'team',
            select: 'email name id' 
        })
        res.send(project.team)
        
      
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const user = await User.findById(id).select("id");
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      if (
        req.project.team.some((team) => team.toString() === user.id.toString())
      ) {
        res.status(400).json({ error: "El usuario ya está en el equipo" });
        return;
      }

    if (req.user.id.toString() === user.id.toString()) {
      res.status(400).json({ error: "No puedes agregarte a ti mismo" });
      return;
    }

      req.project.team.push(user.id);
      await req.project.save();

      res.send("Usuario agregado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static removeMemberById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!req.project.team.some((team) => team.toString() === userId)) {
        res.status(409).json({ error: "El usuario no existe en el proyecto" });
        return;
      }

      req.project.team = req.project.team.filter(
        (team) => team.toString() !== userId
      );
      await req.project.save();

      res.send("Usuario eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static leaveProject = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id.toString()

    // Verificar que el usuario esté en el equipo
    if (!req.project.team.some((member) => member.toString() === userId)) {
        res.status(409).json({ error: 'No perteneces a este proyecto' });
        return 
    }

      req.project.team = req.project.team.filter(
        (team) => team.toString() !== userId
      );

      await req.project.save();

      res.send("Saliste del proyecto correctamente");

    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
