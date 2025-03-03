import jwt from "jsonwebtoken";
import { refresh_access_token, get_user } from "../services/user.service.js";

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.redirect("/auth/login");
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
      
      const user = await get_user(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      
      next();
    } catch (error) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.redirect("/auth/login");
      }
      try {
        const { accessToken: newAccessToken } =
          await refresh_access_token(refreshToken);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        });
        const decoded = jwt.verify(
          newAccessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.userId = decoded.id;
        req.userRole = decoded.role;
        
        // Get the full user object and attach it to req
        const user = await get_user(decoded.id);
        if (!user) {
          throw new Error("User not found");
        }
        req.user = user;
        
        next();
      } catch (refreshError) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.redirect("/auth/login");
      }
    }
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/auth/login");
  }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    req.flash("error", "Access denied. Admin privileges required");
    return res.redirect("/dashboard");
  }
  next();
};

export const checkAuth = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.userId = decoded.id;
        req.userRole = decoded.role;
        
        get_user(decoded.id)
          .then(user => {
            req.user = user;
            next();
          })
          .catch(error => {
        
            next();
          });
        return; 
      } catch (error) {
        // Token expired but we don't redirect, just continue without auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};