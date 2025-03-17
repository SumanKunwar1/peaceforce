import { Response } from "express";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { uploadPath } from "../utils/filePath";

export function serveFile(
  filename: string,
  res: Response<any, Record<string, any>>
) {
  const filePath = path.join(uploadPath, filename);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: "File not found" });
    }

    const mimeType = mime.lookup(filename);

    if (!mimeType) {
      return res.status(415).json({ error: "Unsupported file type" });
    }

    res.setHeader("Content-Type", mimeType);

    res.sendFile(filePath);
  });
}
