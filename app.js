import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './app/routes/authRoutes.js';
import projectRoutes from './app/routes/projectRoutes.js'; // Import project routes
import { handleError } from './app/utils/errorHandler.js';
import taskRoutes from './app/routes/taskRoutes.js'; // Import task routes

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Collab Task System API is running',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes); 


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("\n🔴 GLOBAL ERROR HANDLER");
  handleError(err, res, "GLOBAL");
});

export default app;
