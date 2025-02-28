// import express from "express";
// import expressLayouts from "express-ejs-layouts"
// import path from "path";
// import { fileURLToPath } from "url";
// import { setLogger } from "./middleware/logger.middleware.js";
// import { setSecurity } from "./middleware/security.middleware.js";
// import { setCsrf } from "./middleware/csrf.middleware.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(expressLayouts);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("layout", "layouts/base")

// // Security Middlewares
// setLogger(app);
// setSecurity(app);
// //setCsrf(app);

// // Routes import
// import csrfRouter from "./routes/csrf.routes.js";
// import authRouter from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";

// // Routes Declaration
// app.use("/api/v1/csrf", csrfRouter);
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/user", userRouter);

// app.get("/", (req, res) => {
//   res.render("index", { title: "Cathago" });
// });

// export { app };


import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import { setLogger } from "./middleware/logger.middleware.js";
import { setSecurity } from "./middleware/security.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/base");

setLogger(app);
setSecurity(app);

import csrfRouter from "./routes/csrf.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/csrf", csrfRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

export { app };