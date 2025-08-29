"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.changePasswordZodSchema = exports.credentialLoginZodSchema = void 0;
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
