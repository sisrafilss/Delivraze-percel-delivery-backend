import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import {
  IParcelRequest,
  IStatusLog,
  ParcelStatus,
  ParcelType,
  PaymentMethod,
} from "./parcel.interface";

function generateTrackingId() {
  return uuidv4().replace(/-/g, "").slice(0, 15);
}

const statusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
    location: { type: String },
    timestamp: { type: Date, default: Date.now() },
  },
  { _id: false }
);

const parcelRequestSchema = new Schema<IParcelRequest>(
  {
    trackingId: {
      type: String,
      unique: true,
      default: () => generateTrackingId(), // auto-generate a short tracking code
    },
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
    statusLog: [statusLogSchema],
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
    },
    isPaid: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

parcelRequestSchema.path("statusLog").default([]);

export const Parcel = model<IParcelRequest>("Parcel", parcelRequestSchema);
