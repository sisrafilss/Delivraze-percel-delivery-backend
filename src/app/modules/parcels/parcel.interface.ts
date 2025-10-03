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
  CLOTHES = "Clothes",
  BOOKS = "Books",
  COSMETICS = "Cosmetics",
  TOYS = "Toys",
  ELECTRONICS = "Electronics",
}

export interface IStatusLog {
  status: ParcelStatus;
  updatedBy: Types.ObjectId;
  note?: string;
  location?: string;
  timestamp: Date;
}

export interface IParcelRequest {
  _id?: Types.ObjectId;
  trackingId?: string;
  senderId: Types.ObjectId;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderEmail: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverEmail: string;

  parcelType: ParcelType;
  weight: number; // in gm
  specialInstructions?: string;

  pickupLocation: string;
  dropoffLocation: string;
  estimatedCost?: number;
  status: ParcelStatus;
  statusLog: IStatusLog[];

  paymentMethod: PaymentMethod;
  isPaid: boolean;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
