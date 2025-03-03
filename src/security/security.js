import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

export const setCookieParser = (app) => {
  app.use(cookieParser());
};

export const setLogger = (app) => {
  app.use(morgan("dev"));
};

export const setSecurity = (app) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'", 
            "https://cdn.jsdelivr.net", 
            "https://cdn.tailwindcss.com", 
            "'unsafe-inline'"
          ],
          styleSrc: [
            "'self'",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://cdn.tailwindcss.com", 
            "'unsafe-inline'"
          ],
          fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "data:"],
          imgSrc: ["'self'", "data:"],
        },
      },
    })
  );
};