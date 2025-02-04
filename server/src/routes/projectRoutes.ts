import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";

const router = Router()

/** Routes for projects */

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

/** Routes for task */
router.param('projectId', validateProjectExist)

router.post('/:projectId/tasks',
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getTaskByProject
)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('ID de proyecto no válido'),
    param('taskId').isMongoId().withMessage('ID de tarea no válido'),
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

export default router