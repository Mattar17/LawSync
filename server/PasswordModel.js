import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  mainPassword: { type: String, required: true },
  backupPassword: { type: String, required: true },
});

const PasswordDoc =
  mongoose.models.Password || mongoose.model("Password", passwordSchema);

export default PasswordDoc;
