import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import * as React from "react";
import { useRef } from "react";
import { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import axios from "axios";

function AddUser() {
  const sendValue = async () => {
    if (
      !valuename.current.value ||
      !valuepass.current.value ||
      !valuerole.current.value
    ) {
      setSnackbarOpen(true);
    } else {
      axios
        .post("/api/user-managment", {
          username: valuename.current.value,
          passwort: valuepass.current.value,
          role: valuerole.current.value,
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const valuename = useRef("");
  const valuepass = useRef("");
  const valuerole = useRef("");

  return (
    <Grid container spacing={5}>
      <Grid item>
        <TextField
          label="Name"
          variant="filled"
          inputRef={valuename}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Passwort"
          variant="filled"
          inputRef={valuepass}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={valuerole.current.value}
              inputRef={valuerole}
              label="Role"
            >
              <MenuItem value={"admin"}>Admin</MenuItem>
              <MenuItem value={"user"}>User</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Button color="primary" endIcon={<SaveIcon />} onClick={sendValue}>
        Save
      </Button>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Es müssen alle Werte engetragen werden"
      />
    </Grid>
  );
}

export default AddUser;
