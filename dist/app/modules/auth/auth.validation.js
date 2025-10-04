"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileZodSchema = exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.changePasswordZodSchema = exports.credentialLoginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.credentialLoginZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
exports.changePasswordZodSchema = zod_1.default.object({
    newPassword: zod_1.default.string(),
    oldPassword: zod_1.default.string(),
});
exports.forgotPasswordZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.resetPasswordZodSchema = zod_1.default.object({
    id: zod_1.default.string(),
    newPassword: zod_1.default.string(),
});
exports.updateProfileZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});
