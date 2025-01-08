import { Signal } from "@aminnairi/react-signal";
import { AlertColor } from "@mui/material";

export interface NotificationOpened {
  status: "OPENED",
  severity: AlertColor,
  duration: number,
  message: string,
}

export interface NotificationClosed {
  status: "CLOSED"
}

export type Notification =
  | NotificationOpened
  | NotificationClosed

export const notificationSignal = new Signal<Notification>({
  status: "OPENED",
  severity: "success",
  duration: 0,
  message: ""
});