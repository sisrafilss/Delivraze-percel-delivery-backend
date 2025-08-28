import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";
import {
  confirmDeliveryByReceiverZodSchema,
  parcelRequestZodSchema,
  updateParcelByAdminZodSchema,
  updateParcelStatusSchema,
} from "./parcel.validate";

const router = Router();

// Public Route - get a parcel detail by tracking id
router.get("/public/:trackingId", ParcelController.getParcelByTrackingId);

// place a parcel send request by sender
router.post(
  "/",
  validateRequest(parcelRequestZodSchema),
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelController.createParcelSend
);

// GET all parcels by sender
router.get(
  "/",
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelController.getAllParcelsBySender
);

// cancel by sender (and admin)
router.patch(
  "/cancel/:id",
  checkAuth(Role.ADMIN, Role.SENDER),
  ParcelController.cancelParcelBySender
);

// only receiver can see this route
router.get(
  "/receiver/incomming",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncommingParcelsByReceiver
);

// only receiver can see this route
router.get(
  "/receiver/history",
  checkAuth(Role.RECEIVER),
  ParcelController.getDeliveryHistoryByReceiver
);

// only receiver can see this route
router.patch(
  "/receiver/update-status",
  validateRequest(confirmDeliveryByReceiverZodSchema),
  checkAuth(Role.RECEIVER),
  ParcelController.confirmDeliveryByReceiver
);

// get all parcels by admin
router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.getAllParcelsByAdmin
);

// update a specific parcel by admin
router.patch(
  "/update/:parcelId",
  validateRequest(updateParcelByAdminZodSchema),
  checkAuth(Role.ADMIN),
  ParcelController.updateParcleByAdmin
);

// delete a parcel by admin
router.delete(
  "/delete/:parcelId",
  checkAuth(Role.ADMIN),
  ParcelController.deleteParcelByAdmin
);

// update status log by admin
router.patch(
  "/status/:parcelId",
  validateRequest(updateParcelStatusSchema),
  checkAuth(Role.ADMIN),
  ParcelController.updateParcelStatusByAdmin
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN),
  ParcelController.getSingleParcelByAdmin
);
router.get(
  "/:id/status-log",
  checkAuth(Role.ADMIN),
  ParcelController.getSingleParcelStatusLogByAdmin
);

export const ParcelRoutes = router;
