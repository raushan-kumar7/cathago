// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ExpressError } from "../utils/ExpressError.js";
// import {
//   change_password,
//   delete_account,
//   update_profile,
// } from "../services/user.service.js";

// const getSettingsPage = asyncHandler(async (req, res) => {
//   res.render("home/settings", {
//     title: "Account Settings | DocScan",
//     user: req.user,
//     error: req.flash("error"),
//     success: req.flash("success"),
//     url: req.originalUrl,
//   });
// });

// const updateProfile = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { username, email } = req.body;

//     if (!(username || email)) {
//       throw new ExpressError(400, "Username or email is required");
//     }

//     await update_profile(userId, { username, email });

//     req.flash("success", "Profile updated successfully");
//     res.redirect("/users/settings");
//   } catch (error) {
//     req.flash("error", error.message);
//     res.redirect("/users/settings");
//   }
// });

// const updatePassword = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!(currentPassword || newPassword || confirmPassword)) {
//       throw new ExpressError(400, "All fields are required");
//     }

//     if (newPassword !== confirmPassword) {
//       throw new ExpressError(400, "Passwords do not match");
//     }

//     await change_password(userId, { currentPassword, newPassword });
//     req.flash("success", "Password updated successfully");
//     res.redirect("/users/settings");
//   } catch (error) {
//     req.flash("error", error.message);
//     res.redirect("/users/settings");
//   }
// });

// const deleteUserAccount = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user.id;

//     await delete_account(userId);
//     req.flash("success", "User Account deleted successfully");
//     req.redirect("/");
//   } catch (error) {
//     req.flash("error", error.message);
//     res.redirect("/users/settings");
//   }
// });

// export { getSettingsPage, updateProfile, updatePassword, deleteUserAccount };

import { asyncHandler } from "../utils/AsyncHandler.js";
import { ExpressError } from "../utils/ExpressError.js";
import {
  change_password,
  delete_account,
  update_profile,
} from "../services/user.service.js";
import {
  logInfo,
  logWarning,
  logError,
} from "../services/system_log.service.js";

const getSettingsPage = asyncHandler(async (req, res) => {
  logInfo("navigation", "User accessed settings page", {
    userId: req.user.id,
    ipAddress: req.ip,
  });

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

    logInfo("user_management", "Profile update attempt", {
      userId,
      ipAddress: req.ip,
      metadata: {
        updatedFields: Object.keys(req.body).filter(
          (k) => req.body[k] && ["username", "email"].includes(k)
        ),
      },
    });

    if (!(username || email)) {
      logWarning(
        "user_management",
        "Profile update failed - missing required fields",
        {
          userId,
          ipAddress: req.ip,
        }
      );
      throw new ExpressError(400, "Username or email is required");
    }

    await update_profile(userId, { username, email });

    logInfo("user_management", "Profile updated successfully", {
      userId,
      ipAddress: req.ip,
      metadata: {
        updatedFields: Object.keys({ username, email }).filter(
          (k) => req.body[k]
        ),
      },
    });

    req.flash("success", "Profile updated successfully");
    res.redirect("/users/settings");
  } catch (error) {
    logError("user_management", "Profile update error", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        errorMessage: error.message,
        errorCode: error.code || error.status,
      },
    });

    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    logInfo("security", "Password change attempt", {
      userId,
      ipAddress: req.ip,
    });

    if (!(currentPassword && newPassword && confirmPassword)) {
      logWarning(
        "security",
        "Password change failed - missing required fields",
        {
          userId,
          ipAddress: req.ip,
        }
      );
      throw new ExpressError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
      logWarning(
        "security",
        "Password change failed - passwords do not match",
        {
          userId,
          ipAddress: req.ip,
        }
      );
      throw new ExpressError(400, "Passwords do not match");
    }

    await change_password(userId, { currentPassword, newPassword });

    logInfo("security", "Password changed successfully", {
      userId,
      ipAddress: req.ip,
    });

    req.flash("success", "Password updated successfully");
    res.redirect("/users/settings");
  } catch (error) {
    logError("security", "Password change error", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        errorMessage: error.message,
        errorCode: error.code || error.status,
      },
    });

    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    logWarning("user_management", "Account deletion attempt", {
      userId,
      ipAddress: req.ip,
      metadata: {
        userEmail: req.user.email,
      },
    });

    await delete_account(userId);

    logInfo("user_management", "User account deleted successfully", {
      userId,
      ipAddress: req.ip,
      metadata: {
        userEmail: req.user.email,
      },
    });

    req.flash("success", "User Account deleted successfully");
    req.redirect("/");
  } catch (error) {
    logError("user_management", "Account deletion error", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        errorMessage: error.message,
        errorCode: error.code || error.status,
      },
    });

    req.flash("error", error.message);
    res.redirect("/users/settings");
  }
});

export { getSettingsPage, updateProfile, updatePassword, deleteUserAccount };