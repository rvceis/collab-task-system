import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createProjectController as createProject,
  getProjectsController as getProjects,
  getProjectController as getProjectById,
  updateProjectController as updateProject,
  deleteProjectController as deleteProject,
} from "../controllers/projectController.js";

const router = Router();

// Apply auth middleware    
router.use(authMiddleware);

// Clean REST routes
router.post("/", createProject);          // POST /api/projects
router.get("/", getProjects);             // GET  /api/projects
router.get("/:id", getProjectById);       // GET  /api/projects/1
router.put("/:id", updateProject);        // PUT  /api/projects/1
router.delete("/:id", deleteProject);     // DELETE /api/projects/1

export default router;