import { LocalStorageSignal } from "@aminnairi/react-signal";

export const isAdministratorSignal = new LocalStorageSignal({
  key: "administrator",
  validation: (value): value is boolean => typeof value === "boolean",
  value: false
});