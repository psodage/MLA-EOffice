// src/modules/health/health.routes.js
// ============================================================
// Health Check Routes
// ============================================================

import { Router } from 'express';
import { getHealth, getDbHealth } from './health.controller.js';

const router = Router();

router.get('/', getHealth);
router.get('/db', getDbHealth);

export default router;
