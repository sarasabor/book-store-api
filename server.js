import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import protect from './middlewares/auth.js';

dotenv.config();

const app = express();

//* MIDDLEWARES 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'https://book-store-b1dk.onrender.com',
    credentials: true //* to let the cookies work
}));

//* MIDDLEWARE FOR ROUTING 
app.use('/books', bookRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 5001;

const databaseUrl = process.env.MONGO_URL;

//* connection to database if it's correct then the server is gonna be working;
mongoose.connect(databaseUrl)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is Running Successfully on Port : ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });

app.get('/profile', protect, (req, res) => {
    res.json({ message: 'Hello User Your id is' + req.user});
})