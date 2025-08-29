"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelType = exports.PaymentMethod = exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["PENDING"] = "PENDING";
    ParcelStatus["ACCEPTED"] = "ACCEPTED";
    ParcelStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ParcelStatus["DELIVERED"] = "DELIVERED";
    ParcelStatus["CANCELLED"] = "CANCELLED";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH_ON_DELIVERY"] = "CASH_ON_DELIVERY";
    PaymentMethod["ONLINE"] = "ONLINE";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var ParcelType;
(function (ParcelType) {
    ParcelType["DOCUMENTS"] = "Documents";
    ParcelType["CLOTHES"] = "Cloths";
    ParcelType["BOOKS"] = "Books";
    ParcelType["COSMETICS"] = "Cosmetics";
    ParcelType["TOYS"] = "Toys";
    ParcelType["ELECTRONICS"] = "Electronics";
})(ParcelType || (exports.ParcelType = ParcelType = {}));
