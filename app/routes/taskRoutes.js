import { Router } from "express";
import { createTaskController,
     getTasksByProjectController,
      getTaskByIdController,
       updateTaskController, deleteTaskController } from "../controllers/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.use(authMiddleware);
// Create a new task
router.post("/", createTaskController);

// Get tasks for a specific project
router.get("/project/:projectId", getTasksByProjectController );

// Get a specific task by ID
router.get("/:id", getTaskByIdController);

// Update a task by ID
router.put("/:id", updateTaskController);

// Delete a task by ID
router.delete("/:id", deleteTaskController);

export default router;  