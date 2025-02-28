import morgan from "morgan";

export const setLogger = (app) => {
  app.use(morgan("dev"));
};