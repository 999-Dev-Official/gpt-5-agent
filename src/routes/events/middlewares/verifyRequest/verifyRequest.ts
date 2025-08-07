import { Request, Response, NextFunction } from "express";

export const verifyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
