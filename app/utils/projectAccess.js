import { getProjectById } from "../services/ProjectServices.js";
import { isProjectMember } from "../services/AddmemberAPI.js";
import { AppError } from "./errorHandler.js";

export const ensureProjectAccess = async (projectId, userId) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const project = await getProjectById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404, { projectId });
  }

  const isOwner = String(project.created_by) === String(userId);
  const isMember = isOwner ? true : await isProjectMember(project.id, userId);

  if (!isOwner && !isMember) {
    throw new AppError("Forbidden", 403, {
      projectId: project.id,
      userId,
    });
  }

  return project;
};

export const ensureProjectOwnerAccess = async (projectId, userId) => {
  const project = await ensureProjectAccess(projectId, userId);

  if (String(project.created_by) !== String(userId)) {
    throw new AppError("Forbidden", 403, {
      projectId: project.id,
      userId,
    });
  }

  return project;
};