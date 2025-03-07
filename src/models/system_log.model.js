import { DataTypes } from "sequelize";
import { sequelize } from "../config/index.js";

const SystemLog = sequelize.define(
  "SystemLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    logLevel: {
      type: DataTypes.ENUM("info", "warning", "error", "critical"),
      defaultValue: "info",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "system_logs",
    timestamps: true,
  }
);

export default SystemLog;