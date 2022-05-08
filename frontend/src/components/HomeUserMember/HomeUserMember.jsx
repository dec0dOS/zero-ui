import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";

import useStyles from "./HomeUserMember.styles";
import { Typography, Grid, Divider} from "@material-ui/core";

import UserNetworkMembers from "./components/UserNetworkMembers";

//import Footer from "components/Footer/Footer";
import axios from "axios";

function HomeUserMember() {

  const classes = useStyles();

  const [LoggedInUsername] = useLocalStorage("user", null);

  const [members, setMembers] = useState([]);
  const [network, setNetwork] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const usermember = await axios.get("/api/user-managment/member/" + LoggedInUsername);
      console.log("Current Members:", usermember.data.data);
      setMembers(usermember.data.data)

      let nwids = []
      for (const [key] of Object.entries(usermember.data.data)) {
        nwids.push(key)
      }
      setNetwork(nwids)
    }
    fetchData();
  }, [LoggedInUsername]);
  
  return (
    <div className={classes.root}>

      <Typography variant="h3"> Herzlich Wilkommen {LoggedInUsername}</Typography>
      <Divider />
      {network.length ? (
            network.map(nwid => 
            [<Typography variant="h5"> {nwid}</Typography>,
            <UserNetworkMembers members={members[nwid]} nwid={nwid} />]
            
            )
            ) : (
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{
                  minHeight: "50vh",
                }}
              >
                <Typography variant="h6" style={{ padding: "10%" }}>
                  No devices Availible - Please ask your Admin for further Detail.
                </Typography>
              </Grid>
            )}

    </div>

  );
}

export default HomeUserMember;


