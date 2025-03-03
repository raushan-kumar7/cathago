import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import flash from "connect-flash";
import {
  setCookieParser,
  setLogger,
  setSecurity,
} from "./security/security.js";
import { configureSession } from "./security/session.js";
import idxRouter from "./routes/index.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up sessions BEFORE flash messages
configureSession(app);
app.use(flash());

// Security & logging
setCookieParser(app);
setLogger(app);
setSecurity(app);

// EJS Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Debugging middleware to check session data
app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

// Middleware to pass flash messages & session user to templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", idxRouter);

export { app };
