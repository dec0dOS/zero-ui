import { useState } from "react";

import {
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

import { validateIP, normilizeIP, validateCIDR } from "utils/IP";

import { useTranslation } from "react-i18next";

function ManagedRoutes({ routes, handleChange }) {
  const { t, i18n } = useTranslation();
  const [destination, setDestination] = useState("");
  const [via, setVia] = useState("");

  const handleDestinationInput = (event) => {
    setDestination(event.target.value);
  };

  const handleViaInput = (event) => {
    setVia(event.target.value);
  };

  const addRouteReq = () => {
    let data = {};
    if (validateCIDR(destination)) {
      data["target"] = destination;
    } else {
      return;
    }
    if (via && validateIP(via)) {
      data["via"] = normilizeIP(via);
    }

    let newRoutes = [...routes];
    newRoutes.push(data);

    handleChange("config", "routes", "custom", newRoutes)(null);

    setDestination("");
    setVia("");
  };

  const removeRouteReq = (index) => {
    let newRoutes = [...routes];
    newRoutes.splice(index, 1);

    handleChange("config", "routes", "custom", newRoutes)(null);
  };

  const columns = [
    {
      id: "remove",
      width: "10px",
      cell: (_, index) => (
        <IconButton
          size="small"
          color="secondary"
          onClick={() => removeRouteReq(index)}
        >
          <DeleteOutlineIcon style={{ fontSize: 14 }} />
        </IconButton>
      ),
    },
    {
      id: "target",
      name: t("target"),
      cell: (row) => row["target"],
    },
    {
      id: "via",
      name: t("via"),
      cell: (row) => (row["via"] ? row["via"] : "(LAN)"),
    },
  ];

  return (
    <>
      <Typography style={{ paddingBottom: "10px" }}>
        {t("managedRoutes")} ({routes.length + "/128"})
      </Typography>
      <Box border={1} borderColor="grey.300">
        <Grid item style={{ margin: "10px" }}>
          <DataTable noHeader={true} columns={columns} data={routes} />
          <Divider />
          <Typography>{t("addRoute")}</Typography>
          <List
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TextField
              value={destination}
              onChange={handleDestinationInput}
              placeholder={t("destination") + " (CIDR)"}
            />
            <Divider
              orientation="vertical"
              style={{
                margin: "10px",
              }}
              flexItem
            />
            <TextField
              value={via}
              onChange={handleViaInput}
              placeholder={t("via") + " (" + t("optional") + ")"}
            />
            <IconButton size="small" color="primary" onClick={addRouteReq}>
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

export default ManagedRoutes;
