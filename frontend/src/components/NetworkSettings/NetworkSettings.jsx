import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Divider,
  Grid,
  Typography,
  TextField,
  Select,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ManagedRoutes from "./components/ManagedRoutes";
import IPv4AutoAssign from "./components/IPv4AutoAssign";

import API from "utils/API";
import { parseValue, replaceValue, setValue } from "utils/ChangeHelper";

function NetworkSettings({ network, setNetwork }) {
  console.log("NETWORK", network);
  const sendReq = async (data) => {
    try {
      const req = await API.post("/network/" + network["config"]["id"], data);
      console.log("Action", req);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange =
    (key1, key2, mode = "text", additionalData = null) =>
    (event) => {
      const value = parseValue(event, mode, additionalData);

      let updatedNetwork = replaceValue({ ...network }, key1, key2, value);
      setNetwork(updatedNetwork);

      let data = setValue({}, key1, key2, value);

      sendReq(data);
    };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>General settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography>Network ID</Typography>
            <Typography variant="h5">
              <span>{network["config"]["id"]}</span>
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              value={network["config"]["name"]}
              onChange={handleChange("config", "name")}
              label="Name"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              value={network["description"]}
              onChange={handleChange("description")}
              multiline
              rows={2}
              rowsMax={Infinity}
              label="Description"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Divider />
          <Grid item>
            <Typography>Access Control</Typography>
            <Select
              native
              value={network["config"]["private"]}
              onChange={handleChange("config", "private", "json")}
            >
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </Select>
          </Grid>
          <Divider />
          <Grid item>
            <ManagedRoutes
              routes={network["config"]["routes"]}
              handleChange={handleChange}
            />
          </Grid>
          <Divider />
          <Grid item>
            <IPv4AutoAssign
              ipAssignmentPools={network["config"]["ipAssignmentPools"]}
              handleChange={handleChange}
            />
          </Grid>
          {/* TODO: */}
          {/* <Grid item>
            <Typography>IPv6 Auto-Assign</Typography>
          </Grid> */}
          <Divider />
          <Grid item>
            <TextField
              label="Multicast Recipient Limit"
              type="number"
              value={network["config"]["multicastLimit"]}
              onChange={handleChange("config", "multicastLimit", "json")}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <Checkbox
              checked={network["config"]["enableBroadcast"]}
              color="primary"
              onChange={handleChange("config", "enableBroadcast", "checkbox")}
            />
            <span>Enable Broadcast</span>
          </Grid>
          {/* TODO: */}
          {/* <Grid item>
            <Typography>DNS</Typography>
          </Grid> */}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkSettings;
