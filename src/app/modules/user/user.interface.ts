import { ObjectId, Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IAuthProvider {
  provider: "credentials" | "google"; // Google, Credential
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isActive?: IsActive;
  isDeleted?: string;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  parcelSend?: Types.ObjectId[];
  parcelReceive?: Types.ObjectId[];
  guide?: Types.ObjectId[];
  createdAt?: Date;
}
