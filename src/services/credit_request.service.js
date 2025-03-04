import models from "../models/index.js";
import { sequelize } from "../config/index.js";

const { CreditRequest, User } = models;

const create_credit_request = async (userId, reqCredits, reason) => {
  // Validate inputs
  if (!userId || reqCredits <= 0 || reason.trim().length < 10) {
    throw new Error("Invalid input parameters");
  }

  const existingPendingRequest = await CreditRequest.findOne({
    where: {
      userId: userId,
      status: "pending",
    },
  });

  if (existingPendingRequest) {
    throw new Error("You already have a pending credit request");
  }

  return CreditRequest.create({
    userId,
    requestedCredits: reqCredits,
    reason: reason.trim(),
    status: "pending",
  });
};

const get_credits_requests = async (page = 1, limit = 10, filter = {}) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await CreditRequest.findAndCountAll({
    where: filter,
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "username", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    totalRequests: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    requests: rows,
  };
};

const process_credit_request = async (
  requestId,
  adminId,
  status,
  reviewNotes = ""
) => {
  const txn = await sequelize.transaction();

  try {
    const creditRequest = await CreditRequest.findByPk(requestId, { transaction: txn });

    if (!creditRequest) {
      throw new Error("Credit request not found");
    }

    if (creditRequest.status !== "pending") {
      throw new Error("This credit request is already processed");
    }

    if (status === "approved") {
      const user = await User.findByPk(creditRequest.userId, { transaction: txn });

      if (!user) {
        throw new Error("User does not exist");
      }

      await user.update(
        {
          credits: user.credits + creditRequest.requestedCredits,
        },
        { transaction: txn }
      );
    }

    await creditRequest.update(
      {
        status,
        reviewedBy: adminId,
        reviewNotes: reviewNotes.trim(),
        updatedAt: new Date()
      },
      { transaction: txn }
    );

    await txn.commit();
    return creditRequest;
  } catch (error) {
    await txn.rollback();
    throw error;
  }
};

const get_user_credit_requests = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await CreditRequest.findAndCountAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    totalRequests: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    requests: rows,
  };
};

export {
  create_credit_request,
  get_credits_requests,
  process_credit_request,
  get_user_credit_requests,
};