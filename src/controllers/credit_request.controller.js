import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  create_credit_request,
  get_user_credit_requests,
} from "../services/credit_request.service.js";


const getCreditsPage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const viewMode = req.query.view === 'new' ? 'new' : 'list';
    const limit = 10;

    const creditRequests = await get_user_credit_requests(userId, page, limit);

    res.render("credits/index", {
      title: "Credit Requests | DocScan",
      user: req.user,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
      creditRequests: creditRequests.requests,
      totalPages: creditRequests.totalPages,
      currentPage: creditRequests.currentPage,
      viewMode: viewMode
    });
  } catch (error) {
    console.error("Credit request retrieval error:", error);
    req.flash("error", "Failed to retrieve credit requests");
    res.redirect("/dashboard");
  }
});

const createCreditsRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { reqCredits, reason } = req.body;

    const requestedCredits = parseInt(reqCredits, 10);
    if (!requestedCredits || requestedCredits <= 0) {
      req.flash("error", "Invalid number of credits requested");
      return res.redirect("/credit-request");
    }

    if (!reason || reason.trim().length < 10) {
      req.flash("error", "Reason must be at least 10 characters long");
      return res.redirect("/credit-request");
    }

    await create_credit_request(userId, requestedCredits, reason);

    req.flash("success", "Credit request submitted successfully");
    res.redirect("/credit-request");
  } catch (error) {
    console.error("Credit request creation error:", error);
    
    const errorMessage = error.message === "You already have a pending credit request" 
      ? error.message 
      : "Failed to process the credits request";
    
    req.flash("error", errorMessage);
    res.redirect("/credit-request");
  }
});

const getUserCreditRequests = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const creditRequests = await get_user_credit_requests(userId, page, limit);

    res.render("credits/credits_list", {
      title: "My Credit Requests | DocScan",
      user: req.user,
      creditRequests: creditRequests.requests,
      totalPages: creditRequests.totalPages,
      currentPage: creditRequests.currentPage,
      url: req.originalUrl,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error("Credit request retrieval error:", error);
    req.flash("error", "Failed to retrieve credit requests");
    res.redirect("/dashboard");
  }
});

export { getCreditsPage, createCreditsRequest, getUserCreditRequests };