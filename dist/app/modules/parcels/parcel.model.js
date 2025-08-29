"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const nanoid_1 = require("nanoid");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
    location: { type: String },
    timestamp: { type: Date, default: Date.now() },
}, { _id: false });
const parcelRequestSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        unique: true,
        default: () => (0, nanoid_1.nanoid)(15), // auto-generate a short tracking code
    },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    senderAddress: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    parcelType: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelType),
        required: true,
    },
    weight: { type: Number, required: true }, // in gm
    specialInstructions: { type: String },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    estimatedCost: { type: Number },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.PENDING,
    },
    statusLog: [statusLogSchema],
    paymentMethod: {
        type: String,
        enum: Object.values(parcel_interface_1.PaymentMethod),
    },
    isPaid: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});
parcelRequestSchema.path("statusLog").default([]);
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelRequestSchema);
