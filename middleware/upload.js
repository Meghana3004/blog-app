const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || 'uploads');
const extensionsByMimeType = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

fs.mkdirSync(uploadDirectory, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${extensionsByMimeType.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!extensionsByMimeType.has(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
      error.code = 'INVALID_IMAGE_TYPE';
      return callback(error);
    }
    return callback(null, true);
  },
});
