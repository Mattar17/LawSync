import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import "dotenv/config";
import bcrypt from "bcryptjs";

import {
  CreateCase,
  addCaseFiles,
  deleteCase,
  getAllCases,
  getCase,
  getCaseById,
  updateCase,
  deleteFile,
  getCaseFiles,
} from "./CaseController.js";
import { CheckPassword, ChangePassword } from "./Login.js";
import PasswordDoc from "./PasswordModel.js";
import multer from "multer";
const upload = multer();
const LOCAL_CONNECTION_STRING = "mongodb://127.0.0.1:27017/lawsync";
const PORT = 5000;

mongoose
  .connect(LOCAL_CONNECTION_STRING)
  .then(console.log("mongoose is on ON LOCAL_DB!!"));

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

async function seedPassword() {
  try {
    const backup_passowrd = process.env.BACKUP_PASSWORD;
    const main = "000000";

    let existing = await PasswordDoc.findOne();
    if (existing) return;

    const SALT_ROUNDS = 12;
    const mainHash = await bcrypt.hash(main, SALT_ROUNDS);
    const backupHash = await bcrypt.hash(backup_passowrd, SALT_ROUNDS);

    const passwordDocument = new PasswordDoc({
      mainPassword: mainHash,
      backupPassword: backupHash,
    });
    await passwordDocument.save();
    console.log("Password document seeded successfully!");
  } catch (err) {
    console.error("Failed to seed password:", err);
    throw err;
  }
}

seedPassword();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(
  "/cases_files",
  express.static(path.join(process.cwd(), "cases_files")),
);

app.get("/", getAllCases);
app.get("/search", getCase);
app.get("/:id", getCaseById);
app.post("/", CreateCase);
app.delete("/delete-case/:id", deleteCase);
app.patch("/:id", updateCase);

app.post("/add-files", upload.array("files", 12), addCaseFiles);
app.get("/cases/:case_id/files", getCaseFiles);
app.delete("/delete-file/:case_id/:file_name", deleteFile);

app.post("/login", CheckPassword);
app.post("/change_password", ChangePassword);

app.listen(PORT, () => {
  console.log("server is running");
});
