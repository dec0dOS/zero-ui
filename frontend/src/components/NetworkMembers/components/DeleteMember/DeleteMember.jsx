import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import API from "utils/API";
import { useTranslation } from "react-i18next";

function DeleteMember({ nwid, mid, callback }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteMemberReq = async () => {
    const req = await API.delete("/network/" + nwid + "/member/" + mid);
    console.log("Action:", req);
    setOpen(false);
    callback();
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClickOpen}>
        <DeleteOutlineIcon color="secondary" style={{ fontSize: 20 }} />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("deleteMemberConfirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("deleteAlert")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={deleteMemberReq} color="secondary">
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteMember;
