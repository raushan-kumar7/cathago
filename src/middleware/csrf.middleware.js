import { doubleCsrf } from "csrf-csrf";
import cookieParser from "cookie-parser";

export const setCsrf = (app) => {
  app.use(cookieParser());

  const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "x-csrf-token",
    cookieOptions: {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  });

  app.use(doubleCsrfProtection);
  app.locals.generateCsrfToken = (req, res) => generateToken(req, res);

  app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      return res.status(403).json({
        error: "CSRF attack detected",
        message: "Form has been tampered with",
      });
    }
    return next(err);
  });
};