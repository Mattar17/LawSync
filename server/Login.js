import bcrypt from "bcryptjs";
import PasswordDoc from "./PasswordModel.js";
export const CheckPassword = async function (req, res) {
  const { password } = req.body;
  const passwords = await PasswordDoc.findOne({});
  const isCorrect = await bcrypt.compare(password, passwords.mainPassword);

  if (isCorrect) {
    return res.status(200).json({ status: "success" });
  }

  return res.status(403).json({ status: "error" });
};

export const ChangePassword = async function (req, res) {
  const { secondPassword } = req.body;
  const { newPassword } = req.body;
  const passwords = await PasswordDoc.findOne({});
  const isCorrect = await bcrypt.compare(
    secondPassword,
    passwords.backupPassword,
  );

  if (!isCorrect) return res.status(403).json({ status: "error" });
  else {
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await PasswordDoc.updateOne({
      $set: {
        mainPassword: newPasswordHash,
      },
    });
    return res.status(200).json({ status: "success" });
  }
};
