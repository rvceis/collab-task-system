import pool from "../../config/db.js";
import { AppError } from "../utils/errorHandler.js";
// CREATE TASK
export const createTask = async (title, description, projectId, assignedTo) => {
  console.log("📥 [DB] createTask:", { title, description, projectId, assignedTo })   
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id, assigned_to)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, project_id, assigned_to`,
      [title, description, projectId, assignedTo]
    );
    return result.rows[0];
  } catch (error) {
        console.error("❌ [DB] Error creating task:", error.message);
        throw new AppError("Failed to create task", 500, { error: error.message }  );
  }
};

// GET TASKS BY PROJECT
export const getTasksByProjectId = async (projectId) => {
  console.log("📥 [DB] getTasksByProjectId:", projectId);
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE project_id = $1`,
      [projectId]
    );
    return result.rows;
  } catch (error) {
    console.error("❌ [DB] Error fetching tasks:", error.message);
    throw new AppError("Failed to fetch tasks", 500, { error: error.message });
  }
};  

// GET TASK BY ID
export const getTaskById = async (taskId) => {
  console.log("📥 [DB] getTaskById:", taskId);
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [taskId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("❌ [DB] Error fetching task:", error.message);
    throw new AppError("Failed to fetch task", 500, { error: error.message });
  }
};  

// UPDATE TASK
export const updateTask = async (taskId, title, description, assignedTo) => {
  console.log("📥 [DB] updateTask:", { taskId, title, description, assignedTo })           
  try {
    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, assigned_to = $3
       WHERE id = $4
       RETURNING id, title, description, project_id, assigned_to`,
      [title, description, assignedTo, taskId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("❌ [DB] Error updating task:", error.message);
    throw new AppError("Failed to update task", 500, { error: error.message });
  }
};

// DELETE TASK
export const deleteTask = async (taskId) => {
  console.log("📥 [DB] deleteTask:", taskId);
  try {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
    return true;
  } catch (error) {
    console.error("❌ [DB] Error deleting task:", error.message);
    throw new AppError("Failed to delete task", 500, { error: error.message });
  }
};

// GET ALL TASKS (optional)
export const getAllTasks = async () => {
  console.log("📥 [DB] getAllTasks");
  try {
    const result = await pool.query(`SELECT * FROM tasks`);
    return result.rows;
  } catch (error) {
    console.error("❌ [DB] Error fetching all tasks:", error.message);
     throw new AppError("Failed to fetch tasks", 500, { error: error.message });
  }
};      

