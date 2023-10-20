import { Typography, Box, CircularProgress } from "@material-ui/core";

import useStyles from "./Loading.styles";

function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color="primary" />
      <Typography variant="h6" component="div" className={classes.loadingText}>
        Loading
        <span className="loadingDots"></span>
      </Typography>
    </div>
  );
}

export default Loading;
