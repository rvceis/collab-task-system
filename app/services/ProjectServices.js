import pool from "../../config/db.js";

// CREATE PROJECT
export const createProject = async (name, description, ownerId) => {
  console.log("📥 [DB] createProject:", { name, description, ownerId });

  try {
    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_by`,
      [name, description, ownerId]
    );

    console.log("✅ Project inserted:", result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.error("❌ DB Error (createProject):", error.message);
    throw error;
  }
};

// GET PROJECTS BY USER
export const getProjectsByUserId = async (userId) => {
  console.log("📥 [DB] getProjectsByUserId:", userId);

  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE created_by = $1`,
      [userId]
    );

    console.log(`✅ Found ${result.rows.length} projects`);

    return result.rows;
  } catch (error) {
    console.error("❌ DB Error (getProjectsByUserId):", error.message);
    throw error;
  }
};

// GET PROJECT BY ID
export const getProjectById = async (projectId) => {
  console.log("📥 [DB] getProjectById:", projectId);

  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [projectId]
    );

    console.log("✅ Project fetched:", result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.error("❌ DB Error (getProjectById):", error.message);
    throw error;
  }
};

// GET ALL PROJECTS (optional)
export const getAllProjects = async () => {
  console.log("📥 [DB] getAllProjects");

  try {
    const result = await pool.query(`SELECT * FROM projects`);

    console.log(`✅ Total projects: ${result.rows.length}`);

    return result.rows;
  } catch (error) {
    console.error("❌ DB Error (getAllProjects):", error.message);
    throw error;
  }
};

// UPDATE PROJECT
export const updateProject = async (projectId, name, description) => {
  console.log("📥 [DB] updateProject:", { projectId, name, description });

  try {
    const result = await pool.query(
      `UPDATE projects
       SET name = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [name, description, projectId]
    );

    console.log("✅ Project updated:", result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.error("❌ DB Error (updateProject):", error.message);
    throw error;
  }
};

// DELETE PROJECT
export const deleteProject = async (projectId) => {
  console.log("📥 [DB] deleteProject:", projectId);

  try {
    await pool.query(
      `DELETE FROM projects WHERE id = $1`,
      [projectId]
    );

    console.log("🗑️ Project deleted:", projectId);
  } catch (error) {
    console.error("❌ DB Error (deleteProject):", error.message);
    throw error;
  }
};