import { Grid, Link, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import NetworkHeader from "components/NetworkHeader";
import NetworkManagement from "components/NetworkManagement";
import NetworkMembers from "components/NetworkMembers";
import NetworkRules from "components/NetworkRules";
import NetworkSettings from "components/NetworkSettings";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import API from "utils/API";
import useStyles from "./Network.styles";

import { useTranslation } from "react-i18next";

function Network() {
  const { t, i18n } = useTranslation();
  const { nwid } = useParams();
  const [loggedIn] = useLocalStorage("loggedIn", false);
  const [network, setNetwork] = useState({});

  const classes = useStyles();
  const history = useHistory();

  const fetchData = useCallback(async () => {
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
  }, [nwid, history]);

  useEffect(() => {
    fetchData();
  }, [nwid, fetchData]);

  if (loggedIn) {
    return (
      <>
        <div className={classes.breadcrumbs}>
          <Link color="inherit" component={RouterLink} to="/" underline="none">
            <ArrowBackIcon className={classes.backIcon}></ArrowBackIcon>
            {t("network", { count: 2 })}
          </Link>
        </div>
        <div className={classes.container}>
          {network["config"] && (
            <>
              <NetworkHeader network={network} />
              <NetworkSettings network={network} setNetwork={setNetwork} />
            </>
          )}
          <NetworkMembers network={network} />
          {network["config"] && (
            <NetworkRules network={network} callback={fetchData} />
          )}
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
          <Typography variant="h5">{t("notAuthorized")}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default Network;
