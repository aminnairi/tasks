import { useCallback } from "react";
import { NotificationOpened, notificationSignal } from "../signals/notificationSignal";

export const useNotification = () => {
  const openNotification = useCallback((options: Omit<NotificationOpened, "status">) => {
    notificationSignal.emit({
      ...options,
      status: "OPENED",
    });
  }, []);

  return {
    openNotification
  }
};