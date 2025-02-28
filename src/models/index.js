import { sequelize } from "../config/index.js";
import User from "./user.model.js";
import Document from "./document.model.js";
import Scan from "./scan.model.js";
import CreditRequest from "./credit_request.model.js";

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

const models = {
  User,
  Document,
  Scan,
  CreditRequest,
  sequelize,
};

export default models;