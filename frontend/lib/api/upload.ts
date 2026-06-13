import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AppError } from "@/utils/api/error";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Validates an uploaded file (size, MIME type, extension) and saves it to public/uploads.
 * Returns the web-accessible relative path starting with /uploads/.
 */
export async function validateAndSaveImage(file: File): Promise<string> {
  if (!file || file.size === 0) {
    throw new AppError("No file uploaded", 400, "BAD_REQUEST");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError("File size exceeds the 2MB limit", 400, "BAD_REQUEST");
  }

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new AppError(
      "Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG are allowed.",
      400,
      "BAD_REQUEST",
    );
  }

  // Extract extension and generate a safe, unique name
  const originalExtension = path.extname(file.name).toLowerCase();
  // Double-check extension format (e.g., only letters and numbers)
  if (originalExtension && !/^\.[a-z0-9]+$/.test(originalExtension)) {
    throw new AppError("Invalid file extension", 400, "BAD_REQUEST");
  }

  const uniqueFilename = `${crypto.randomUUID()}${originalExtension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Resolve target path and verify it is inside public/uploads to prevent path traversal
  const filePath = path.join(uploadDir, uniqueFilename);
  const resolvedPath = path.resolve(filePath);
  const resolvedUploadDir = path.resolve(uploadDir);

  if (!resolvedPath.startsWith(resolvedUploadDir)) {
    throw new AppError(
      "Invalid upload path traversal detected",
      400,
      "BAD_REQUEST",
    );
  }

  // Convert File to Buffer and write to disk
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(resolvedPath, buffer);

  return `/uploads/${uniqueFilename}`;
}

/**
 * Deletes an image file from the public/uploads directory if it's a local file.
 */
export async function deleteImageFile(imagePath: string): Promise<void> {
  if (!imagePath || !imagePath.startsWith("/uploads/")) {
    return; // Ignore external URLs or placeholders
  }

  // Prevent path traversal by normalizing the path and making sure it resides strictly under public/uploads
  const normalizedPath = path
    .normalize(imagePath)
    .replace(/^(\.\.(\/|\\))+/, "");
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);
  const resolvedUploadsDir = path.resolve(
    path.join(process.cwd(), "public", "uploads"),
  );
  const resolvedFilePath = path.resolve(absolutePath);

  // Ensure it resides strictly within public/uploads
  if (!resolvedFilePath.startsWith(resolvedUploadsDir)) {
    console.warn(
      `File deletion rejected due to path mismatch: ${resolvedFilePath} vs ${resolvedUploadsDir}`,
    );
    return;
  }

  try {
    await fs.unlink(resolvedFilePath);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting file: ${resolvedFilePath}`, error);
    }
  }
}
