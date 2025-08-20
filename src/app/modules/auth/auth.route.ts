import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
// router.post("/set-password", checkAutvalOh(...Object.values(Role)), AuthControllers.setPassword)
// router.post("/forgot-password", AuthControllers.forgotPassword)
// router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

// // Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password

// //  /booking -> /login -> succesful google login -> /booking frontend
// // /login -> succesful google login -> / frontend
// router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
//     const redirect = req.query.redirect || "/"
//     passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
// })

// // api/v1/auth/google/callback?state=/booking
// router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthControllers.googleCallbackController)

export const AuthRoutes = router;
