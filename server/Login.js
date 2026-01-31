import bcrypt from "bcryptjs";
import PasswordDoc from "./PasswordModel.js";

export const CheckPassword = async function (req, res) {
  const { password } = req.body;
  const passwords = await PasswordDoc.findOne({});
  if (!passwords)
    return res.status(404).json({ status: "passwords wasn't found" });
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
  if (!passwords) return res.status(404).json("يجب اضافة كلمة المرور أولاً");
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

export async function setPasswords(req, res) {
  try {
    const { mainPassword, backupPassword } = req.body;

    if (!mainPassword || !backupPassword)
      return res.status(403).json({ status: "error", message: "الحقل مطلوب" });

    const mainPasswordHash = await bcrypt.hash(mainPassword, 12);
    const backupPasswordHash = await bcrypt.hash(backupPassword, 12);

    const passwords = new PasswordDoc({
      mainPassword: mainPasswordHash,
      backupPassword: backupPasswordHash,
    });

    await passwords.save();

    return res
      .status(200)
      .json({ status: "success", message: "تم إضافة كلمة المرور" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "خطأ في الخادم" });
  }
}
