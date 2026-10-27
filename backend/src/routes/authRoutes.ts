import { Router } from 'express';
import { register } from '../controllers/authController';

const router = Router();

// Ruta de registro: POST /api/auth/register
router.post('/register', register);

export default router;