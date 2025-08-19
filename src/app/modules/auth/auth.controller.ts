import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) return next(new AppError(401, err));
      if (!user) return next(new AppError(401, info.message));

      const userTokens = await createUserTokens(user);
      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

export const AuthController = {
  credentialsLogin,
};
