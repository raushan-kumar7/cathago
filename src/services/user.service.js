import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";

const userProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  return user;
};

export { userProfile };