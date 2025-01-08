import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSignal } from "@aminnairi/react-signal";
import { notificationSignal } from "../signals/notificationSignal";
import { useCallback, useMemo } from "react";

export const Notification = () => {
  const notification = useSignal(notificationSignal);

  const notificationOpened = useMemo(() => {
    return notification.status === "OPENED";
  }, [notification.status]);

  const closeNotification = useCallback(() => {
    return notificationSignal.emit({
      status: "CLOSED"
    });
  }, []);

  const notificationDuration = useMemo(() => {
    if (notification.status === "OPENED") {
      return notification.duration;
    }

    return 0;
  }, [notification]);

  const notificationMessage = useMemo(() => {
    if (notification.status === "OPENED") {
      return notification.message;
    }

    return "";
  }, [notification]);

  const notificationSeverity = useMemo(() => {
    if (notification.status === "OPENED") {
      return notification.severity;
    }

    return "success";
  }, [notification]);

  return (
    <Snackbar open={notificationOpened} onClose={closeNotification} autoHideDuration={notificationDuration}>
      <Alert severity={notificationSeverity}>
        {notificationMessage}
      </Alert>
    </Snackbar>
  );
}