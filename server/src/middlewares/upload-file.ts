import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    // cb(null, path.join(__dirname, "../uploads"));
    cb(null, __dirname);
    // cb(null, "public/files");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    let ext = path.extname(file.originalname);
    cb(null, new Date().toISOString().replace(/:/g, "-") + ext);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    cb(null, true);
  },
});

// const storage = multer.diskStorage({});

// export const upload = multer({
//   storage,
// });
