import { Grid, Typography } from "@material-ui/core";

function HomeLoggedOut() {
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
