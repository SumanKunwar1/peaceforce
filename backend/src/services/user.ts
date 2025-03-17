import { IUser, User } from "../models";
import { IUserInput } from "../types";
import { httpMessages } from "../utils/HttpMessage";
import { deleteFile } from "../utils/deleteFile";
class UserService {
  async createUser(userData: IUserInput): Promise<IUser> {
    try {
      const newUser = new User({
        ...userData,
      });

      await newUser.save();
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getUsers(): Promise<IUser[]> {
    try {
      const users = await User.find();

      // Format cv and coverLetter to URLs if present
      const formattedUsers = users.map((user) => {
        if (user.cv) {
          user.cv = `/api/image/${user.cv}`;
        }
        if (user.coverLetter) {
          user.coverLetter = `/api/image/${user.coverLetter}`;
        }
        return user;
      });

      return formattedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.USER_NOT_FOUND();
      }

      // Format cv and coverLetter to URLs if present
      if (user.cv) {
        user.cv = `/api/image/cv/${user.cv}`;
      }
      if (user.coverLetter) {
        user.coverLetter = `/api/image/coverletter/${user.coverLetter}`;
      }

      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateUser(
    userId: string,
    userData: IUserInput
  ): Promise<IUser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, userData, {
        new: true,
      });

      if (!updatedUser) {
        throw httpMessages.USER_NOT_FOUND();
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw httpMessages.USER_NOT_FOUND();
      }

      if (user.cv) await deleteFile(user.cv);
      if (user.coverLetter) await deleteFile(user.coverLetter);

      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw httpMessages.USER_NOT_FOUND();
      }
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const userService = new UserService();
