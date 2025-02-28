import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { register, login } from "../services/auth.service.js";

/**
 * @route /api/v1/auth/register
 * @desc Register a new user
 * @access PUBLIC
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username || password)) {
    throw new ApiError(400, "All fields are required");
  }

  const newUser = await register({ email, username, password });

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "New User created successfully"));
});

/**
 * @route /api/v1/auth/login
 * @desc Login the user
 * @access PUBLIC
 */
const loginUser = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!(userId || password)) {
    throw new ApiError(400, "All fields are required");
  }

  const { user, accessToken } = await login(userId, password);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, accessToken }, "User logged in successfully")
    );
});

export { registerUser, loginUser };
