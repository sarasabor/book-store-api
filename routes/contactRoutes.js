import express from 'express';
import { apiContact } from '../controllers/contacts.js';

const router = express.Router();

// POST => api/contact
router.post('/', apiContact);

export default router;