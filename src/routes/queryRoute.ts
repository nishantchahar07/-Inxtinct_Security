import { Router } from 'express';
import { handleQuery } from '../services/queryController';

const router = Router();

router.post('/query', handleQuery);

export default router;
