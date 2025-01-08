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
import { isAdministratorSignal } from "../signals/isAdministratorSignal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";

export const Sidebar = () => {
  const sidebarOpened = useSignal(sidebarOpenedSignal);
  const isAdministrator = useSignal(isAdministratorSignal);
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

  const logout = useCallback(() => {
    authenticationTokenSignal.emit("");
    isAdministratorSignal.emit(false);
    closeSidebar();
    navigate("/login");
  }, [closeSidebar, navigate]);

  return (
    <Drawer open={sidebarOpened} onClose={closeSidebar}>
      <List sx={{ width: "300px" }}>
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
        {isAdministrator && (
          <>
            <Divider>
              <Typography sx={{ color: "grey" }}>
                Administration
              </Typography>
            </Divider>
            <ListItem disablePadding disableGutters onClick={navigateTo("/administration/users")}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {authenticated && (
          <>
            <Divider>
              <Typography sx={{ color: "grey" }}>
                Authentication
              </Typography>
            </Divider>
            <ListItem disablePadding disableGutters onClick={logout}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};