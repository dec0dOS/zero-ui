import { Grid, TextField } from "@material-ui/core";

function MemberName({ member, handleChange }) {
  return (
    <Grid>
      <TextField
        value={member.name}
        onChange={handleChange(member, "name")}
        label="Name"
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={member.description}
        onChange={handleChange(member, "description")}
        label="Description"
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
  );
}

export default MemberName;
