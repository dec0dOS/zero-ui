import { Grid, Typography } from "@material-ui/core";

function NotFound() {
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
        <Typography variant="h1">
          <span>404</span>
        </Typography>

        <Typography variant="h4">
          <span>Not found</span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default NotFound;
