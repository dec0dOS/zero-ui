import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Divider, Button, Grid, Typography, Box } from "@material-ui/core";
import useStyles from "./HomeLoggedIn.styles";

import NetworkButton from "./components/NetworkButton";

import API from "utils/API";
import { generateNetworkConfig } from "utils/NetworkConfig";

import { useTranslation } from "react-i18next";

function HomeLoggedIn() {
  const [networks, setNetworks] = useState([]);

  const classes = useStyles();
  const history = useHistory();

  const createNetwork = async () => {
    const network = await API.post("network", generateNetworkConfig());
    console.log(network);
    history.push("/network/" + network.data["config"]["id"]);
  };

  useEffect(() => {
    async function fetchData() {
      const networks = await API.get("network");
      setNetworks(networks.data);
      console.log("Networks:", networks.data);
    }
    fetchData();
  }, []);

  const { t, i18n } = useTranslation();

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        className={classes.createBtn}
        onClick={createNetwork}
      >
        {t("createNetwork")}
      </Button>
      <Divider />
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={6}>
          <Typography variant="h5">{t("controllerNetworks")}</Typography>
          {networks[0] && t("controllerAddress")}
          <Box fontWeight="fontWeightBold">
            {networks[0] && networks[0]["id"].slice(0, 10)}
          </Box>
        </Grid>
        <Grid item xs="auto">
          <Typography>{t("network", { count: networks.length })}</Typography>
          <Grid item>
            {networks[0] ? (
              networks.map((network) => (
                <Grid key={network["id"]} item>
                  <NetworkButton network={network} />
                </Grid>
              ))
            ) : (
              <div>{t("createOneNetwork")}</div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomeLoggedIn;
