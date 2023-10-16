import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";

import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";

function LogInToken() {
  const [open, setOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [token, setToken] = useLocalStorage("token", null);

  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const { t, i18n } = useTranslation();

  const LogIn = () => {
    if (token.length !== 32) {
      setErrorText("Token length error");
      return;
    }
    setLoggedIn(true);
    setToken(token);
    handleClose();
    history.go(0);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} color="inherit" variant="outlined">
        {t("logInToken")}
      </Button>
      <Dialog open={open} onClose={handleClose} onKeyPress={handleKeyPress}>
        <DialogTitle>{t("logIn")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("advancedFeature")}</DialogContentText>
          <TextField
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
            error={!!errorText}
            helperText={errorText}
            margin="dense"
            label="token"
            type="text"
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
    </div>
  );
}

export default LogInToken;
