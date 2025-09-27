/* eslint-disable @typescript-eslint/no-unused-vars */
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

const cancelParcelBySender = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user as JwtPayload;

    const result = await ParcelService.cancelParcelBySender(
      decodedToken,
      parcelId
    );

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

    const query = req.query;

    const result = await ParcelService.getAllParcelsBySender(
      decodedToken,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your sending parcel requests",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getIncommingParcelsByReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query;
    const result = await ParcelService.getIncommingParcelsByReceiver(
      decodedToken,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your incomming parcel retrieved",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getDeliveryHistoryByReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query;

    const result = await ParcelService.getDeliveryHistoryByReceiver(
      decodedToken,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your parcel history retrieved",
      data: result.data,
      meta: result.meta,
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
    const query = req.query;
    const result = await ParcelService.getAllParcelsByAdmin(
      decodedToken,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All parcels retrieved successfully",
      data: result.data,
      meta: result.meta,
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

const deleteParcelByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const parcelId = req.params.parcelId;

    const result = await ParcelService.deleteParcelByAdmin(
      decodedToken,
      parcelId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel deleted successfully!",
      data: result,
    });
  }
);

const updateParcelStatusByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const parcelId = req.params.parcelId;

    const result = await ParcelService.updateParcelStatusByAdmin(
      decodedToken,
      parcelId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel Status updated Successfully!",
      data: result,
    });
  }
);

const getParcelByTrackingId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trackingId = req.params.trackingId;

    const result = await ParcelService.getParcelByTrackingId(trackingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel Retrived Successfully with Status Log!",
      data: result,
    });
  }
);

const getSingleParcelByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ParcelService.getSingleParcelByAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel Retrived Successfully with Status Log!",
      data: result,
    });
  }
);

const getSingleParcelStatusLogByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ParcelService.getSingleParcelStatusLogByAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel Status Log retrived Successfully!",
      data: result,
    });
  }
);

export const ParcelController = {
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
