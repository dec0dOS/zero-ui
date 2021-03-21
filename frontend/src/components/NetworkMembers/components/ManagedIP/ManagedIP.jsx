import { useState } from "react";

import { Grid, List, TextField, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { validateIP, normilizeIP } from "utils/IP";

function ManagedIP({ member, handleChange }) {
  const [ipInput, setIpInput] = useState();
  const [normolizedInput, setNormolizedInput] = useState();

  const handleInput = (event) => {
    const ip = event.target.value;
    setIpInput(ip);
    if (validateIP(ip)) {
      setNormolizedInput(normilizeIP(ip));
    }
  };

  return (
    <Grid>
      {member.config.ipAssignments.map((value, i) => (
        <List
          key={i + "_ips"}
          disablePadding={true}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <IconButton
            size="small"
            color="secondary"
            onClick={handleChange(
              member,
              "config",
              "ipAssignments",
              "arrayDel",
              i
            )}
          >
            <DeleteOutlineIcon style={{ fontSize: 14 }} />
          </IconButton>
          {value}
        </List>
      ))}

      <List
        disablePadding={true}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleChange(
            member,
            "config",
            "ipAssignments",
            "arrayAdd",
            normolizedInput
          )}
        >
          <AddIcon
            style={{
              fontSize: 14,
            }}
          />
        </IconButton>
        <TextField value={ipInput} onChange={handleInput} />
      </List>
    </Grid>
  );
}

export default ManagedIP;
