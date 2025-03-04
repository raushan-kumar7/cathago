import fs from "fs";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

export const setCookieParser = (app) => {
  app.use(cookieParser());
};

export const setLogger = (app) => {
  if (process.env.NODE_ENV === 'production') {
    // Create logs directory if it doesn't exist
    const logsDirectory = path.join(process.cwd(), 'src', 'logs');
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true });
    }
    
    const accessLogStream = fs.createWriteStream(
      path.join(logsDirectory, 'access.log'), 
      { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
  } else {
    app.use(morgan('dev'));
  }
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