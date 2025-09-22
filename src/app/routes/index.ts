import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { ParcelRoutes } from "../modules/parcels/parcel.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/parcel",
    route: ParcelRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
