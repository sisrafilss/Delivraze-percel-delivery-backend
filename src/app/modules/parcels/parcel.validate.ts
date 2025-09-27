import { z } from "zod";
import { ParcelStatus, ParcelType, PaymentMethod } from "./parcel.interface";

export const parcelRequestZodSchema = z.object({
  senderId: z.string(),
  receiverName: z.string({
    required_error: "Receiver name is required",
  }),
  receiverPhone: z.string({
    required_error: "Receiver phone number is required",
  }),
  receiverAddress: z.string({
    required_error: "Receiver address is required",
  }),
  receiverEmail: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be atleast 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  // define parcel type as an enum
  parcelType: z.string({
    required_error: "Parcel type is required",
  }),
  weight: z.number({
    required_error: "Parcel weight is required",
    invalid_type_error: "Parcel weight must be a number (in grams)",
  }),
  specialInstructions: z.string().optional(),
  pickupLocation: z.string({
    required_error: "Pickup location is required",
  }),
  dropoffLocation: z.string({
    required_error: "Dropoff location is required",
  }),
});

export const confirmDeliveryByReceiverZodSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "_id must be a 24-char hex MongoDB ObjectId"),
});

export const updateParcelByAdminZodSchema = z.object({
  senderName: z.string().min(1, "senderName cannot be empty").optional(),
  senderPhone: z
    .string()
    .regex(/^(?:\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),
  senderAddress: z.string().min(1, "senderAddress cannot be empty").optional(),

  receiverName: z.string().min(1, "receiverName cannot be empty").optional(),
  receiverPhone: z
    .string()
    .regex(/^(?:\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),
  receiverAddress: z
    .string()
    .min(1, "receiverAddress cannot be empty")
    .optional(),

  parcelType: z.nativeEnum(ParcelType).optional(),
  weight: z.number().positive("weight must be greater than 0").optional(),
  specialInstructions: z.string().optional(),

  pickupLocation: z
    .string()
    .min(1, "pickupLocation cannot be empty")
    .optional(),
  dropoffLocation: z
    .string()
    .min(1, "dropoffLocation cannot be empty")
    .optional(),

  status: z.nativeEnum(ParcelStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  isPaid: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
});

export const updateParcelStatusSchema = z.object({
  status: z.nativeEnum(ParcelStatus, {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
  note: z.string().max(255, "Note cannot exceed 255 characters").optional(),
  location: z.string().optional(),
});
