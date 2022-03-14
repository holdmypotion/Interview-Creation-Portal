import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/interviews", async (req: Request, res: Response) => {
  res.send("<h2> List Interviews <h2/>");
});

export { router as createRouter };
