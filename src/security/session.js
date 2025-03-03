import session from "express-session";

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "fallback_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

export const configureSession = (app) => {
  app.use(session(sessionOptions));
};
