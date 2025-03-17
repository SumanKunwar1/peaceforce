import { Router, Request, Response } from "express";
import { serveFile } from "@utils/serveFile";

const router = Router();

router.get("/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  serveFile(filename, res);
});

export default router;
