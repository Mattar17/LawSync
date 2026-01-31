// models/License.js
import mongoose from "mongoose";

const LicenseSchema = new mongoose.Schema({
  key: { type: String, unique: true },

  plan: {
    type: String,
    enum: ["trial", "basic", "pro"],
    default: "pro",
  },

  maxDevices: { type: Number, default: 1 },

  usedDevices: [
    {
      machineId: String,
      activatedAt: Date,
      lastSeenAt: Date,
    },
  ],

  expiresAt: Date,

  isRevoked: { type: Boolean, default: false },
});

export default mongoose.model("License", LicenseSchema);
