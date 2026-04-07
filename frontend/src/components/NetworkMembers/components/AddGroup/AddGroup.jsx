import { useState } from "react";

import { List, Typography, IconButton, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { useTranslation } from "react-i18next";

function AddGroup({ callback }) {
  const [name, setName] = useState("");

  const handleInput = (event) => {
    setName(event.target.value);
  };

  const addMemberReq = async () => {
    callback(name);
  };

  const { t } = useTranslation();

  return (
    <>
      <Typography>{t("addGroup")}</Typography>
      <List
        disablePadding={true}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <TextField
          value={name}
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

export default AddGroup;
