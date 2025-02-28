import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { userProfile } from "../services/user.service.js";

/**
 * @route /api/v1/user/profile
 * @desc Get user profile
 * @access PRIVATE
 */
const profile = asyncHandler(async (req, res) => {
  const user = await userProfile(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

export { profile };