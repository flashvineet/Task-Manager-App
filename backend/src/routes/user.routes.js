import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getMe, updateMe, listUsers } from '../controllers/userController.js';
import { updateProfileSchema } from '../validators/user.schema.js';

const router = Router();
router.get('/me', auth, getMe);
router.patch('/me', auth, validate(updateProfileSchema), updateMe);

router.get('/', auth, requireRole('admin'), listUsers);

export default router;
