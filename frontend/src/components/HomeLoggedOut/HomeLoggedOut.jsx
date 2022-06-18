import { useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useLocalStorage } from "react-use";
import { useHistory } from "react-router-dom";

import axios from "axios";

function HomeLoggedOut() {
  const [, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [, setToken] = useLocalStorage("token", null);
  const [, setDisableAuth] = useLocalStorage("disableAuth", false);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      axios
        .get("/auth/login", { withCredentials: true })
        .then(function (response) {
          if (!response.data.enabled) {
            setLoggedIn(true);
            setDisableAuth(true);
            setToken("");
            history.go(0);
          } else {
            setDisableAuth(false);
          }
        });
    }
    fetchData();
  }, [history, setDisableAuth, setLoggedIn, setToken]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{
        minHeight: "50vh",
      }}
    >
      <Grid item xs={10}>
        <Typography variant="h5">
          <span>
            ZeroUI - ZeroTier Controller Web UI - is a web user interface for a
            self-hosted ZeroTier network controller.
          </span>
        </Typography>

        <Typography>
          <span>Please Log In to continue</span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default HomeLoggedOut;
