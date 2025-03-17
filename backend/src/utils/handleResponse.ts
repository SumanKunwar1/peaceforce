import { Request, Response, NextFunction } from "express";

function handleResponse(req: Request, res: Response, next: NextFunction): void {
  // console.log(`✌ ${req.originalUrl} ✌`);

  const results = res.locals.responseData;

  if (results === undefined) {
    res.status(404).json({ error: "Data not found" });
    return;
  }

  if (results.error) {
    res
      .status(results.error.statusCode || 400)
      .json({ error: results.error.message });
    return;
  }

  res.status(200).json(results);
}

export { handleResponse };
