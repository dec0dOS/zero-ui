import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Divider, Button, Grid, Typography, Box } from "@material-ui/core";
import useStyles from "./HomeLoggedIn.styles";

import NetworkButton from "./components/NetworkButton";

import API from "utils/API";
import { generateNetworkConfig } from "utils/NetworkConfig";

import Footer from "components/Footer/Footer";

function HomeLoggedIn() {
  const [networks, setNetworks] = useState([]);

  const classes = useStyles();
  const history = useHistory();

  const createNetwork = async () => {
    const network = await API.post("network", generateNetworkConfig());
    console.log(network);
    history.push("/network/" + network.data.data["config"]["id"]);
  };

  useEffect(() => {
    async function fetchData() {
      const networks = await API.get("network");
      setNetworks(networks.data.data);
      console.log("Networks:", networks.data.data);
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
      <Footer></Footer>
    </div>
  );
}

export default HomeLoggedIn;
