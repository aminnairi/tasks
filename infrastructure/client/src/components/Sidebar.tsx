import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useSignal } from "@aminnairi/react-signal";
import { sidebarOpenedSignal } from "../signals/sidebarOpenedSignal";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";

export const Sidebar = () => {
  const sidebarOpened = useSignal(sidebarOpenedSignal);
  const authenticationToken = useSignal(authenticationTokenSignal);
  const authenticated = useMemo(() => !!authenticationToken, [authenticationToken]);

  const navigate = useNavigate();

  const closeSidebar = useCallback(() => {
    sidebarOpenedSignal.emit(false);
  }, []);

  const navigateTo = useCallback((to: string) => () => {
    navigate(to);
    closeSidebar();
  }, [closeSidebar, navigate]);

  return (
    <Drawer open={sidebarOpened} onClose={closeSidebar}>
      <List>
        <ListItem disablePadding disableGutters onClick={navigateTo("/")}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding disableGutters onClick={navigateTo("/projects")}>
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding disableGutters onClick={navigateTo("/account")}>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
        </ListItem>
        {!authenticated && (
          <>
            <Divider>
              <Typography sx={{ color: "grey" }}>
                Authentication
              </Typography>
            </Divider>
            <ListItem disablePadding disableGutters onClick={navigateTo("/login")}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};