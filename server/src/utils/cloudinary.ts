import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";

export const cloudinaryConfig = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  next();
};

export const uploader = cloudinary.v2.uploader;
