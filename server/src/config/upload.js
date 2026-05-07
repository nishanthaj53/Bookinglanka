// server/src/config/upload.js
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import path from "path";
import { env } from "./env.js";

/** Per-file limit for hotel / room / amenity images */
export const MAX_IMAGE_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_MB = Math.round(MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024));

const s3 = new AWS.S3({
  accessKeyId: env.awsAccessKey,
  secretAccessKey: env.awsSecretKey,
  region: env.awsRegion,
});

/** SVG is excluded: can embed scripts when served/embedded as HTML-related image. */
const BLOCKED_IMAGE_MIMES = new Set(["image/svg+xml"]);

/**
 * Known raster image extensions when clients send wrong MIME
 * (e.g. HEIC as application/octet-stream, or empty type).
 */
const IMAGE_FILE_EXT = /\.(jpe?g|jfif|pjpeg|pjp|png|gif|webp|bmp|tiff?|ico|avif|heic|heif)$/i;

function isAllowedImage(file) {
  const mime = (file.mimetype || "").toLowerCase().trim();
  const original = file.originalname || "";
  const ext = path.extname(original).toLowerCase();
  const extLooksLikeImage = IMAGE_FILE_EXT.test(ext);

  if (mime.startsWith("image/") && !BLOCKED_IMAGE_MIMES.has(mime)) {
    return true;
  }
  if (extLooksLikeImage) {
    return true;
  }
  return false;
}

let storage;
if (env.storageType === "s3") {
  storage = multerS3({
    s3,
    bucket: env.awsS3Bucket,
    acl: "public-read",
    key: (req, file, cb) =>
      cb(null, `uploads/${Date.now()}_${file.originalname}`),
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}_${file.originalname}`),
  });
}

export const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (isAllowedImage(file)) {
      cb(null, true);
      return;
    }
    const err = new Error(
      `Only image files are allowed (max ${MAX_IMAGE_UPLOAD_MB}MB each). SVG is not supported for security.`
    );
    err.code = "INVALID_IMAGE_UPLOAD";
    cb(err);
  },
});
