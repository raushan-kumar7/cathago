import { DataTypes } from "sequelize";
import { sequelize } from "../config/index.js";

const AIMatch = sequelize.define(
  "AIMatch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    documentId1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Documents",
        key: "id",
      },
    },
    documentId2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Documents",
        key: "id",
      },
    },
    aiProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      // Options: 'openai', 'google', 'deepseek', 'local'
    },
    matchScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    matchDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creditsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "ai_matches",
    timestamps: true,
  }
);

export default AIMatch;