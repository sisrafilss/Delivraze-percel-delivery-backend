/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { parcelSearchableFields } from "./parcel.constant";
import {
  IParcelRequest,
  IStatusLog,
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

const cancelParcelBySender = async (
  decodedToken: JwtPayload,
  parcelId: string
) => {
  const isParcelExist = await Parcel.findById(parcelId);

  if (!isParcelExist)
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found!");

  if (!isParcelExist.senderId === decodedToken.userId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Parcel id is not matched with your parcels"
    );
  }

  if (!(isParcelExist.status === ParcelStatus.PENDING)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Parcel can't be canlcel, because it is already ${isParcelExist.status}`
    );
  }

  isParcelExist.status = ParcelStatus.CANCELLED;

  const statusLog: IStatusLog = {
    status: ParcelStatus.CANCELLED,
    updatedBy: decodedToken.userId,
    note: "Parcel sending cancelled by sender",
    timestamp: new Date(),
  };
  isParcelExist.statusLog.push(statusLog);

  const updatedParcel = await isParcelExist.save();
  return updatedParcel;
};

const getAllParcelsBySender = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  const updatedQuery = {
    senderId: decodedToken.userId,
    ...query,
  };

  const queryBuilder = new QueryBuilder(Parcel.find(), updatedQuery)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate()
    .populate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);
  return { data, meta };
};

const getIncommingParcelsByReceiver = async (
  decodedToken: JwtPayload,
  query: Record<string, any>
) => {
  const forbiddenStatuses = [ParcelStatus.CANCELLED, ParcelStatus.DELIVERED];

  // Step 1: validate status input
  if (query.status) {
    if (typeof query.status === "string") {
      if (forbiddenStatuses.includes(query.status as ParcelStatus)) {
        throw new Error(
          `Filtering by status '${query.status}' is not allowed.`
        );
      }
    }

    if (Array.isArray(query.status)) {
      if (query.status.some((st) => forbiddenStatuses.includes(st))) {
        throw new Error(
          `Filtering by CANCELLED or DELIVERED status is not allowed.`
        );
      }
    }
  }

  // Step 2: build status condition
  let statusCondition: any;

  if (!query.status) {
    // Case 1: user didn't pass status → exclude CANCELLED & DELIVERED
    statusCondition = { $nin: forbiddenStatuses };
  } else {
    // Case 2: user passed status → keep it as-is (validated already)
    statusCondition = query.status;
  }

  const updatedQuery = {
    ...query,
    receiverEmail: decodedToken.email,
    status: statusCondition,
  };

  // Step 3: query builder
  const queryBuilder = new QueryBuilder(Parcel.find(), updatedQuery)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate()
    .populate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getDeliveryHistoryByReceiver = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

  const updatedQuery = {
    ...query,
    receiverEmail: decodedToken.email,
  };

  const queryBuilder = new QueryBuilder(Parcel.find(), updatedQuery)
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

const confirmDeliveryByReceiver = async (
  decodedToken: JwtPayload,
  payload: Partial<IParcelRequest>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

  // if (decodedToken.email !== payload.receiverEmail) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `Credential doesn't match. Check the user email in the request body`
  //   );
  // }

  const isParcelExist = await Parcel.findById(payload._id);
  if (!isParcelExist) {
    throw new AppError(httpStatus.BAD_REQUEST, `Parcel not found!`);
  }

  if (isParcelExist.receiverEmail !== decodedToken.email) {
    throw new AppError(httpStatus.BAD_REQUEST, `Parcel not matched!`);
  }

  if (isParcelExist.status === ParcelStatus.CANCELLED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This parcel is already cancelled.`
    );
  }

  if (isParcelExist.status === ParcelStatus.DELIVERED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This parcel is already delivered`
    );
  }

  isParcelExist.status = ParcelStatus.DELIVERED;
  const statusLog: IStatusLog = {
    status: ParcelStatus.DELIVERED,
    updatedBy: decodedToken.userId,
    note: "Parcel delivery confirmed by receiver",
    timestamp: new Date(),
  };

  isParcelExist.statusLog.push(statusLog);

  const updatedParcel = await isParcelExist.save();
  return updatedParcel;
};

const getAllParcelsByAdmin = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (isUserExists?.role !== Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not an Admin");
  }

  const queryBuilder = new QueryBuilder(Parcel.find(), query)
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate()
    .populate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const updateParcleByAdmin = async (
  decodedToken: JwtPayload,
  parcelId: string,
  payload: Record<string, string>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (isUserExists?.role !== Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not an Admin");
  }

  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found!");
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedParcel;
};

const deleteParcelByAdmin = async (
  decodedToken: JwtPayload,
  parcelId: string
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (isUserExists?.role !== Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not an Admin");
  }

  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found!");
  }

  const deletedData = await Parcel.findByIdAndDelete(parcelId);
  return deletedData;
};

const updateParcelStatusByAdmin = async (
  decodedToken: JwtPayload,
  parcelId: string,
  payload: Record<string, string>
) => {
  const isUserExists = await User.findById(decodedToken.userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (isUserExists?.role !== Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not an Admin");
  }

  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found!");
  }

  isParcelExist.status = payload.status as ParcelStatus;
  isParcelExist.statusLog.push({
    status: payload.status as ParcelStatus,
    updatedBy: decodedToken.userId,
    note: payload.note,
    location: payload.location,
    timestamp: new Date(),
  });

  return await isParcelExist.save();
};

const getParcelByTrackingId = async (trackingId: string) => {
  const isParcelExist = await Parcel.findOne({
    trackingId: trackingId,
  }).populate("statusLog.updatedBy", "name email role");
  if (!isParcelExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found!");
  }

  return isParcelExist;
};
const getSingleParcelByAdmin = async (parcelId: string) => {
  return await Parcel.findById(parcelId).populate(
    "statusLog.updatedBy",
    "name email role"
  );
};
const getSingleParcelStatusLogByAdmin = async (parcelId: string) => {
  return await Parcel.findById(parcelId)
    .select("statusLog")
    .populate("statusLog.updatedBy", "name email role");
};

export const ParcelService = {
  createParcelSend,
  cancelParcelBySender,
  getAllParcelsBySender,
  getIncommingParcelsByReceiver,
  getDeliveryHistoryByReceiver,
  confirmDeliveryByReceiver,
  getAllParcelsByAdmin,
  updateParcleByAdmin,
  deleteParcelByAdmin,
  updateParcelStatusByAdmin,
  getParcelByTrackingId,
  getSingleParcelByAdmin,
  getSingleParcelStatusLogByAdmin,
};
