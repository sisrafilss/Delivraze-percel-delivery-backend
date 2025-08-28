import z from "zod";

export const credentialLoginZodSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const changePasswordZodSchema = z.object({
  newPassword: z.string(),
  oldPassword: z.string(),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
});
