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
exports.StatsService = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
const parcel_model_1 = require("../parcels/parcel.model");
// import { startOfMonth, endOfMonth, subDays } from "date-fns";
const getParcelStatsBySender = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = new mongoose_1.default.Types.ObjectId(userId);
    const totalParcelPromise = parcel_model_1.Parcel.countDocuments({ senderId: senderId });
    const totalParcelsByStatusPromise = parcel_model_1.Parcel.aggregate([
        {
            $match: {
                senderId: senderId,
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalParcels, totalParcelsByStatus] = yield Promise.all([
        totalParcelPromise,
        totalParcelsByStatusPromise,
    ]);
    return {
        totalParcels,
        totalParcelsByStatus,
    };
});
const getParcelStatsByReceiver = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const totalParcelPromise = parcel_model_1.Parcel.countDocuments({
        receiverEmail: userEmail,
    });
    const totalParcelsByStatusPromise = parcel_model_1.Parcel.aggregate([
        {
            $match: {
                receiverEmail: userEmail,
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalParcels, totalParcelsByStatus] = yield Promise.all([
        totalParcelPromise,
        totalParcelsByStatusPromise,
    ]);
    return {
        totalParcels,
        totalParcelsByStatus,
    };
});
const getParcelStatsByAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Original logic
    const totalParcelPromise = parcel_model_1.Parcel.countDocuments();
    const totalParcelsByStatusPromise = parcel_model_1.Parcel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    // ✅ Added: Monthly shipments (group by year & month)
    const monthlyShipmentsPromise = parcel_model_1.Parcel.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                year: "$_id.year",
                month: "$_id.month",
                count: 1,
                _id: 0,
            },
        },
        { $sort: { year: 1, month: 1 } },
    ]);
    // ✅ Added: Parcel trends (last 30 days)
    const last30Days = (0, date_fns_1.subDays)(new Date(), 30);
    const parcelTrendsPromise = parcel_model_1.Parcel.aggregate([
        {
            $match: {
                createdAt: { $gte: last30Days },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                date: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: "$_id.day",
                    },
                },
                count: 1,
                _id: 0,
            },
        },
        { $sort: { date: 1 } },
    ]);
    // ✅ Added: Total parcels in the last 7 days
    const sevenDaysAgo = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(new Date(), 7));
    const totalLast7DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    // ✅ Added: Daily counts for last 7 days (group by day)
    const last7DaysTrendsPromise = parcel_model_1.Parcel.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                date: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: "$_id.day",
                    },
                },
                count: 1,
                _id: 0,
            },
        },
        { $sort: { date: 1 } },
    ]);
    const [totalParcels, totalParcelsByStatus, monthlyShipments, parcelTrends, totalLast7Days, last7DaysTrends,] = yield Promise.all([
        totalParcelPromise,
        totalParcelsByStatusPromise,
        monthlyShipmentsPromise,
        parcelTrendsPromise,
        totalLast7DaysPromise,
        last7DaysTrendsPromise,
    ]);
    return {
        totalParcels,
        totalParcelsByStatus,
        monthlyShipments,
        parcelTrends,
        totalLast7Days, // ✅ added for summary cards
        last7DaysTrends, // ✅ added for bar/pie chart data
    };
});
exports.StatsService = {
    getParcelStatsBySender,
    getParcelStatsByReceiver,
    getParcelStatsByAdmin,
};
