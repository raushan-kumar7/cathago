import User from "../models/user.model.js";
import { ExpressError } from "../utils/ExpressError.js";

const create_user = async (userData) => {
  try {
    const user = await User.create(userData);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { user, accessToken, refreshToken };
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to create new user");
  }
};

const login_user = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { user, accessToken, refreshToken };
  } catch (error) {
    throw new ExpressError(401, error.message || "Failed to login user");
  }
};

const check_reset_credits = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const now = new Date();
    const lastReset = new Date(user.lastCreditReset);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    if (now - lastReset >= oneDayInMs) {
      user.credits = 20;
      user.lastCreditReset = now;
      await user.save();
    }
    return user;
  } catch (error) {
    throw new ExpressError(
      400,
      error.message || "Failed to check reset credits"
    );
  }
};

const refresh_access_token = async (refreshToken) => {
  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      throw new ExpressError(401, "Invalid refresh token");
    }
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ExpressError(
      401,
      error.message || "Failed to refresh access token"
    );
  }
};

const get_user = async (userId) => {
  try {
    return await User.findByPk(userId, {
      attributes: { exclude: ["password", "refreshToken"] },
    });
  } catch (error) {
    throw new ExpressError(400, "Failed to retrieve user");
  }
};

const logout_user = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.refreshToken = null;
    await user.save();
    return true;
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to logout user");
  }
};

const update_profile = async (userId, userData) => {
  try {
    const user = await get_user(userId);

    if (!user) {
      throw new Error("User does not exists");
    }

    const allowedFields = ["username", "email", "role"];

    const updates = Object.keys(userData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = userData[key];
        return obj;
      }, {});

    await user.update(updates);
    return user;
  } catch (error) {
    throw new ExpressError(
      400,
      error.message || "Failed to update user profile"
    );
  }
};

const change_password = async (userId, { currentPassword, newPassword }) => {
  try {
    const user = await get_user(userId);

    if (!user) {
      throw new Error("User does not exists");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      throw new Error("Invalid current password");
    }

    if (newPassword.length < 6 || newPassword.length > 100) {
      throw new Error("Password must be between 6 and 100 characters long");
    }

    user.password = newPassword;

    await user.save();
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to change password");
  }
};

const delete_account = async (userId) => {
  try {
    const user = await get_user(userId);

    if(!user) {
      throw new Error("User does not exists");
    }

    await user.destroy();
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to delete user account");
  }
};

export {
  create_user,
  login_user,
  check_reset_credits,
  refresh_access_token,
  get_user,
  logout_user,
  update_profile,
  change_password,
  delete_account,
};