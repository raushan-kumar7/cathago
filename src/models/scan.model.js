import { DataTypes } from "sequelize";
import { sequelize } from "../config/index.js";

const Scan = sequelize.define(
  "Scan",
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
    matchDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creditsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "scans_docs",
    timestamps: true,
  }
);

export default Scan;