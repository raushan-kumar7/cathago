import { asyncHandler } from "../utils/AsyncHandler.js";
import { ExpressError } from "../utils/ExpressError.js";
import {
  change_password,
  delete_account,
  update_profile,
} from "../services/user.service.js";

const getSettingsPage = asyncHandler(async (req, res) => {
  res.render("home/settings", {
    title: "Account Settings | DocScan",
    user: req.user,
    error: req.flash("error"),
    success: req.flash("success"),
    url: req.originalUrl,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!(username || email)) {
      throw new ExpressError(400, "Username or email is required");
    }

    await update_profile(userId, { username, email });

    req.flash("success", "Profile updated successfully");
    res.redirect("/users/settings");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!(currentPassword || newPassword || confirmPassword)) {
      throw new ExpressError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new ExpressError(400, "Passwords do not match");
    }

    await change_password(userId, { currentPassword, newPassword });
    req.flash("success", "Password updated successfully");
    res.redirect("/users/settings");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    await delete_account(userId);
    req.flash("success", "User Account deleted successfully");
    req.redirect("/");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

export { getSettingsPage, updateProfile, updatePassword, deleteUserAccount };