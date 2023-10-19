import { useState } from "react";

import {
  Button,
  Box,
  Divider,
  Grid,
  List,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import DataTable from "react-data-table-component";

import { addressPool } from "utils/NetworkConfig";
import { getCIDRAddress, validateIP, normilizeIP } from "utils/IP";

import { useTranslation } from "react-i18next";

function IPv4AutoAssign({ ipAssignmentPools, handleChange }) {
  const { t, i18n } = useTranslation();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleStartInput = (event) => {
    setStart(event.target.value);
  };

  const handleEndInput = (event) => {
    setEnd(event.target.value);
  };

  const setDefaultPool = (index) => {
    addPoolReq(addressPool[index]["start"], addressPool[index]["end"], true);

    handleChange("config", "routes", "custom", [
      {
        target: getCIDRAddress(
          addressPool[index]["start"],
          addressPool[index]["end"]
        ),
      },
    ])(null);
  };

  const addPoolReq = (localStart, localEnd, reset = false) => {
    let data = {};
    console.log(localStart, localEnd);
    if (validateIP(localStart) && validateIP(localEnd)) {
      data["ipRangeStart"] = normilizeIP(localStart);
      data["ipRangeEnd"] = normilizeIP(localEnd);
    } else {
      return;
    }

    let newPool = [];
    if (ipAssignmentPools && !reset) {
      newPool = [...ipAssignmentPools];
    }
    newPool.push(data);
    console.log(newPool);

    handleChange("config", "ipAssignmentPools", "custom", newPool)(null);

    setStart("");
    setEnd("");
  };

  const removePoolReq = (index) => {
    let newPool = [...ipAssignmentPools];
    newPool.splice(index, 1);

    handleChange("config", "ipAssignmentPools", "custom", newPool)(null);
  };

  const columns = [
    {
      id: "remove",
      width: "10px",
      cell: (_, index) => (
        <IconButton
          size="small"
          color="secondary"
          onClick={() => removePoolReq(index)}
        >
          <DeleteOutlineIcon style={{ fontSize: 14 }} />
        </IconButton>
      ),
    },
    {
      id: "Start",
      name: t("start"),
      cell: (row) => row["ipRangeStart"],
    },
    {
      id: "End",
      name: t("end"),
      cell: (row) => row["ipRangeEnd"],
    },
  ];

  return (
    <>
      <Typography>{t("ipv4AutoAssign")}</Typography>
      <div
        style={{
          padding: "30px",
        }}
      >
        <Grid container spacing={1}>
          {addressPool.map((item, index) => (
            <Grid item xs={3} key={item["name"]}>
              <Button
                variant="contained"
                fullWidth={true}
                onClick={() => setDefaultPool(index)}
              >
                {item["name"]}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
      <Typography style={{ paddingBottom: "10px" }}>
        {t("autoAssignPool")}
      </Typography>
      <Box border={1} borderColor="grey.300">
        <Grid item style={{ margin: "10px" }}>
          <DataTable
            noHeader={true}
            columns={columns}
            data={ipAssignmentPools}
          />
          <Divider />
          <Typography>{t("addIPv4Pool")}</Typography>
          <List
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TextField
              value={start}
              onChange={handleStartInput}
              placeholder={t("start")}
            />
            <Divider
              orientation="vertical"
              style={{
                margin: "10px",
              }}
              flexItem
            />
            <TextField
              value={end}
              onChange={handleEndInput}
              placeholder={t("end")}
            />
            <IconButton
              size="small"
              color="primary"
              onClick={() => addPoolReq(start, end)}
            >
              <AddIcon
                style={{
                  fontSize: 16,
                }}
              />
            </IconButton>
          </List>
        </Grid>
      </Box>
    </>
  );
}

export default IPv4AutoAssign;
