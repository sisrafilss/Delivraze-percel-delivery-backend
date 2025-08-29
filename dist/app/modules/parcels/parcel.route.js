"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const parcel_validate_1 = require("./parcel.validate");
const router = (0, express_1.Router)();
// Public Route - get a parcel detail by tracking id
router.get("/public/:trackingId", parcel_controller_1.ParcelController.getParcelByTrackingId);
// place a parcel send request by sender
router.post("/", (0, validateRequest_1.validateRequest)(parcel_validate_1.parcelRequestZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.createParcelSend);
// GET all parcels by sender
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.getAllParcelsBySender);
// cancel by sender (and admin)
router.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SENDER), parcel_controller_1.ParcelController.cancelParcelBySender);
// only receiver can see this route
router.get("/receiver/incomming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.getIncommingParcelsByReceiver);
// only receiver can see this route
router.get("/receiver/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.getDeliveryHistoryByReceiver);
// only receiver can see this route
router.patch("/receiver/update-status", (0, validateRequest_1.validateRequest)(parcel_validate_1.confirmDeliveryByReceiverZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.confirmDeliveryByReceiver);
// get all parcels by admin
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), parcel_controller_1.ParcelController.getAllParcelsByAdmin);
// update a specific parcel by admin
router.patch("/update/:parcelId", (0, validateRequest_1.validateRequest)(parcel_validate_1.updateParcelByAdminZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.updateParcleByAdmin);
// delete a parcel by admin
router.delete("/delete/:parcelId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.deleteParcelByAdmin);
// update status log by admin
router.patch("/status/:parcelId", (0, validateRequest_1.validateRequest)(parcel_validate_1.updateParcelStatusSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.updateParcelStatusByAdmin);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.getSingleParcelByAdmin);
router.get("/:id/status-log", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.getSingleParcelStatusLogByAdmin);
exports.ParcelRoutes = router;
