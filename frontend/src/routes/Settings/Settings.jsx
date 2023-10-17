import { Grid, Link, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SettingsComponent from "components/SettingsComponent";

import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import API from "utils/API";
import useStyles from "./Settings.styles";

import { useTranslation } from "react-i18next";

function Settings() {
  const { t, i18n } = useTranslation();
  const [loggedIn] = useLocalStorage("loggedIn", false);
  const [network, setNetwork] = useState({});

  const classes = useStyles();
  const history = useHistory();

  if (loggedIn) {
    return (
      <>
        <div className={classes.breadcrumbs}>
          <Link color="inherit" component={RouterLink} to="/" underline="none">
            <ArrowBackIcon className={classes.backIcon}></ArrowBackIcon>
            {t("settings")}
          </Link>
        </div>
        <div className={classes.container}>
          <SettingsComponent />
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

export default Settings;
