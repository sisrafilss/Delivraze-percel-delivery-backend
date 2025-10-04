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
exports.ParcelController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
const createParcelSend = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield parcel_service_1.ParcelService.createParcelSend(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel send request successfull",
        data: result,
    });
}));
const cancelParcelBySender = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const result = yield parcel_service_1.ParcelService.cancelParcelBySender(decodedToken, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel sending calcelled successfull",
        data: result,
    });
}));
const getAllParcelsBySender = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getAllParcelsBySender(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All of your sending parcel requests",
        data: result.data,
        meta: result.meta,
    });
}));
const getIncommingParcelsByReceiver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getIncommingParcelsByReceiver(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All of your incomming parcel retrieved",
        data: result.data,
        meta: result.meta,
    });
}));
const getDeliveryHistoryByReceiver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getDeliveryHistoryByReceiver(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All of your parcel history retrieved",
        data: result.data,
        meta: result.meta,
    });
}));
const confirmDeliveryByReceiver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield parcel_service_1.ParcelService.confirmDeliveryByReceiver(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status changed successfully to Delivered!",
        data: result,
    });
}));
const getAllParcelsByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getAllParcelsByAdmin(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateParcleByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const parcelId = req.params.parcelId;
    const result = yield parcel_service_1.ParcelService.updateParcleByAdmin(decodedToken, parcelId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel updated successfully!",
        data: result,
    });
}));
const deleteParcelByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const parcelId = req.params.parcelId;
    const result = yield parcel_service_1.ParcelService.deleteParcelByAdmin(decodedToken, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel deleted successfully!",
        data: result,
    });
}));
const updateParcelStatusByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const parcelId = req.params.parcelId;
    const result = yield parcel_service_1.ParcelService.updateParcelStatusByAdmin(decodedToken, parcelId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Status updated Successfully!",
        data: result,
    });
}));
const getParcelByTrackingId = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = req.params.trackingId;
    const result = yield parcel_service_1.ParcelService.getParcelByTrackingId(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Retrived Successfully with Status Log!",
        data: result,
    });
}));
const getSingleParcelByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield parcel_service_1.ParcelService.getSingleParcelByAdmin(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Retrived Successfully with Status Log!",
        data: result,
    });
}));
const getSingleParcelStatusLogByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield parcel_service_1.ParcelService.getSingleParcelStatusLogByAdmin(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Status Log retrived Successfully!",
        data: result,
    });
}));
exports.ParcelController = {
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
