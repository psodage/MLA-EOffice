// src/modules/department/department.routes.js
// ============================================================
// Department API routes
// GET /api/v1/departments — list active departments
// ============================================================

import { Router } from 'express';
import { getDepartments } from './department.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getDepartments);

export default router;
