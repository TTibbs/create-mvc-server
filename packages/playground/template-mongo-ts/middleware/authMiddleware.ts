import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import mongoose from "mongoose";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: mongoose.Types.ObjectId };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as JwtPayload;

      req.user = (await User.findById(decoded.id).select(
        "-password"
      )) as IUser & { _id: mongoose.Types.ObjectId };

      next();
    } catch (error) {
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token"));
  }
};

export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    next(new Error("Not authorized as admin"));
  }
};
