import "./NetworkButton.css";
import { Link } from "react-router-dom";

import { List, ListItem, Hidden } from "@material-ui/core";
import useStyles from "./NetworkButton.styles";

import { getCIDRAddress } from "utils/IP";

function NetworkButton({ network }) {
  const classes = useStyles();

  return (
    <div className="netBtn" role="button">
      <Link to={"/network/" + network["id"]} className={classes.link}>
        <List className={classes.flexContainer}>
          <ListItem className={classes.nwid}>{network["id"]}</ListItem>
          <ListItem className={classes.name}>
            {network["config"]["name"]}
          </ListItem>
          <Hidden mdDown>
            <ListItem className={classes.cidr}>
              {network["config"]["ipAssignmentPools"][0] ? (
                getCIDRAddress(
                  network["config"]["ipAssignmentPools"][0]["ipRangeStart"],
                  network["config"]["ipAssignmentPools"][0]["ipRangeEnd"]
                )
              ) : (
                <div>NO IPs</div>
              )}
            </ListItem>
          </Hidden>
        </List>
      </Link>
    </div>
  );
}

export default NetworkButton;
