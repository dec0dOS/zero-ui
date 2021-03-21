import { useState } from "react";

import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";

function MemberSettings({ member, handleChange }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClickOpen}>
        <BuildIcon style={{ fontSize: 20 }} />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Member " + member.config.id + " settings"}</DialogTitle>
        <DialogContent>
          <Grid item>
            <Checkbox
              checked={member["config"]["activeBridge"]}
              color="primary"
              onChange={handleChange(
                member,
                "config",
                "activeBridge",
                "checkbox"
              )}
            />
            <span>Allow Ethernet Bridging</span>
          </Grid>
          <Grid item>
            <Checkbox
              checked={member["config"]["noAutoAssignIps"]}
              color="primary"
              onChange={handleChange(
                member,
                "config",
                "noAutoAssignIps",
                "checkbox"
              )}
            />
            <span>Do Not Auto-Assign IPs</span>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MemberSettings;
