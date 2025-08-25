import { z } from "zod";

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
  receiverEmail: z.string().email("receiverEmail must be a valid email"),
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "_id must be a 24-char hex MongoDB ObjectId"),
});
