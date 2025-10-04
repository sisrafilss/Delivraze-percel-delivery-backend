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
exports.StatsController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const stats_service_1 = require("./stats.service");
const getParcelStatsBySender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield stats_service_1.StatsService.getParcelStatsBySender(user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Stats Retrieved Successfully",
        data: result,
    });
});
const getParcelStatsByReceiver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield stats_service_1.StatsService.getParcelStatsByReceiver(user.email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Stats Retrieved Successfully",
        data: result,
    });
});
const getParcelStatsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield stats_service_1.StatsService.getParcelStatsByAdmin();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel Stats Retrieved Successfully",
        data: result,
    });
});
exports.StatsController = {
    getParcelStatsBySender,
    getParcelStatsByReceiver,
    getParcelStatsByAdmin,
};
