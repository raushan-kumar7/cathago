import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong with generating access and refresh token"
    );
  }
};

const register = async (userData) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email: userData.email }, { username: userData.username }],
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create(userData);

  const createdUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong with creating user");
  }

  return createdUser;
};

const login = async (userId, password) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: userId }, { email: userId }],
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken } = await generateAccessAndRefreshToken(user.id);

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return {
    accessToken,
    user: loggedInUser,
  };
};

export { register, login };