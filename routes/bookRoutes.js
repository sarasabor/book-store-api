import express from 'express';
import { addBook, deleteBook, getAllBooks, getBookByGenre, getBookById, updateBook } from '../controllers/bookController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

//* Public routes - no authentication required for reading books
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.get('/genre/:genre', getBookByGenre);

//* Protected routes - authentication required for modifying books
router.post('/upload-book', protect, addBook);
router.delete('/:id', protect, deleteBook);
router.put('/update/:id', protect, updateBook);

export default router;