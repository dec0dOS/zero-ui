import { Button, Grid, Snackbar } from "@material-ui/core";
import * as React from "react";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import axios from "axios";

function DelUser() {
  useEffect(() => {
    async function fetchData() {
      const users = await axios.get("/api/user-managment");
      setUsers(users.data.data);
      console.log("Users:", users.data.data);
    }
    fetchData();
  }, []);

  const sendValue = async () => {
    console.log(personName);
    if (personName[0] === "None") {
      setSnackbarOpen(true);
    } else {
      axios
        .post("/api/user-managment/del/" + personName, {
          username: personName,
        })
        .catch(function (error) {
          console.error(error);
        });
      const index = users.indexOf(personName[0]);
      if (index > -1) {
        users.splice(index, 1);
      } // 2nd parameter means remove one item only
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Grid container spacing={5}>
      <Grid item>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-controlled-open-select-label">
              Users
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={personName}
              label="Users"
              onChange={handleChange}
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>

              {users.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Button endIcon={<ClearIcon />} onClick={sendValue}>
        Delete
      </Button>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Bitte User auswählen"
      />
    </Grid>
  );
}

export default DelUser;
