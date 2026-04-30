import pool from "../../config/db.js";

// CREATE PROJECT
export const createProject = async (name, description, ownerId) => {
  try {
    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_by`,
      [name, description, ownerId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("DB error (createProject):", error.message);
    throw error;
  }
};

// GET PROJECTS BY USER
export const getProjectsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE created_by = $1`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error("DB error (getProjectsByUserId):", error.message);
    throw error;
  }
};

// GET PROJECT BY ID
export const getProjectById = async (projectId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [projectId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("DB error (getProjectById):", error.message);
    throw error;
  }
};

// GET ALL PROJECTS (optional)
export const getAllProjects = async () => {
  try {
    const result = await pool.query(`SELECT * FROM projects`);

    return result.rows;
  } catch (error) {
    console.error("DB error (getAllProjects):", error.message);
    throw error;
  }
};

// UPDATE PROJECT
export const updateProject = async (projectId, name, description) => {
  try {
    const result = await pool.query(
      `UPDATE projects
       SET name = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [name, description, projectId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("DB error (updateProject):", error.message);
    throw error;
  }
};

// DELETE PROJECT
export const deleteProject = async (projectId) => {
  try {
    await pool.query(
      `DELETE FROM projects WHERE id = $1`,
      [projectId]
    );

  } catch (error) {
    console.error("DB error (deleteProject):", error.message);
    throw error;
  }
};