import session from "express-session";
import SQLiteStore from "connect-sqlite3";

const SQLiteSessionStore = SQLiteStore(session);

const sessionOptions = {
  store: new SQLiteSessionStore({
    db: "database.sqlite",
    dir: '../../',
  }),
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
