import { logActivity } from "../services/activityService";

export const logActivityController = async (req, res) => {
  const { userId, projectId, action, details } = req.body;

  try {
    await logActivity(userId, projectId, action, details);
    res.status(201).json({
      success: true,
      message: "Activity logged successfully",
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log activity",
    });
  }
};  

/* =========================
   CREATE TASK
========================= */
