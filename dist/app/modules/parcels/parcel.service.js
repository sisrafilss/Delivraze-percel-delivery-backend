"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const parcel_constant_1 = require("./parcel.constant");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const createParcelSend = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(payload.senderId);
    if (!isUserExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    if (decodedToken.userId !== payload.senderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are un-authorized!");
    }
    if (decodedToken.role === user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver can't send a parcel");
    }
    if (!isUserExists.phone && !isUserExists.address) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Update your address and phone to complete the send request");
    }
    const isReceiverExists = yield user_model_1.User.find({ email: payload.receiverEmail });
    if (!isReceiverExists.length) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver not found!");
    }
    if (isReceiverExists[0].role !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Receiver email is invalid`);
    }
    const updatedPayload = Object.assign(Object.assign({ senderId: decodedToken.userId, senderName: isUserExists.name, senderPhone: isUserExists.phone, senderAddress: isUserExists.address, senderEmail: isUserExists.email }, payload), { status: parcel_interface_1.ParcelStatus.PENDING, paymentMethod: parcel_interface_1.PaymentMethod.CASH_ON_DELIVERY, isPaid: false });
    const updatedParcel = parcel_model_1.Parcel.create(updatedPayload);
    return updatedParcel;
});
const cancelParcelBySender = (decodedToken, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const isParcelExist = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExist)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found!");
    if (!isParcelExist.senderId === decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel id is not matched with your parcels");
    }
    if (!(isParcelExist.status === parcel_interface_1.ParcelStatus.PENDING)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel can't be canlcel, because it is already ${isParcelExist.status}`);
    }
    isParcelExist.status = parcel_interface_1.ParcelStatus.CANCELLED;
    const statusLog = {
        status: parcel_interface_1.ParcelStatus.CANCELLED,
        updatedBy: decodedToken.userId,
        note: "Parcel sending cancelled by sender",
        timestamp: new Date(),
    };
    isParcelExist.statusLog.push(statusLog);
    const updatedParcel = yield isParcelExist.save();
    return updatedParcel;
});
const getAllParcelsBySender = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    const updatedQuery = Object.assign({ senderId: decodedToken.userId }, query);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), updatedQuery)
        .filter()
        .search(parcel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getIncommingParcelsByReceiver = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const forbiddenStatuses = [parcel_interface_1.ParcelStatus.CANCELLED, parcel_interface_1.ParcelStatus.DELIVERED];
    // Step 1: validate status input
    if (query.status) {
        if (typeof query.status === "string") {
            if (forbiddenStatuses.includes(query.status)) {
                throw new Error(`Filtering by status '${query.status}' is not allowed.`);
            }
        }
        if (Array.isArray(query.status)) {
            if (query.status.some((st) => forbiddenStatuses.includes(st))) {
                throw new Error(`Filtering by CANCELLED or DELIVERED status is not allowed.`);
            }
        }
    }
    // Step 2: build status condition
    let statusCondition;
    if (!query.status) {
        // Case 1: user didn't pass status → exclude CANCELLED & DELIVERED
        statusCondition = { $nin: forbiddenStatuses };
    }
    else {
        // Case 2: user passed status → keep it as-is (validated already)
        statusCondition = query.status;
    }
    const updatedQuery = Object.assign(Object.assign({}, query), { receiverEmail: decodedToken.email, status: statusCondition });
    // Step 3: query builder
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), updatedQuery)
        .filter()
        .search(parcel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getDeliveryHistoryByReceiver = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    const updatedQuery = Object.assign(Object.assign({}, query), { receiverEmail: decodedToken.email });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), updatedQuery)
        .filter()
        .search(parcel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const confirmDeliveryByReceiver = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    // if (decodedToken.email !== payload.receiverEmail) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     `Credential doesn't match. Check the user email in the request body`
    //   );
    // }
    const isParcelExist = yield parcel_model_1.Parcel.findById(payload._id);
    if (!isParcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel not found!`);
    }
    if (isParcelExist.receiverEmail !== decodedToken.email) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel not matched!`);
    }
    if (isParcelExist.status === parcel_interface_1.ParcelStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `This parcel is already cancelled.`);
    }
    if (isParcelExist.status === parcel_interface_1.ParcelStatus.DELIVERED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `This parcel is already delivered`);
    }
    isParcelExist.status = parcel_interface_1.ParcelStatus.DELIVERED;
    const statusLog = {
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        updatedBy: decodedToken.userId,
        note: "Parcel delivery confirmed by receiver",
        timestamp: new Date(),
    };
    isParcelExist.statusLog.push(statusLog);
    const updatedParcel = yield isParcelExist.save();
    return updatedParcel;
});
const getAllParcelsByAdmin = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not an Admin");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query)
        .filter()
        .search(parcel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const updateParcleByAdmin = (decodedToken, parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not an Admin");
    }
    const isParcelExist = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel not found!");
    }
    if (payload.status) {
        isParcelExist.status = payload.status;
        isParcelExist.statusLog.push({
            status: payload.status,
            updatedBy: decodedToken.userId,
            note: payload === null || payload === void 0 ? void 0 : payload.note,
            location: payload === null || payload === void 0 ? void 0 : payload.location,
            timestamp: new Date(),
        });
        yield isParcelExist.save();
    }
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedParcel;
});
const deleteParcelByAdmin = (decodedToken, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not an Admin");
    }
    const isParcelExist = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel not found!");
    }
    const deletedData = yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
    return deletedData;
});
const updateParcelStatusByAdmin = (decodedToken, parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not an Admin");
    }
    const isParcelExist = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel not found!");
    }
    isParcelExist.status = payload.status;
    isParcelExist.statusLog.push({
        status: payload.status,
        updatedBy: decodedToken.userId,
        note: payload.note,
        location: payload.location,
        timestamp: new Date(),
    });
    return yield isParcelExist.save();
});
const getParcelByTrackingId = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const isParcelExist = yield parcel_model_1.Parcel.findOne({
        trackingId: trackingId,
    }).populate("statusLog.updatedBy", "name email role");
    if (!isParcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel not found!");
    }
    return isParcelExist;
});
const getSingleParcelByAdmin = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.findById(parcelId).populate("statusLog.updatedBy", "name email role");
});
const getSingleParcelStatusLogByAdmin = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.findById(parcelId)
        .select("statusLog")
        .populate("statusLog.updatedBy", "name email role");
});
exports.ParcelService = {
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
