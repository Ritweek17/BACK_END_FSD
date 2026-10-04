import express from 'express';
import { renderHome } from '../controllers/page.controller.js';

const router = express.Router();

router.get('/', renderHome);

export default router;
