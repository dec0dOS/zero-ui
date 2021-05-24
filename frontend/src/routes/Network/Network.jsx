import { useState, useEffect } from "react";
import { Link as RouterLink, useParams, useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { Link, Grid, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useStyles from "./Network.styles";

import NetworkHeader from "components/NetworkHeader";
import NetworkSettings from "components/NetworkSettings";
import NetworkMembers from "components/NetworkMembers";
import NetworkRules from "components/NetworkRules";
import NetworkManagement from "components/NetworkManagement";

import API from "utils/API";

function Network() {
  const { nwid } = useParams();
  const [loggedIn] = useLocalStorage("loggedIn", false);
  const [network, setNetwork] = useState({});

  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const network = await API.get("network/" + nwid);
        setNetwork(network.data);
        console.log("Current network:", network.data);
      } catch (err) {
        if (err.response.status === 404) {
          history.push("/404");
        }
        console.error(err);
      }
    }
    fetchData();
  }, [nwid, history]);

  if (loggedIn) {
    return (
      <>
        <Link color="inherit" component={RouterLink} to="/" underline="none">
          <ArrowBackIcon className={classes.backIcon}></ArrowBackIcon>
          Networks
        </Link>
        <div className={classes.container}>
          {network["config"] && (
            <>
              <NetworkHeader network={network} />
              <NetworkSettings network={network} setNetwork={setNetwork} />
            </>
          )}
          <NetworkMembers />
          {network["config"] && <NetworkRules network={network} />}
          <NetworkManagement />
        </div>
      </>
    );
  } else {
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
            You are not authorized. Please Log In
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default Network;
