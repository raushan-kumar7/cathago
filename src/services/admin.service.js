import models from "../models/index.js";
import { ExpressError } from "../utils/ExpressError.js";
import { Op } from "sequelize";
const { User, Document, CreditRequest } = models;

const check_admin_exists = async () => {
  const adminCount = await User.count({ where: { role: 'admin' } });
  return adminCount > 0;
};

const create_initial_admin = async (adminData) => {
  try {
    const adminExists = await check_admin_exists();
    if (adminExists) {
      throw new Error("Admin user already exists");
    }
    const { username, email, password } = adminData;
    if (!username || !email || !password) {
      throw new Error("All admin creation fields are required");
    }
    const adminUser = await User.create({
      ...adminData,
      role: 'admin'
    });
    return adminUser;
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to create admin user");
  }
};

const list_users = async (page = 1, limit = 10, filter = {}) => {
  try {
    const offset = (page - 1) * limit;
   
    const whereClause = {
      ...filter,
      role: {
        [Op.ne]: 'admin'
      }
    };
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['password', 'refreshToken']
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return {
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows
    };
  } catch (error) {
    throw new ExpressError(400, error.message || "Failed to retrieve users");
  }
};

const get_stats = async () => {
  try {
    const totalUsers = await User.count({
      where: { role: { [Op.ne]: 'admin' } }
    }) || 0;
   
    const totalDocuments = await Document.count() || 0;
   
    const pendingCreditRequests = await CreditRequest.count({
      where: { status: 'pending' }
    }) || 0;
   
    return {
      totalUsers,
      totalDocuments,
      pendingCreditRequests,
    };
  } catch (error) {
    console.error("Error fetching system stats:", error);
    return {
      totalUsers: 0,
      totalDocuments: 0,
      pendingCreditRequests: 0,
    };
  }
};

export {
  get_stats,
  check_admin_exists,
  create_initial_admin,
  list_users
};