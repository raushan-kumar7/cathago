import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  create_user,
  login_user,
  logout_user,
} from "../services/user.service.js";
import {
  logError,
  logInfo,
  logWarning,
} from "../services/system_log.service.js";

const renderLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login | DocScan",
    error: req.flash("error"),
    success: req.flash("success"),
    url: req.originalUrl,
  });
};

const renderRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register | DocScan",
    error: req.flash("error"),
    url: req.originalUrl,
  });
};

const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // if (!username || !email || !password) {
    //   req.flash("error", "All fields are required");
    //   return res.redirect("/auth/register");
    // }

    // if (password !== confirmPassword) {
    //   req.flash("error", "Passwords do not match");
    //   return res.redirect("/auth/register");
    // }

    if (!username || !email || !password) {
      await logWarning("auth", "Registration attempt with missing fields", {
        ipAddress: req.ip,
      });
      req.flash("error", "All fields are required");
      return res.redirect("/auth/register");
    }

    if (password !== confirmPassword) {
      await logWarning(
        "auth",
        "Registration attempt with mismatched passwords",
        {
          ipAddress: req.ip,
          metadata: { email },
        }
      );
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/register");
    }

    const { user, accessToken, refreshToken } = await create_user({
      username,
      email,
      password,
    });

    await logInfo("auth", "User registered successfully", {
      userId: user.id,
      ipAddress: req.ip,
      metadata: { username, email },
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.flash("success", "Registration successful");
    res.redirect("/dashboard");
  } catch (error) {
    await logError("auth", "Registration failed", {
      ipAddress: req.ip,
      metadata: {
        email: req.body.email,
        error: error.message,
      },
    });
    req.flash("error", error.message || "Registration failed");
    res.redirect("/auth/register");
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   req.flash("error", "Email and password are required");
    //   return res.redirect("/auth/login");
    // }

    if (!email || !password) {
      await logWarning("auth", "Login attempt with missing credentials", {
        ipAddress: req.ip,
      });
      req.flash("error", "Email and password are required");
      return res.redirect("/auth/login");
    }

    const { user, accessToken, refreshToken } = await login_user(
      email,
      password
    );

    await logInfo("auth", "User logged in successfully", {
      userId: user.id,
      ipAddress: req.ip,
      metadata: { role: user.role },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    req.session.userId = user.id;

    req.flash("success", "Login successful");

    if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    }

    res.redirect("/dashboard");
  } catch (error) {
    await logError("auth", "Login failed", {
      ipAddress: req.ip,
      metadata: {
        email: req.body.email,
        error: error.message,
      },
    });
    req.flash("error", error.message || "Login failed");
    res.redirect("/auth/login");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    if (req.userId) {
      await logout_user(req.userId);
    }

    await logInfo("auth", "User logged out successfully", {
      userId: req.userId,
      ipAddress: req.ip,
    });

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    req.flash("success", "Logged out successfully");
    res.redirect("/");
  } catch (error) {
    await logError("auth", "Logout failed", {
      userId: req.userId,
      ipAddress: req.ip,
      metadata: { error: error.message },
    });
    req.flash("error", error.message || "Logout failed");
    res.redirect("/");
  }
});

export { renderLogin, renderRegister, register, login, logout };