import { asyncHandler } from "../utils/AsyncHandler.js";

const getCsrfToken = asyncHandler(async (req, res) => {
  res.json({csrfToken: req.app.locals.generateCsrfToken(req, res)});
});

export { getCsrfToken };