import { Sequelize, Op } from "sequelize";
import path from "path";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the Sqlite database.");
  } catch (error) {
    console.log("ERROR: ", error)
    process.exit(1);
  }
};

export { sequelize, connectDB, Op };