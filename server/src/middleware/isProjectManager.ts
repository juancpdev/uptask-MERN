import { Request, Response, NextFunction } from "express";
import Project from "../models/Project";

export const isProjectManager = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return 
    }

    // Comparar el ID del usuario autenticado con el del manager del proyecto
    if (project.manager.toString() !== req.user.id.toString()) {
      res.status(403).json({ error: "Acceso denegado: no sos el manager del proyecto" });
      return 
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al verificar permisos del manager" });
  }
};