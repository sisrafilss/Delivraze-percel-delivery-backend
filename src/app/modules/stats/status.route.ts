import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get(
  "/sender",
  checkAuth(Role.SENDER),
  StatsController.getParcelStatsBySender
);
router.get(
  "/receiver",
  checkAuth(Role.RECEIVER),
  StatsController.getParcelStatsByReceiver
);
router.get(
  "/admin",
  checkAuth(Role.ADMIN),
  StatsController.getParcelStatsByAdmin
);

export const StatsRoutes = router;
