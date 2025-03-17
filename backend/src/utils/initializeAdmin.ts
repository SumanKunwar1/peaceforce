import { userService } from "../services";
import { User } from "../models";

const adminUserData = {
  name: "btmc foundation",
  email: "btmcfoundation@gmail.com",
  phoneNumber: "9851042257",
  role: "admin",
  password: "BTMC@Foundation",
  isActive: true,
};

export const initializeAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("✌ Admin user already exists.✌");
      return;
    }

    await userService.createUser(adminUserData);
    console.log("✌ Admin user created successfully.✌");
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};
