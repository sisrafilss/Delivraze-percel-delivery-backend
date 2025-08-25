import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";
import {
  confirmDeliveryByReceiverZodSchema,
  parcelRequestZodSchema,
} from "./parcel.validate";

const router = Router();

router.post(
  "/send",
  validateRequest(parcelRequestZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER),
  ParcelController.createParcelSend
);
router.patch(
  "/cancel/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER),
  ParcelController.cancellParcel
);
router.get("/", checkAuth(Role.SENDER), ParcelController.getAllParcelsBySender);

router.get(
  "/incomming",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncommingParcelsByReceiver
);

router.get(
  "/receiver/history",
  checkAuth(Role.RECEIVER),
  ParcelController.getDeliveryHistoryByReceiver
);

router.patch(
  "/receiver/update-status",
  validateRequest(confirmDeliveryByReceiverZodSchema),
  checkAuth(Role.RECEIVER),
  ParcelController.confirmDeliveryByReceiver
);

router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.getAllParcelsByAdmin
);

export const ParcelRoutes = router;
