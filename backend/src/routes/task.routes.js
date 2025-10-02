import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.schema.js';
import { createTask, getTask, updateTask, deleteTask, listTasks } from '../controllers/taskController.js';

const router = Router();

router.use(auth);
router.get('/', listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', getTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
