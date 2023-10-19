import { Grid, Link, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SettingsComponent from "components/Settings";

import { Link as RouterLink } from "react-router-dom";
import { useLocalStorage } from "react-use";

import useStyles from "./Settings.styles";

import { useTranslation } from "react-i18next";

function Settings() {
  const { t, i18n } = useTranslation();
  const [loggedIn] = useLocalStorage("loggedIn", false);

  const classes = useStyles();

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
          <Typography variant="h5">{t("notAuthorized")}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default Settings;
