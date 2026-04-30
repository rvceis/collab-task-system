import {
  createProject,
  deleteProject,
  updateProject,
  getProjectsByUserId,
} from "../services/ProjectServices.js";
import { handleError, AppError, validateInput } from "../utils/errorHandler.js";
import { ensureProjectAccess, ensureProjectOwnerAccess } from "../utils/projectAccess.js";

/* =========================
   CREATE PROJECT
========================= */
export const createProjectController = async (req, res) => {
  const { name, description } = req.body;

  console.log("📥 [CREATE PROJECT]", req.body);

  try {
    validateInput(["name", "description"], req.body);

    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const project = await createProject(name, description, userId);

    console.log("✅ Project created:", project);

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
  console.log("📥 [GET PROJECTS] User:", req.user);

  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const projects = await getProjectsByUserId(userId);

    console.log(`✅ Found ${projects.length} projects`);

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

  console.log(`📥 [GET PROJECT] ID: ${id}`);

  try {
    const userId = req.user?.id;

    const project = await ensureProjectAccess(id, userId);

    console.log("✅ Project fetched:", project);

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

  console.log(`📥 [UPDATE PROJECT] ID: ${id}`, req.body);

  try {
    validateInput(["name", "description"], req.body);

    const userId = req.user?.id;

    await ensureProjectAccess(id, userId);

    const updatedProject = await updateProject(id, name, description);

    console.log("✅ Project updated:", updatedProject);

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

  console.log(`📥 [DELETE PROJECT] ID: ${id}`);

  try {
    const userId = req.user?.id;

    await ensureProjectOwnerAccess(id, userId);
    
    await deleteProject(id);

    console.log("🗑️ Project deleted:", id);

    res.json({
      success: true,
      message: "Project deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    handleError(error, res, "DELETE_PROJECT");
  }
};