import { check_reset_credits, get_user } from "../services/user.service.js";

const renderLandingPage = (req, res) => {
  res.render("home/landing", {
    title: "Welcome",
    isAuthenticated: !!req.userId,
    url: req.originalUrl,
  });
};

const renderDashboard = async (req, res) => {
  try {
    // Get user data
    const user = await get_user(req.userId);

    // Check and reset credits if necessary
    await check_reset_credits(req.userId);

    // Refresh user data after potential credit reset
    const refreshedUser = await get_user(req.userId);

    res.render("home/dashboard", {
      title: "Dashboard",
      user: refreshedUser,
      isAuthenticated: true,
      url: req.originalUrl,
    });
  } catch (error) {
    req.flash("error", error.message || "Failed to load dashboard");
    res.redirect("/");
  }
};

export {renderLandingPage, renderDashboard}