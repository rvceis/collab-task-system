import {
  createProject,
  deleteProject,
  updateProject,
  getProjectsByUserId,
} from "../services/ProjectServices.js";
import { handleError, AppError, validateInput } from "../utils/errorHandler.js";
import { ensureProjectAccess, ensureProjectOwnerAccess } from "../utils/projectAccess.js";
import { logActivity } from "../services/activityService.js";

/* =========================
   CREATE PROJECT
========================= */
export const createProjectController = async (req, res) => {
  const { name, description } = req.body;

  try {
    validateInput(["name", "description"], req.body);

    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const project = await createProject(name, description, userId);
    await logActivity(
      userId,
      project.id,
      "CREATE_PROJECT",
      `Created project: ${project.name}`
    );
    io.emit("projectCreated", { projectId: project.id }) // Emit real-time event
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    handleError(error, res, "CREATE_PROJECT");
  }
};

/* =========================
   GET ALL PROJECTS (USER)
========================= */
export const getProjectsController = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const projects = await getProjectsByUserId(userId);

    await logActivity(
      userId,
      null,
      "GET_PROJECTS",
      `Fetched ${projects.length} projects`
    );

    res.json({
      success: true,
      message: `Retrieved ${projects.length} projects`,
      count: projects.length,
      projects,
    });
  } catch (error) {
    handleError(error, res, "GET_PROJECTS");
  }
};

/* =========================
   GET PROJECT BY ID
========================= */
export const getProjectController = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user?.id;

    const project = await ensureProjectAccess(id, userId);

    await logActivity(
      userId,
      project.id,
      "GET_PROJECT",
      `Fetched project: ${project.name}`
    );

    res.json({
      success: true,
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    handleError(error, res, "GET_PROJECT");
  }
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProjectController = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    validateInput(["name", "description"], req.body);

    const userId = req.user?.id;

    const project = await ensureProjectAccess(id, userId);

    const updatedProject = await updateProject(id, name, description);

    await logActivity(
      userId,
      project.id,
      "UPDATE_PROJECT",
      `Updated project: ${updatedProject.name}`
    );

    io.emit("projectUpdated", { projectId: updatedProject.id }) // Emit real-time event 
    res.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    handleError(error, res, "UPDATE_PROJECT");
  }
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProjectController = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user?.id;

    const project = await ensureProjectOwnerAccess(id, userId);

    await logActivity(
      userId,
      project.id,
      "DELETE_PROJECT",
      `Deleted project: ${project.name}`
    );

    await deleteProject(id);
    io.emit("projectDeleted", { projectId: id }) // Emit real-time event

    res.json({
      success: true,
      message: "Project deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    handleError(error, res, "DELETE_PROJECT");
  }
};