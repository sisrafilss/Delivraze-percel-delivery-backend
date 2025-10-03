import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getParcelStatsBySender = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await StatsService.getParcelStatsBySender(
    user.userId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel Stats Retrieved Successfully",
    data: result,
  });
};

const getParcelStatsByReceiver = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await StatsService.getParcelStatsByReceiver(
    user.email as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel Stats Retrieved Successfully",
    data: result,
  });
};
const getParcelStatsByAdmin = async (req: Request, res: Response) => {
  const result = await StatsService.getParcelStatsByAdmin();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel Stats Retrieved Successfully",
    data: result,
  });
};

export const StatsController = {
  getParcelStatsBySender,
  getParcelStatsByReceiver,
  getParcelStatsByAdmin,
};
