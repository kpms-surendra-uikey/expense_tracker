import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db/config.js';
import userRoutes from './routes/users.js';
import expenseRoutes from './routes/expenses.js';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import { verifyToken } from './utils/index.js';

dotenv.config();

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

// Apply middleware to protect routes
app.use('/expenses', verifyToken);

// Use routes
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
