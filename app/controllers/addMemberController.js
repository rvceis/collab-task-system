import { addMember } from "../services/AddmemberAPI.js";
import { handleError, AppError, validateInput } from "../utils/errorHandler.js";
import { ensureProjectOwnerAccess } from "../utils/projectAccess.js";
import { logActivity } from "../services/activityService.js";

export const addMemberController = async (req, res) => {
  const { projectId, userId } = req.body;
  try { 
    validateInput(["projectId", "userId"], req.body)
    await ensureProjectOwnerAccess(projectId, req.user?.id);
    const member = await addMember(projectId, userId)
    await logActivity(
      req.user?.id,
      Number(projectId),
      "ADD_MEMBER",
      `Added user ${userId} to project ${projectId}`
    );
    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    handleError(error, res, "ADD_MEMBER");
  }
};
