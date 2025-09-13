import { RequestHandler } from "express";

export const postIngest: RequestHandler = (req, res) => {
  // Mock response - assume a PDF was uploaded and queued for processing
  res.json({
    status: "queued",
    message: "File received. Processing will update claims shortly.",
    // echo minimal metadata if available, without parsing multipart
    size: req.headers["content-length"],
    contentType: req.headers["content-type"],
  });
};
