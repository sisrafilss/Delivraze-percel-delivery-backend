"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusSchema = exports.updateParcelByAdminZodSchema = exports.confirmDeliveryByReceiverZodSchema = exports.parcelRequestZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.parcelRequestZodSchema = zod_1.z.object({
    senderId: zod_1.z.string(),
    receiverName: zod_1.z.string({
        required_error: "Receiver name is required",
    }),
    receiverPhone: zod_1.z.string({
        required_error: "Receiver phone number is required",
    }),
    receiverAddress: zod_1.z.string({
        required_error: "Receiver address is required",
    }),
    receiverEmail: zod_1.z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be atleast 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    // define parcel type as an enum
    parcelType: zod_1.z.string({
        required_error: "Parcel type is required",
    }),
    weight: zod_1.z.number({
        required_error: "Parcel weight is required",
        invalid_type_error: "Parcel weight must be a number (in grams)",
    }),
    specialInstructions: zod_1.z.string().optional(),
    pickupLocation: zod_1.z.string({
        required_error: "Pickup location is required",
    }),
    dropoffLocation: zod_1.z.string({
        required_error: "Dropoff location is required",
    }),
});
exports.confirmDeliveryByReceiverZodSchema = zod_1.z.object({
    receiverEmail: zod_1.z.string().email("receiverEmail must be a valid email"),
    _id: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "_id must be a 24-char hex MongoDB ObjectId"),
});
exports.updateParcelByAdminZodSchema = zod_1.z.object({
    senderName: zod_1.z.string().min(1, "senderName cannot be empty").optional(),
    senderPhone: zod_1.z
        .string()
        .regex(/^(?:\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
        .optional(),
    senderAddress: zod_1.z.string().min(1, "senderAddress cannot be empty").optional(),
    receiverName: zod_1.z.string().min(1, "receiverName cannot be empty").optional(),
    receiverPhone: zod_1.z
        .string()
        .regex(/^(?:\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
        .optional(),
    receiverAddress: zod_1.z
        .string()
        .min(1, "receiverAddress cannot be empty")
        .optional(),
    parcelType: zod_1.z.nativeEnum(parcel_interface_1.ParcelType).optional(),
    weight: zod_1.z.number().positive("weight must be greater than 0").optional(),
    specialInstructions: zod_1.z.string().optional(),
    pickupLocation: zod_1.z
        .string()
        .min(1, "pickupLocation cannot be empty")
        .optional(),
    dropoffLocation: zod_1.z
        .string()
        .min(1, "dropoffLocation cannot be empty")
        .optional(),
    status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus).optional(),
    paymentMethod: zod_1.z.nativeEnum(parcel_interface_1.PaymentMethod).optional(),
    isPaid: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
});
exports.updateParcelStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus, {
        required_error: "Status is required",
        invalid_type_error: "Invalid status value",
    }),
    note: zod_1.z.string().max(255, "Note cannot exceed 255 characters").optional(),
    location: zod_1.z.string().optional(),
});
