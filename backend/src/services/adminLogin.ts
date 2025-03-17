import { User } from "../models/index";
import { httpMessages } from "../utils/HttpMessage";
import { isPasswordMatch } from "../utils/password";
import { GenerateAuthtoken } from "../utils/token";

class AdminLoginService {
  async loginAdmin(email: string, password: string) {
    try {
      const user = await User.findOne({
        email,
        role: "admin",
      });

      if (!user) {
        throw httpMessages.USER_NOT_FOUND("Admin inactive or");
      }

      const isPasswordValid = await isPasswordMatch(password, user.password!);

      if (!isPasswordValid) {
        throw httpMessages.INVALID_CREDENTIALS;
      }
      const token = GenerateAuthtoken(user.email);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      };
    } catch (error) {
      console.error("Error logging in admin:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const adminLoginService = new AdminLoginService();
