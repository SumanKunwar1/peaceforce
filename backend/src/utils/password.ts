import bcrypt from "bcryptjs";

export const isPasswordMatch = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
