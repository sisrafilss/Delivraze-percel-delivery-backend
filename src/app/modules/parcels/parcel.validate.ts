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
