import { Types } from "mongoose";

export enum ParcelStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  ONLINE = "ONLINE",
}

export enum ParcelType {
  DOCUMENTS = "Documents",
  CLOTHES = "Cloths",
  BOOKS = "Books",
  COSMETICS = "Cosmetics",
  TOYS = "Toys",
  ELECTRONICS = "Electronics",
}

export interface IParcelRequest {
  senderId: Types.ObjectId;
  senderName: string;
  senderPhone: string;
  senderAddress: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;

  parcelType: ParcelType;
  weight: number; // in gm
  specialInstructions?: string;

  pickupLocation: string;
  dropoffLocation: string;
  estimatedCost?: number;

  status: ParcelStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
