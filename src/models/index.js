import { sequelize } from "../config/index.js";
import User from "./user.model.js";
import Document from "./document.model.js";
import Scan from "./scan.model.js";
import CreditRequest from "./credit_request.model.js";
import AIScan from "./ai_scan.model.js";
import SystemLog from "./system_log.model.js";

// Define associations
User.hasMany(Document, { foreignKey: "userId" });
Document.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Scan, { foreignKey: "userId" });
Scan.belongsTo(User, { foreignKey: "userId" });

Document.hasMany(Scan, { as: "FirstDocument", foreignKey: "documentId1" });
Document.hasMany(Scan, { as: "SecondDocument", foreignKey: "documentId2" });
Scan.belongsTo(Document, { as: "FirstDocument", foreignKey: "documentId1" });
Scan.belongsTo(Document, { as: "SecondDocument", foreignKey: "documentId2" });

User.hasMany(CreditRequest, { foreignKey: "userId" });
CreditRequest.belongsTo(User, { foreignKey: "userId", as: "requester" });

User.hasMany(CreditRequest, { foreignKey: "reviewedBy" });
CreditRequest.belongsTo(User, { foreignKey: "reviewedBy", as: "reviewer" });

SystemLog.belongsTo(User, { foreignKey: "userId", as: "User" });
User.hasMany(SystemLog, { foreignKey: "userId", as: "logs" });

const models = {
  User,
  Document,
  Scan,
  CreditRequest,
  AIScan,
  SystemLog,
  sequelize,
};

export default models;