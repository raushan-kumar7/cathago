import { DataTypes } from "sequelize";
import { sequelize } from "../config/index.js";

const AIScan = sequelize.define(
  "AIScan",
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
    matchScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    aiProvider: {
      type: DataTypes.ENUM("openai", "gemini"),
      allowNull: false,
      defaultValue: "openai",
    },
    analysisDepth: {
      type: DataTypes.ENUM("standard", "deep"),
      allowNull: false,
      defaultValue: "standard",
    },
    matchDetails: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    creditsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "ai_scans",
    timestamps: true,
  }
);

export default AIScan;