import helmet from "helmet";

export const setSecurity = (app) => {
  app.use(helmet());
};