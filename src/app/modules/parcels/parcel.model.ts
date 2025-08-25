import { Schema, model } from "mongoose";
import {
  IParcelRequest,
  ParcelStatus,
  ParcelType,
  PaymentMethod,
} from "./parcel.interface";

const parcelRequestSchema = new Schema<IParcelRequest>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    senderAddress: { type: String, required: true },

    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    receiverEmail: { type: String, required: true },

    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: true,
    },
    weight: { type: Number, required: true }, // in gm
    specialInstructions: { type: String },

    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    estimatedCost: { type: Number },

    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
    },
    isPaid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Parcel = model<IParcelRequest>("Parcel", parcelRequestSchema);
