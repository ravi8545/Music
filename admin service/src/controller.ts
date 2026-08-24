import type { Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";


interface AuthencatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthencatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { title, description } = req.body;

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate file buffer",
    });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
   INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
  `;


  res.json({
    message: "Album Created",
    album: result[0],
  });
});

