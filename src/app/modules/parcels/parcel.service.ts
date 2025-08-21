import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  IParcelRequest,
  ParcelStatus,
  PaymentMethod,
} from "./parcel.interface";
import { Parcel } from "./parcel.model";

const parcelSendRequest = async (
  decodedToken: JwtPayload,
  payload: Partial<IParcelRequest>
) => {
  const isUserExists = await User.findById(payload.senderId);

  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

  if (decodedToken.role === Role.RECEIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver can't send a parcel");
  }

  if (!isUserExists.phone && !isUserExists.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Update your address and phone to complete the send request"
    );
  }

  const updatedPayload = {
    senderId: decodedToken.userId,
    senderName: isUserExists.name,
    senderPhone: isUserExists.phone as string,
    senderAddress: isUserExists.address as string,
    ...payload,
    status: ParcelStatus.PENDING,
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
    isPaid: false,
  };

  const updatedParcel = Parcel.create(updatedPayload);
  return updatedParcel;
};

const cancelParcel = async (decodedToken: JwtPayload, parcelId: string) => {
  const isParcelExists = await Parcel.findById(parcelId);

  if (!isParcelExists)
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");

  if (!isParcelExists.senderId === decodedToken.userId) {
    console.log(isParcelExists.senderId, decodedToken.userId);
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Parcel id is not matched with your parcels"
    );
  }

  if (!(isParcelExists.status === ParcelStatus.PENDING)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Parcel can't be canlcel, because it is already ${isParcelExists.status}`
    );
  }

  isParcelExists.status = ParcelStatus.CANCELLED;
  await isParcelExists.save();

  //   return {};
};

export const ParcelService = {
  parcelSendRequest,
  cancelParcel,
};
