import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

export default router