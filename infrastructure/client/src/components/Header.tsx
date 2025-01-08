import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback } from "react";
import { sidebarOpenedSignal } from "../signals/sidebarOpenedSignal";

export const Header = () => {
  const toggleSidebar = useCallback(() => {
    sidebarOpenedSignal.next(function (sidebarOpened) {
      return !sidebarOpened;
    });
  }, []);

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4" flex="1">
          Tasks
        </Typography>
        <IconButton onClick={toggleSidebar}>
          <MoreVertIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}