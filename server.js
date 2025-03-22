// Import our custom environment loader first
import { ENV } from './utils/loadEnv.js';

// Now load all other imports
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import Dbconnection from './config/db.js';
import cors from 'cors';
import userAuthRoute from './routes/userAuthRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ratingRoutes from './routes/ratingAndReviewRoutes.js';
import pointRoutes from './routes/pointRoutes.js';

// Database config
Dbconnection();

// Rest object
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', userAuthRoute);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/points', pointRoutes);

// Rest api
app.get('/', (req, res) => {
  res.send("<h1>Welcome to ShareSpace</h1>");
});

// Port configuration
const port = ENV.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on ${port}`.bgMagenta.white);
});
