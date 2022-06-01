import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";
import axios from "axios";

import { Divider, Button, Grid, Typography, Box } from "@material-ui/core";
import useStyles from "./HomeLoggedIn.styles";

import NetworkButton from "./components/NetworkButton";

import API from "utils/API";
import { generateNetworkConfig } from "utils/NetworkConfig";

function HomeLoggedIn() {
  const [networks, setNetworks] = useState([]);
  const [, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [, setDisableAuth] = useLocalStorage("disableAuth", false);
  const [token, setToken] = useLocalStorage("token", null);

  const classes = useStyles();
  const history = useHistory();

  axios.get("/auth/login").then(function (response) {
    if (response.data.enabled) {
      setDisableAuth(false);
      if (!token || token.length === 0) {
        setLoggedIn(false);
      }
    }
  });

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

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        className={classes.createBtn}
        onClick={createNetwork}
      >
        Create A Network
      </Button>
      <Divider />
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={6}>
          <Typography variant="h5">Controller networks</Typography>
          {networks[0] && "Network controller address"}
          <Box fontWeight="fontWeightBold">
            {networks[0] && networks[0]["id"].slice(0, 10)}
          </Box>
        </Grid>
        <Grid item xs="auto">
          <Typography>Networks</Typography>
          <Grid item>
            {networks[0] ? (
              networks.map((network) => (
                <Grid key={network["id"]} item>
                  <NetworkButton network={network} />
                </Grid>
              ))
            ) : (
              <div>Please create at least one network</div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomeLoggedIn;
