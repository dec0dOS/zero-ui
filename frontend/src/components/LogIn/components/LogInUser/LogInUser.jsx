import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";

import axios from "axios";

import { useTranslation } from "react-i18next";

function LogInUser() {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [, setToken] = useLocalStorage("token", null);

  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSnackbarOpen(false);
  };

  const handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === "Enter") {
      LogIn();
    }
  };

  const LogIn = () => {
    if (!username || !password) {
      return;
    }

    axios
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then(function (response) {
        setLoggedIn(true);
        setToken(response.data.token);
        handleClose();
        history.go(0);
      })
      .catch(function (error) {
        setPassword("");
        setSnackbarOpen(true);
        setError(error.response.data.error);
        // console.error(error.response.data.error);
      });
  };

  const { t, i18n } = useTranslation();

  return (
    <>
      <Button onClick={handleClickOpen} color="primary" variant="contained">
        {t("logIn")}
      </Button>
      <Dialog open={open} onClose={handleClose} onKeyPress={handleKeyPress}>
        <DialogTitle>{t("logIn")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            margin="dense"
            label={t("username")}
            type="username"
            fullWidth
          />
          <TextField
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            margin="dense"
            label={t("password")}
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={LogIn} color="primary">
            {t("logIn")}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={t(error)}
      />
    </>
  );
}

export default LogInUser;
