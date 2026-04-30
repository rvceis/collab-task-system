import { createTask,
    getTaskById,
    getTasksByProjectId,
    updateTask,deleteTask } from "../services/taskServices.js";
import { handleError, AppError, validateInput } from "../utils/errorHandler.js";
import { ensureProjectAccess } from "../utils/projectAccess.js";
import { logActivity } from "../services/activityService.js";

/* =========================
   CREATE TASK
========================= */
export const createTaskController = async (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;
  try {
    validateInput(["title", "description", "projectId"], req.body)      
    await ensureProjectAccess(projectId, req.user?.id);
    const task = await createTask(title, description, projectId, assignedTo)
    await logActivity(
      req.user?.id,
      task.project_id,
      "CREATE_TASK",
      `Created task: ${title}`
    );
    io.emit("taskCreated", { taskId: task.id, projectId: task.project_id }) // Emit real-time event
    io.emit("task_created", { taskId: task.id, projectId: task.project_id })
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    handleError(error, res, "CREATE_TASK");
  }
};

/* =========================
   GET TASKS BY PROJECT
========================= */
export const getTasksByProjectController = async (req, res) => {
  const { projectId } = req.params;
    try {           
    if (!projectId) {
      throw new AppError("projectId is required", 400);
    }
    await ensureProjectAccess(projectId, req.user?.id);
    const tasks = await getTasksByProjectId(projectId)
    await logActivity(
      req.user?.id,
      Number(projectId),
      "GET_TASKS_BY_PROJECT",
      `Fetched ${tasks.length} tasks`
    );
    res.json({
      success: true,
      message: `Retrieved ${tasks.length} tasks for project ${projectId}`,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    handleError(error, res, "GET_TASKS_BY_PROJECT");
  }
};

/* =========================
   GET TASK BY ID
========================= */
export const getTaskByIdController = async (req, res) => {
  const { id: taskId } = req.params;
    try {           
    const task = await getTaskById(taskId)  
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    await ensureProjectAccess(task.project_id, req.user?.id);
    await logActivity(
      req.user?.id,
      task.project_id,
      "GET_TASK",
      `Fetched task: ${task.title}`
    );
    res.json({
      success: true,
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    handleError(error, res, "GET_TASK_BY_ID");
  }
};

/* =========================
   UPDATE TASK
========================= */
export const updateTaskController = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, assignedTo } = req.body;
    try {           
    if (!taskId) {
      throw new AppError("Task id is required", 400);
    }
    const task = await getTaskById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    await ensureProjectAccess(task.project_id, req.user?.id);
    const updatedTask = await updateTask(taskId, title, description, assignedTo)  
    await logActivity(
      req.user?.id,
      updatedTask.project_id,
      "UPDATE_TASK",
      `Updated task: ${updatedTask.title}`
    );
    io.emit("taskUpdated", { taskId: updatedTask.id, projectId: updatedTask.project_id }) // Emit real-time event
    io.emit("task_updated", { taskId: updatedTask.id, projectId: updatedTask.project_id })
    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    handleError(error, res, "UPDATE_TASK");
  }
};

/* =========================
   DELETE TASK
========================= */
export const deleteTaskController = async (req, res) => {
  const { id: taskId } = req.params;
    try {           
    if (!taskId) {
      throw new AppError("Task id is required", 400);
    }
    const task = await getTaskById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    await ensureProjectAccess(task.project_id, req.user?.id);
    await deleteTask(taskId)  
    await logActivity(
      req.user?.id,
      task.project_id,
      "DELETE_TASK",
      `Deleted task: ${task.title}`
    );
    io.emit("taskDeleted", { taskId, projectId: task.project_id }) // Emit real-time event
    io.emit("task_deleted", { taskId, projectId: task.project_id })
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    handleError(error, res, "DELETE_TASK");
  }
};
