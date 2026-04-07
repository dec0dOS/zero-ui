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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import API from "utils/API";
import { parseValue, replaceValue, setValue } from "utils/ChangeHelper";
import { formatDistance } from "date-fns";
import AddMember from "./components/AddMember";
import AddGroup from "./components/AddGroup";
import DeleteMember from "./components/DeleteMember";
import ManagedIP from "./components/ManagedIP";
import MemberName from "./components/MemberName";
import MemberSettings from "./components/MemberSettings";

import { useTranslation } from "react-i18next";

const MemberItemType = "MEMBER_ITEM";

const DraggableRow = ({ zoneId, row, content, ...other }) => {
  const [, drag] = useDrag({
    type: MemberItemType,
    item: { zoneId, row },
  });

  return (
    <div style={{ userSelect: "text" }} ref={(node) => drag(node)} {...other}>
      {content}
    </div>
  );
};

const DropZone = ({ zoneId, moveRow, children }) => {
  const [, drop] = useDrop({
    accept: MemberItemType,
    canDrop: (item, monitor) => {
      return item.zoneId !== zoneId;
    },
    drop: (item, monitor) => {
      if (monitor.canDrop()) {
        moveRow(item.zoneId, item.row, zoneId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      style={{ all: "unset", display: "contents" }}
      ref={(node) => drop(node)}
    >
      {children}
    </div>
  );
};

function NetworkMembers({ network }) {
  const { nwid } = useParams();
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [extraGroups, setExtraGroups] = useState([]);

  const addGroup = useCallback(
    async (name) => {
      if (!groups.includes(name) && !groups.includes(name)) {
        let mutableExtraGroups = [...extraGroups];
        mutableExtraGroups.push(name);
        setExtraGroups(mutableExtraGroups);
      }
    },
    [groups, extraGroups]
  );

  const fetchData = useCallback(async () => {
    try {
      const members = await API.get("network/" + nwid + "/member");
      let groupSet = new Set();
      members.data.forEach((x) => groupSet.add(x.group));
      setGroups([...groupSet]);
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

  const { t, i18n } = useTranslation();

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
      const groups = new Set();
      mutableMembers.forEach((x) => groups.add(x.group));
      let mutableExtraGroups = extraGroups.filter((x) => !groups.has(x));

      setMembers(mutableMembers);
      setGroups([...groups]);
      setExtraGroups(mutableExtraGroups);

      const data = setValue({}, key1, key2, value);
      sendReq(member["config"]["id"], data);
    };

  const columns = [
    {
      id: "auth",
      name: t("authorized"),
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
      name: t("address"),
      minWidth: "150px",
      cell: (row) => (
        <Typography variant="body2">{row.config.address}</Typography>
      ),
    },
    {
      id: "name",
      name: t("name") + "/" + t("description"),
      minWidth: "250px",
      cell: (row) => <MemberName member={row} handleChange={handleChange} />,
    },
    {
      id: "ips",
      name: t("managedIPs"),
      minWidth: "220px",
      cell: (row) => <ManagedIP member={row} handleChange={handleChange} />,
    },
    {
      id: "lastSeen",
      name: t("lastSeen"),
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
      name: t("version") + " / " + t("physIp") + " / " + t("latency"),
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
      name: t("settings"),
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

  const changeMemberGroup = (oldGroup, member, newGroup) => {
    member.group = newGroup;

    let mutableMembers = [...members];
    const groups = new Set();
    mutableMembers.forEach((x) => groups.add(x.group));

    // Remove extra group
    let mutableExtraGroups = extraGroups.filter((x) => !groups.has(x));

    setGroups([...groups]);
    setExtraGroups(mutableExtraGroups);
    setMembers(mutableMembers);

    const data = setValue({}, "group", null, newGroup);
    sendReq(member["config"]["id"], data);
  };

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t("member", { count: members.length })}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DndProvider backend={HTML5Backend}>
          <Grid container direction="column" spacing={3}>
            {groups
              .concat(extraGroups)
              .sort()
              .map((group) => (
                <DropZone zoneId={group} moveRow={changeMemberGroup}>
                  <Accordion defaultExpanded={group == ""} key={group}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{group || "Ungrouped"}</Typography>
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
                              data={[
                                ...members.filter((x) => x.group == group),
                              ]}
                              renderRow={(row, content) => (
                                <DraggableRow
                                  zoneId={group}
                                  row={row}
                                  content={content}
                                  key={row.config.address}
                                />
                              )}
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
                              <Typography
                                variant="h6"
                                style={{ padding: "10%" }}
                              >
                                {t("noDevices")} <b>{nwid}</b>.
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                        <Grid item></Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </DropZone>
              ))}
            <Grid item>
              <AddMember nwid={nwid} callback={fetchData} />
              <AddGroup callback={addGroup} />
            </Grid>
          </Grid>
        </DndProvider>
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkMembers;
