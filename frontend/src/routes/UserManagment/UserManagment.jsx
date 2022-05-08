import { Grid, Link, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
import { useLocalStorage } from "react-use";
import useStyles from "./UserManagment.styles";
import Managment from "components/UserManagment";

function UserManagment() {
  const [loggedIn] = useLocalStorage("loggedIn", false);
  const classes = useStyles();
  if (loggedIn === true) {
    return (
      <>
        <Link color="inherit" component={RouterLink} to="/" underline="none">
          <ArrowBackIcon className={classes.backIcon}></ArrowBackIcon>
          Home
        </Link>
        <div className={classes.container}></div>
        <Managment></Managment>
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
            You are not authorized. Please Log in as Admin
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default UserManagment;
