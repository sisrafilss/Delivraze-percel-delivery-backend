import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthController } from "./auth.controller";
import {
  changePasswordZodSchema,
  credentialLoginZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(credentialLoginZodSchema),
  AuthController.credentialsLogin
);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post(
  "/change-password",
  validateRequest(changePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
// router.post("/set-password", checkAutvalOh(...Object.values(Role)), AuthControllers.setPassword)
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordZodSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

// api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
  }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
