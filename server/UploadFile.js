import multer from "multer";
import path from "path";
import fs from "fs";

const UploadFile = function (case_id) {
  const uploadPath = path.join(process.cwd(), "cases_files", String(case_id));

  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });

  return multer({ storage });
};

export default UploadFile;
