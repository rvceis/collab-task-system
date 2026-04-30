import pool from "../../config/db.js";

export const addMember = async (projectId, userId) => {
  const result = await pool.query(
    `INSERT INTO project_members (project_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [projectId, userId]
  );

  return result.rows[0];
};

export const isProjectMember = async (projectId, userId) => {
  const result = await pool.query(
    `SELECT * FROM project_members 
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  return result.rows.length > 0;
};