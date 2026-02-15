import crypto from "crypto";
import { readFileSync } from "fs";
import getMachineId from "./src/getMachineId.js";

const publicKey = readFileSync(
  new URL("./public.pem", import.meta.url),
  "utf8",
);

export default async function verifyLicense(payload, signature) {
  const verify = crypto.createVerify("SHA256");
  verify.update(JSON.stringify(payload));
  verify.end();
  const isValid = verify.verify(publicKey, signature, "base64");
  console.log("isValid=>", isValid);
  console.log("payload=>", payload);
  if (!isValid) return false;

  const machineId = await getMachineId();
  if (payload.type === "trial") {
    const isExpired = new Date() > payload.expiresAt;
    if (isExpired) return false;
  } else if (payload.type === "pro") {
    if (payload.usedDevices[0].machineId !== machineId) return false;
  }
  return true;
}
