import { ObjectId, Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IAuthProvider {
  provider: "credentials" | "google"; // Google, Credential
  providerId: string;
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  parcelSend?: Types.ObjectId[];
  parcelReceive?: Types.ObjectId[];
  guide?: Types.ObjectId[];
  createdAt?: Date;
}
