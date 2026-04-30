import { createTask,
    getAllTasks,
    getTaskById,
    getTasksByProjectId,
    updateTask,deleteTask } from "../services/taskServices";
import { handleError, AppError, validateInput, checkAuthorization, notFound } from "../utils/errorHandler.js";

/* =========================
   CREATE TASK
========================= */
export const createTaskController = async (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;

  console.log("📥 [CREATE TASK]", req.body)     
  try {
    validateInput(["title", "description", "projectId"], req.body)      
    const task = await createTask(title, description, projectId, assignedTo)
    console.log("✅ Task created:", task)
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

  console.log("📥 [GET TASKS BY PROJECT]", { projectId }  )
    try {           
    const tasks = await getTasksByProjectId(projectId)
    console.log(`✅ Found ${tasks.length} tasks for project ${projectId}`)
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
  const { taskId } = req.params;

  console.log("📥 [GET TASK BY ID]", { taskId }     )
    try {           
    const task = await getTaskById(taskId)  
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    console.log("✅ Task fetched:", task)
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
  const { taskId } = req.params;
  const { title, description, assignedTo } = req.body;

  console.log("📥 [UPDATE TASK]", { taskId, ...req.body }   )
    try {           
    const updatedTask = await updateTask(taskId, title, description, assignedTo)  
    console.log("✅ Task updated:", updatedTask)
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
  const { taskId } = req.params;

  console.log("📥 [DELETE TASK]", { taskId }            )
    try {           
    await deleteTask(taskId)  
    console.log("✅ Task deleted:", taskId)
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    handleError(error, res, "DELETE_TASK");
  }
};

/* =========================
   GET PROJECT BY ID
========================= */
export const getProjectByIdController = async (req, res) => {
  const { id } = req.params;

  console.log("📥 [GET PROJECT BY ID] ID:", id)     
  try {     
    const userId = req.user?.id     
    const project = await getProjectById(id)
    if (!project) {
      notFound("Project", id)
    }
    checkAuthorization(userId, project.created_by, "project")
    console.log("✅ Project fetched:", project)
    res.json({
      success: true,
      message: "Project retrieved successfully",
      project,
    });     
  }
  catch (error) {
    handleError(error, res, "GET_PROJECT_BY_ID");
  }
};
