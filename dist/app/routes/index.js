"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const otp_route_1 = require("../modules/otp/otp.route");
const parcel_route_1 = require("../modules/parcels/parcel.route");
const status_route_1 = require("../modules/stats/status.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
    {
        path: "/parcel",
        route: parcel_route_1.ParcelRoutes,
    },
    {
        path: "/stats",
        route: status_route_1.StatsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
