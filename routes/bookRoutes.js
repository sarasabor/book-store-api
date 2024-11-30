import express from 'express';
import { addBook, deleteBook, getAllBooks, getBookByGenre, getBookById, updateBook } from '../controllers/bookController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// router.get('/', protect, getAllBooks);
router.get('/', getAllBooks);
router.post('/upload-book', addBook);
router.get('/:id', getBookById);
router.delete('/:id', deleteBook);
router.put('/update/:id', updateBook);
router.get('/genre/:genre', getBookByGenre);

export default router;