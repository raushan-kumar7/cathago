import { create_initial_admin } from "../services/admin.service.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptAdminCreation = () => {
  return new Promise((resolve, reject) => {
    console.log("🚀 Initial Admin User Creation");

    rl.question("🆔 Enter admin username: ", (username) => {
      rl.question("✉️  Enter admin email: ", (email) => {
        const askPassword = () => {
          rl.question("🔑 Enter admin password (min 6 chars): ", (password) => {
            if (password.length < 6) {
              console.log("⚠️  Password must be at least 6 characters long. Please try again.");
              askPassword();
            } else {
              rl.close();
              resolve({ username, email, password });
            }
          });
        };
        askPassword();
      });
    });
  });
};

const initializeAdmin = async () => {
  try {
    const adminData = await promptAdminCreation();
    const admin = await create_initial_admin(adminData);

    console.log("✅ Admin user created successfully!");
    console.log(`👤 Admin Details:`);
    console.log(`🆔 ID: ${admin.id}`);
    console.log(`👤 Username: ${admin.username}`);
    console.log(`✉️  Email: ${admin.email}`);
    console.log(`🛡️  Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Admin creation failed:", error.message);
    process.exit(1);
  }
};

initializeAdmin();
