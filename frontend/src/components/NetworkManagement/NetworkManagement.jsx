import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";

import API from "utils/API";

import { useTranslation } from "react-i18next";

function NetworkManagement() {
  const { nwid } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendDelReq = async () => {
    const req = await API.delete("/network/" + nwid);
    console.log("Action:", req);
  };

  const deleteNetwork = async () => {
    await sendDelReq();
    history.push("/");
    history.go(0);
  };

  const { t, i18n } = useTranslation();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t("management")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleClickOpen}
        >
          {t("deleteNetwork")}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{t("deleteNetworkConfirm")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("deleteAlert")}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("cancel")}
            </Button>
            <Button onClick={deleteNetwork} color="secondary">
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkManagement;
