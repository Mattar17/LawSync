import mongoose from "mongoose";
export default async function ResetPassword(req, res) {
  try {
    const { confirmPassword } = req.body;

    // 1. Validate request body
    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "confirmPassword is required",
      });
    }
    const response = await fetch(
      "https://law-sync-activation-api.vercel.app/reset-app-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: confirmPassword }),
      },
    );
    const data = await response.json();
    // 2. Validate against env secret
    if (!data.success) {
      return res.status(403).json({
        success: false,
        message: "Invalid confirmation password",
      });
    }

    const db = mongoose.connection.db;

    const collectionName = "passwords";

    const exists = await db.listCollections({ name: collectionName }).hasNext();

    if (exists) {
      await db.dropCollection(collectionName);
    }

    return res.status(200).json({
      success: true,
      message: "Password collection has been reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
