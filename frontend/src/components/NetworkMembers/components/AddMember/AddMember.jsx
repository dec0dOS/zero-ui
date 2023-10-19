import { useState } from "react";

import { List, Typography, IconButton, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import API from "utils/API";

import { useTranslation } from "react-i18next";

function AddMember({ nwid, callback }) {
  const [member, setMember] = useState("");

  const handleInput = (event) => {
    setMember(event.target.value);
  };

  const addMemberReq = async () => {
    if (member.length === 10) {
      const req = await API.post("/network/" + nwid + "/member/" + member, {
        config: { authorized: true },
        hidden: false,
      });
      console.log("Action:", req);
      callback();
    }
    setMember("");
  };

  const { t, i18n } = useTranslation();

  return (
    <>
      <Typography>{t("addMemberManually")}</Typography>
      <List
        disablePadding={true}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <TextField
          value={member}
          onChange={handleInput}
          placeholder={"##########"}
        />

        <IconButton size="small" color="primary" onClick={addMemberReq}>
          <AddIcon
            style={{
              fontSize: 16,
            }}
          />
        </IconButton>
      </List>
    </>
  );
}

export default AddMember;
