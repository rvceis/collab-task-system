import pool from "../../config/db.js";

export const logActivity = async (userId, projectId, action, details) => {
  await pool.query(
    `INSERT INTO activity_logs (user_id, project_id, action, details)
     VALUES ($1, $2, $3, $4)`,
    [userId, projectId, action, details]
  );
};

export const getActivityLogs = async (req, res) => {
  const { project_id } = req.query;

  const logs = await pool.query(
    `SELECT * FROM activity_logs
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [project_id]
  );

  res.json(logs.rows);
};