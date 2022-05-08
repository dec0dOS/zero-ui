import logo from "./assets/logo.png";

import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import LogIn from "components/LogIn";

function Bar() {
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [anchorEl, setAnchorEl] = useState(null);

  const history = useHistory();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const onLogOutClick = () => {
    setLoggedIn(false);
    localStorage.clear();
    history.push("/");
    history.go(0);
  };

  const onClickGoToManagment = () => {
    history.push("/user-managment");
  };

  const menuItems = [
    {
      name: "User Managment",
      to: "/user-managment",
      onclick: onClickGoToManagment,
    },
    {
      name: "Log out",
      divide: true,
      onClick: onLogOutClick,
    },
  ];

  return (
    <AppBar
      color="secondary"
      style={{ background: "#000000" }}
      position="static"
    >
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <Typography color="inherit" variant="h6">
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
              underline="none"
            >
              <img src={logo} width="100" height="100" alt="logo" />
            </Link>
          </Typography>
        </Box>

        {loggedIn && (
          <>
            <Button color="inherit" onClick={openMenu}>
              <MenuIcon></MenuIcon>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              {menuItems.map((menuItem, index) => {
                if (
                  menuItem.hasOwnProperty("condition") &&
                  !menuItem.condition
                ) {
                  return null;
                }

                let component = null;

                if (menuItem.to) {
                  component = (
                    <MenuItem
                      key={index}
                      component={RouterLink}
                      to={menuItem.to}
                      onClick={closeMenu}
                    >
                      {menuItem.name}
                    </MenuItem>
                  );
                } else {
                  component = (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        closeMenu();

                        menuItem.onClick();
                      }}
                    >
                      {menuItem.name}
                    </MenuItem>
                  );
                }

                if (menuItem.divide) {
                  return (
                    <span key={index}>
                      <Divider />

                      {component}
                    </span>
                  );
                }

                return component;
              })}
            </Menu>
          </>
        )}
        {!loggedIn && LogIn()}
      </Toolbar>
    </AppBar>
  );
}

export default Bar;
