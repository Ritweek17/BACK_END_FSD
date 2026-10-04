import express from 'express';
import { handleContactSubmit } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/', handleContactSubmit);

export default router;
