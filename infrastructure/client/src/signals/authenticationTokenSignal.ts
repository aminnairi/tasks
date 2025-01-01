import { LocalStorageSignal } from "@aminnairi/react-signal";

export const authenticationTokenSignal = new LocalStorageSignal({
  key: "authentication-token",
  validation: value => {
    return typeof value === "string";
  },
  value: ""
});