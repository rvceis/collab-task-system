import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../config/db.js";
import { findUserByEmail, createUser } from "../services/userServices.js";
import { handleError, AppError, validateInput } from "../utils/errorHandler.js";
import { logActivity } from "../services/activityService.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    validateInput(["name", "email", "password"], req.body);

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new AppError("Email already registered", 409, { email });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await createUser(name, email, hashedPassword);

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new AppError("Server configuration error", 500, { error: "JWT_SECRET not set" });
    }
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await logActivity(
      newUser.id,
      null,
      "REGISTER",
      `User registered: ${newUser.email}`
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    handleError(error, res, "REGISTER");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    validateInput(["email", "password"], req.body);

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new AppError("Server configuration error", 500, { error: "JWT_SECRET not set" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await logActivity(
      user.id,
      null,
      "LOGIN",
      `User logged in: ${user.email}`
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    handleError(error, res, "LOGIN");
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    // Find user by ID (more efficient than by email)
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await logActivity(
      user.id,
      null,
      "GET_ME",
      "Fetched profile"
    );

    res.json({
      success: true,
      message: "User retrieved successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    handleError(error, res, "GET_ME");
  }
};      