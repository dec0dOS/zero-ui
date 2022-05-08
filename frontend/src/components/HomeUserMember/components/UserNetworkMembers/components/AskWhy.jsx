import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef } from "react";
import { useLocalStorage } from "react-use";

import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
      



function AskWhy(val) {
    console.log(val)
    const reason = useRef("");


    const [LoggedInUsername] = useLocalStorage("user", null);

    const handleSubmit = async () => {
        console.log(reason.current.value)
        axios
          .post("/api/user-managment/member/" + LoggedInUsername + "/reason", {"nwid" : val.nwid, "mid" : val.mid, "reason": reason.current.value, "duration": time})
          .catch(function (error) {
            console.error(error);
          });
          val.handleClose()
        }
    const handleClose = () => {
      val.handleClose()
    }

    const [time, setTime] = React.useState('');

    const handleChange = (event) => {
      setTime(event.target.value);
    };

  return (
    <div>
      <Dialog open={val.open}>
        <DialogTitle>Why?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte geb den Grund an warum du dein Gerät Autorisierst
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            inputRef={reason}
            label="Why"
            fullWidth
            variant="standard"
          />
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">Dauer</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={time}
              label="Dauer"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>1 Stunde</MenuItem>
              <MenuItem value={2}>2 Stunden</MenuItem>
              <MenuItem value={3}>3 Stunden</MenuItem>
              <MenuItem value={4}>4 Stunden</MenuItem>
              <MenuItem value={5}>5 Stunden</MenuItem>
              <MenuItem value={6}>6 Stunden</MenuItem>
              <MenuItem value={7}>7 Stunden</MenuItem>
              <MenuItem value={8}>8 Stunden</MenuItem>
              <MenuItem value={9}>9 Stunden</MenuItem>
            </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button onClick={handleSubmit}>Senden</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default AskWhy;
