import Grid from "@mui/material/Grid";
import * as React from "react";
import AddUser from "./AddUser";
import DelUser from "./DelUser";
import UserMember from "./UserMember";
import Typography from "@mui/material/Typography";

function Managment() {
  return (
    <Grid
      container
      spacing={4}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4">Add User</Typography>
      <Grid item xs={6}>
        <AddUser></AddUser>
      </Grid>
      <Typography variant="h4">Delete User</Typography>
      <Grid item xs={6}>
        <DelUser></DelUser>
      </Grid>
      <Typography variant="h4">Add Member to User</Typography>
      <Grid item xs={6}>
        <UserMember></UserMember>
      </Grid>
    </Grid>
  );
}
export default Managment;
