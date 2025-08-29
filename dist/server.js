"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Server } from "http";
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
// let server: Server;
// const startServer = async () => {
//   try {
//     await mongoose.connect(envVars.DB_URL);
//     console.log("Connected to Database!!");
//     server = app.listen(envVars.PORT, () => {
//       console.log(`Server is listening on port: ${envVars.PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// (async () => {
//   await startServer();
//   await seedSuperAdmin();
// })();
let isConnected = false;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to DB only once per cold start
            if (!isConnected) {
                yield mongoose_1.default.connect(env_1.envVars.DB_URL);
                isConnected = true;
                console.log("Connected to Database!!");
                yield (0, seedSuperAdmin_1.seedSuperAdmin)();
            }
            // Let Express handle the request
            return (0, app_1.default)(req, res);
        }
        catch (err) {
            console.error("Vercel function error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
// // unhandled rejection error handle
// process.on("unhandledRejection", (err) => {
//   console.log("Unhandled Rejection Detected ... Server shutting down ...", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// // uncaught rejection error handle
// process.on("uncaughtException", (err) => {
//   console.log("Uncaught Exception Detected ... Server shutting down ...", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// // creating uncaught rejection error for testing
// // throw new Error("I forgot to handle this error!");
// // signal termination sigterm
// process.on("SIGTERM", () => {
//   console.log("SIGTERM Signal received... Server sutting down ...");
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// // this will execute when we close the server using Ctrl+C.
// process.on("SIGINT", () => {
//   console.log("SIGINT Signal received... Server sutting down ...");
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
