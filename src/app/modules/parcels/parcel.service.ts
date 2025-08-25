import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { parcelSearchableFields } from "./parcel.constant";
import {
  IParcelRequest,
  ParcelStatus,
  PaymentMethod,
} from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcelSend = async (
  decodedToken: JwtPayload,
  payload: Partial<IParcelRequest>
) => {
  const isUserExists = await User.findById(payload.senderId);

  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

  if (decodedToken.userId !== payload.senderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are un-authorized!");
  }

  if (decodedToken.role === Role.RECEIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver can't send a parcel");
  }

  if (!isUserExists.phone && !isUserExists.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Update your address and phone to complete the send request"
    );
  }

  const isReceiverExists = await User.find({ email: payload.receiverEmail });

  if (!isReceiverExists.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver not found!");
  }

  if (isReceiverExists[0].role !== Role.RECEIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, `Receiver email is invalid`);
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

const getAllParcelsBySender = async (decodedToken: JwtPayload) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (isUserExists?.role !== Role.SENDER) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not a SENDER");
  }

  // const matchedParcels = await Parcel.find(query);
  // console.log("MATCHED PARCELS: ", matchedParcels);

  const query = {
    senderId: decodedToken.userId,
  };

  const queryBuilder = new QueryBuilder(Parcel.find(), query)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getIncommingParcelsByReceiver = async (decodedToken: JwtPayload) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (isUserExists?.role !== Role.RECEIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not a Receiver");
  }

  const query = {
    receiverEmail: decodedToken.email,
    status: {
      $in: [
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.ACCEPTED,
        ParcelStatus.PENDING,
        ParcelStatus.CANCELLED,
      ],
    },
  };

  const queryBuilder = new QueryBuilder(Parcel.find(), query)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getDeliveryHistoryByReceiver = async (decodedToken: JwtPayload) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (isUserExists?.role !== Role.RECEIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not a Receiver");
  }

  const query = {
    receiverEmail: decodedToken.email,
  };

  const queryBuilder = new QueryBuilder(Parcel.find(), query)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

export const ParcelService = {
  createParcelSend,
  cancelParcel,
  getAllParcelsBySender,
  getIncommingParcelsByReceiver,
  getDeliveryHistoryByReceiver,
};
