
import express from 'express';
import { loginPost, signUpPost } from '../controllers/authController.js';

const router = express.Router();


router.post('/sign-up', signUpPost);

router.post('/login', loginPost);

router.get('/refresh', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Successfully Deleted'});
})

export default router;