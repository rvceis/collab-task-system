import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './app/routes/authRoutes.js';
import projectRoutes from './app/routes/projectRoutes.js'; // Import project routes
import { handleError } from './app/utils/errorHandler.js';
import taskRoutes from './app/routes/taskRoutes.js'; // Import task routes
import addMemberRoutes from './app/routes/addMember.js';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Handle malformed JSON bodies from clients
app.use((req, res, next) => {
  // express.json will populate req.body or throw; we just pass through
  next();
});



app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Collab Task System API is running',
    version: '1.0.0',
  });
});



// JSON parse error handler (must be before routes and after body parser)
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn('⚠️ Malformed JSON received');
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body',
      statusCode: 400,
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }
  return next(err);
});



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes); 
app.use('/api/members', addMemberRoutes);

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
