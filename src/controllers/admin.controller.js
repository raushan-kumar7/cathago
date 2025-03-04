import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  get_credits_requests,
  process_credit_request,
} from "../services/credit_request.service.js";

// Admin route to view all credit requests
const getAllCreditRequests = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const creditRequests = await get_credits_requests(page, limit);

    res.render("admin/credit-requests", {
      title: "Credit Requests Management",
      user: req.user,
      creditRequests: creditRequests.requests,
      totalPages: creditRequests.totalPages,
      currentPage: creditRequests.currentPage,
      totalRequests: creditRequests.totalRequests,
      url: req.originalUrl,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    req.flash("error", "Failed to retrieve credit requests");
    res.redirect("/admin/dashboard");
  }
});

// Admin route to process (approve/decline) a credit request
const processCreditRequest = asyncHandler(async (req, res) => {
  try {
    const { requestId, status, reviewNotes } = req.body;
    const adminId = req.user.id;

    // Validate input
    if (!requestId || !status) {
      req.flash("error", "Invalid request parameters");
      return res.redirect("/admin/credit-requests");
    }

    // Validate status
    if (!["approved", "declined"].includes(status)) {
      req.flash("error", "Invalid status");
      return res.redirect("/admin/credit-requests");
    }

    // Process the credit request
    await process_credit_request(requestId, adminId, status, reviewNotes || "");

    // Set success message based on status
    const successMessage =
      status === "approved"
        ? "Credit request approved successfully"
        : "Credit request declined";

    req.flash("success", successMessage);
    res.redirect("/admin/credit-requests");
  } catch (error) {
    // Handle specific errors
    const errorMessage = error.message || "Failed to process credit request";
    req.flash("error", errorMessage);
    res.redirect("/admin/credit-requests");
  }
});

export { getAllCreditRequests, processCreditRequest };