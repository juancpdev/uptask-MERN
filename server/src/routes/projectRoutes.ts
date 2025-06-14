import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { ProjectExist } from "../middleware/project";
import { taskBelongsToProject, TaskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(authenticate)

/** Routes for projects */
router.param('projectId', ProjectExist)

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

router.get('/:projectId',
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:projectId',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:projectId',
    handleInputErrors,
    ProjectController.deleteProject
)

/** Routes for task */

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

router.param('taskId', TaskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    handleInputErrors,
    TaskController.getTaskById
)
 
router.put('/:projectId/tasks/:taskId',
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    body('status')
    .notEmpty().withMessage('El estado de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

export default router