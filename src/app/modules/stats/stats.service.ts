import { startOfDay, subDays } from "date-fns";
import mongoose from "mongoose";
import { Parcel } from "../parcels/parcel.model";

// import { startOfMonth, endOfMonth, subDays } from "date-fns";

const getParcelStatsBySender = async (userId: string) => {
  const senderId = new mongoose.Types.ObjectId(userId);

  const totalParcelPromise = Parcel.countDocuments({ senderId: senderId });

  const totalParcelsByStatusPromise = Parcel.aggregate([
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

  const [totalParcels, totalParcelsByStatus] = await Promise.all([
    totalParcelPromise,
    totalParcelsByStatusPromise,
  ]);

  return {
    totalParcels,
    totalParcelsByStatus,
  };
};
const getParcelStatsByReceiver = async (userEmail: string) => {
  const totalParcelPromise = Parcel.countDocuments({
    receiverEmail: userEmail,
  });

  const totalParcelsByStatusPromise = Parcel.aggregate([
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

  const [totalParcels, totalParcelsByStatus] = await Promise.all([
    totalParcelPromise,
    totalParcelsByStatusPromise,
  ]);

  return {
    totalParcels,
    totalParcelsByStatus,
  };
};

const getParcelStatsByAdmin = async () => {
  // ✅ Original logic
  const totalParcelPromise = Parcel.countDocuments();

  const totalParcelsByStatusPromise = Parcel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // ✅ Added: Monthly shipments (group by year & month)
  const monthlyShipmentsPromise = Parcel.aggregate([
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
  const last30Days = subDays(new Date(), 30);
  const parcelTrendsPromise = Parcel.aggregate([
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
  const sevenDaysAgo = startOfDay(subDays(new Date(), 7));
  const totalLast7DaysPromise = Parcel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  // ✅ Added: Daily counts for last 7 days (group by day)
  const last7DaysTrendsPromise = Parcel.aggregate([
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

  const [
    totalParcels,
    totalParcelsByStatus,
    monthlyShipments,
    parcelTrends,
    totalLast7Days,
    last7DaysTrends,
  ] = await Promise.all([
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
};

export const StatsService = {
  getParcelStatsBySender,
  getParcelStatsByReceiver,
  getParcelStatsByAdmin,
};
