import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  res.json({
    message: "Hitting the user registration route.!",
  });
});

export const UserRoutes = router;
