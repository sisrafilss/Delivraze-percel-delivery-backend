import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";
import { parcelRequestZodSchema } from "./parcel.validate";

const router = Router();

router.post(
  "/send",
  validateRequest(parcelRequestZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER),
  ParcelController.parcelRequest
);

export const ParcelRoutes = router;
