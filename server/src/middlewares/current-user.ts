import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// * To Augment the currentUser property to the req object.
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // * !req.session?.jwt ===== !req.session || !req.session.jwt
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // could also user `as UserPayload` instead
    const payload = <UserPayload>(
      jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    );
    req.currentUser = payload;
  } catch (err) {}
  next();
};
