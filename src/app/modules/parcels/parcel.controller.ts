import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelService } from "./parcel.service";

const createParcelSend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.createParcelSend(decodedToken, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel send request successfull",
      data: result,
    });
  }
);

const cancellParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.cancelParcel(decodedToken, parcelId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel sending calcelled successfull",
      data: result,
    });
  }
);
const getAllParcelsBySender = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.getAllParcelsBySender(decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All of your sending parcel requests",
      data: result,
    });
  }
);
const getIncommingParcelsByReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.getIncommingParcelsByReceiver(
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your incomming parcel retrieved",
      data: result,
    });
  }
);
const getDeliveryHistoryByReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.getDeliveryHistoryByReceiver(
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your parcel history retrieved",
      data: result,
    });
  }
);

const confirmDeliveryByReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.confirmDeliveryByReceiver(
      decodedToken,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel status changed successfully to Delivered!",
      data: result,
    });
  }
);

const getAllParcelsByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.getAllParcelsByAdmin(decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All parcels retrieved successfully",
      data: result,
    });
  }
);

const updateParcleByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const parcelId = req.params.parcelId;

    const result = await ParcelService.updateParcleByAdmin(
      decodedToken,
      parcelId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel updated successfully!",
      data: result,
    });
  }
);

export const ParcelController = {
  createParcelSend,
  cancellParcel,
  getAllParcelsBySender,
  getIncommingParcelsByReceiver,
  getDeliveryHistoryByReceiver,
  confirmDeliveryByReceiver,
  getAllParcelsByAdmin,
  updateParcleByAdmin,
};
