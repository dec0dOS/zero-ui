import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";
import AskWhy from "./components/AskWhy";
import DataTable from "react-data-table-component";
import API from "utils/API";
import { parseValue, replaceValue } from "utils/ChangeHelper";

function NetworkMembers( val ) {
  
  const [members, setMembers] = useState([...val.members]);
  const [askwhy, setAskWhy] = useState(false);
  const [mid, setMid] = useState();
  const [nwid, setNwid] = useState();

  const sendReq = async (nwid ,mid, data) => {
    const req = await API.post("/network/" + nwid + "/member/" + mid, [data]);
    console.log("Action:", req.data.data);
  };

  const handleChange =
    (member, key1 = null, mode = "text", id = null) =>
    (event) => {
      console.log(event)
      if (event.target.checked === true) {
        handleOpen()
      }
      //
      const value = parseValue(event, mode, member, key1, id);
      const updatedMember = replaceValue({...member}, key1, null, value);
      const index = members.findIndex((item) => {
        return item["address"] === member["address"];
      });
      let mutableMembers = [...members];

      mutableMembers[index] = updatedMember;
      
      setMembers(mutableMembers);
      setMid(member["address"])
      setNwid(val.nwid)
      sendReq(val.nwid, member["address"], mutableMembers[index]);
    };

  const handleClose = () => {
      setAskWhy(false);
    };

  const handleOpen = () => {
    setAskWhy(true)
    
  }
  
  const columns = [
    {
      id: "authorized",
      name: "Authorized",
      minWidth: "80px",
      cell: (row) => (
        <Checkbox
          checked={row.authorized}
          color="primary"
          onChange={handleChange(row, "authorized", "checkbox")}
        />
      ),
    },
    {
      id: "address",
      name: "Address",
      minWidth: "150px",
      cell: (row) => (
        <Typography variant="body2">{row.address}</Typography>
      ),
    },
    {
      id: "name",
      name: "Name",
      minWidth: "250px",
      cell: (row) => (<Typography variant="body1">{row.name}</Typography>),
    }
  ];

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Members</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column" spacing={3}>
        <AskWhy nwid={nwid} mid={mid} open={askwhy} handleClose={handleClose}></AskWhy>
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
                justify="center"
                style={{
                  minHeight: "50vh",
                }}
              >
                <Typography variant="h6" style={{ padding: "10%" }}>
                  No devices Available.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkMembers;
