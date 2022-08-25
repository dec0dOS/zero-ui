import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import API from "utils/API";
import { parseValue, replaceValue, setValue } from "utils/ChangeHelper";
import { formatDistance } from "date-fns";
import AddMember from "./components/AddMember";
import DeleteMember from "./components/DeleteMember";
import ManagedIP from "./components/ManagedIP";
import MemberName from "./components/MemberName";
import MemberSettings from "./components/MemberSettings";

function NetworkMembers({ network }) {
  const { nwid } = useParams();
  const [members, setMembers] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const members = await API.get("network/" + nwid + "/member");
      setMembers(members.data);
      console.log("Members:", members.data);
    } catch (err) {
      console.error(err);
    }
  }, [nwid]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => fetchData(), 30000);
    return () => clearInterval(timer);
  }, [nwid, fetchData]);

  const sendReq = async (mid, data) => {
    const req = await API.post("/network/" + nwid + "/member/" + mid, data);
    console.log("Action:", req);
  };

  const handleChange =
    (member, key1, key2 = null, mode = "text", id = null) =>
    (event) => {
      const value = parseValue(event, mode, member, key1, key2, id);

      const updatedMember = replaceValue({ ...member }, key1, key2, value);

      const index = members.findIndex((item) => {
        return item["config"]["id"] === member["config"]["id"];
      });
      let mutableMembers = [...members];
      mutableMembers[index] = updatedMember;
      setMembers(mutableMembers);

      const data = setValue({}, key1, key2, value);
      sendReq(member["config"]["id"], data);
    };

  const columns = [
    {
      id: "auth",
      name: "Authorized",
      minWidth: "80px",
      cell: (row) => (
        <Checkbox
          checked={row.config.authorized}
          color="primary"
          onChange={handleChange(row, "config", "authorized", "checkbox")}
        />
      ),
    },
    {
      id: "address",
      name: "Address",
      minWidth: "150px",
      cell: (row) => (
        <Typography variant="body2">{row.config.address}</Typography>
      ),
    },
    {
      id: "name",
      name: "Name / Description",
      minWidth: "250px",
      cell: (row) => <MemberName member={row} handleChange={handleChange} />,
    },
    {
      id: "ips",
      name: "Managed IPs",
      minWidth: "220px",
      cell: (row) => <ManagedIP member={row} handleChange={handleChange} />,
    },
    {
      id: "status",
      name: "Last Seen",
      minWidth: "100px",
      cell: (row) =>
        row.online === 1 ? (
          <Typography style={{ color: "#008000" }}>{"ONLINE"}</Typography>
        ) : row.controllerId === row.config.address ? (
          <Typography style={{ color: "#c5e31e" }}>{"CONTROLLER"}</Typography>
        ) : row.online === 0 ? (
          <Typography color="error">
            {row.lastOnline !== 0
              ? formatDistance(row.lastOnline, row.clock, {
                  includeSeconds: false,
                  addSuffix: true,
                })
              : "OFFLINE"}
          </Typography>
        ) : (
          <Typography style={{ color: "#f1c232" }}>{"RELAYED"}</Typography>
        ),
    },
    {
      id: "physicalip",
      name: "Version / Physical IP / Latency",
      minWidth: "220px",
      cell: (row) =>
        row.online === 1 ? (
          <p>
            {"v" +
              row.config.vMajor +
              "." +
              row.config.vMinor +
              "." +
              row.config.vRev}
            <br />
            {row.physicalAddress + "/" + row.physicalPort}
            <br />
            {"(" + row.latency + " ms)"}
          </p>
        ) : (
          ""
        ),
    },
    {
      id: "delete",
      name: "",
      minWidth: "50px",
      right: true,
      cell: (row) => (
        <>
          <MemberSettings
            member={row}
            network={network}
            handleChange={handleChange}
          />
          <DeleteMember nwid={nwid} mid={row.config.id} callback={fetchData} />
        </>
      ),
    },
  ];

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Members</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column" spacing={3}>
          <IconButton color="primary" onClick={fetchData}>
            <RefreshIcon />
          </IconButton>
          <Grid container>
            {members.length ? (
              <DataTable
                noHeader={true}
                columns={columns}
                data={[...members]}
              />
            ) : (
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{
                  minHeight: "50vh",
                }}
              >
                <Typography variant="h6" style={{ padding: "10%" }}>
                  No devices have joined this network. Use the app on your
                  devices to join <b>{nwid}</b>.
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <AddMember nwid={nwid} callback={fetchData} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkMembers;
