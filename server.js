import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoute from './routes/contactRoutes.js';
import cookieParser from 'cookie-parser';
import protect from './middlewares/auth.js';

dotenv.config();

const app = express();

//* MIDDLEWARES 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Configuration CORS dynamique selon l'environnement
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://book-store-liard-chi.vercel.app',
        'https://book-store-ogcmi4tsw-sarasabors-projects.vercel.app',
        'https://book-store-liard-chi.vercel.app'
      ]
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'];

app.use(cors({
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);
        
        // Autoriser toutes les URLs Vercel pour ce projet
        if (origin && (origin.includes('sarasabors-projects.vercel.app') || origin.includes('book-store-liard-chi.vercel.app'))) {
            callback(null, true);
            return;
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, //* to let the cookies work,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

//* MIDDLEWARE FOR ROUTING 
app.use('/books', bookRoutes);
app.use(authRoutes);
app.use('/api/contact', contactRoute);

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

// Route de test pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
    res.json({ 
        message: 'Book Store API is running successfully!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.get('/profile', protect, (req, res) => {
    res.json({ message: 'Hello User Your id is' + req.user});
})