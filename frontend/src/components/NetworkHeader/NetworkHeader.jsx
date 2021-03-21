import { Grid, Typography } from "@material-ui/core";

function NetworkHeader({ network }) {
  return (
    <Grid item>
      <Typography variant="h5">
        <span>{network["config"]["id"]}</span>
      </Typography>
      <Typography variant="h6" style={{ fontStyle: "italic" }}>
        <span>{network["config"] && network["config"]["name"]}</span>
      </Typography>
      <span>{network["config"] && network["description"]}</span>
    </Grid>
  );
}

export default NetworkHeader;
