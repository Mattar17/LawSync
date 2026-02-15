export default async function getMachineId() {
  const pkg = await import("node-machine-id");
  let id = await pkg.default.machineId();
  return id;
}
