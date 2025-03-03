import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  create_user,
  login_user,
  logout_user,
} from "../services/user.service.js";

const renderLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    error: req.flash("error"),
    success: req.flash("success"),
    url: req.originalUrl,
  });
};

const renderRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    error: req.flash("error"),
    url: req.originalUrl,
  });
};

const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/auth/register");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/register");
    }

    // Create user
    const { user, accessToken, refreshToken } = await create_user({
      username,
      email,
      password,
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.flash("success", "Registration successful");
    res.redirect("/dashboard");
  } catch (error) {
    req.flash("error", error.message || "Registration failed");
    res.redirect("/auth/register");
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/auth/login");
    }

    // Login user
    const { user, accessToken, refreshToken } = await login_user(
      email,
      password
    );

    // Set cookies
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
    res.redirect("/dashboard");
  } catch (error) {
    req.flash("error", error.message || "Login failed");
    res.redirect("/auth/login");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    if (req.userId) {
      await logout_user(req.userId);
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    req.flash("success", "Logged out successfully");
    res.redirect("/");
  } catch (error) {
    req.flash("error", error.message || "Logout failed");
    res.redirect("/");
  }
});

export { renderLogin, renderRegister, register, login, logout };
