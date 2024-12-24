const multer = require("multer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

// Upload dizininin doğru şekilde oluşturulması
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Yolu ve dizini oluştur
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Burada uploads dizin yolunu doğru şekilde tanımladık
  },
  filename(req, file, cb) {
    const date = moment().format("DDDMMYYYY-HHmmss_SSS");
    cb(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB dosya sınırı
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
