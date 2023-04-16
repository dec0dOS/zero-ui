import React from 'react';
import {
  Checkbox,
  Grid,
  Typography,
} from "@material-ui/core";

function IPv6AutoAssign({ id, v6AssignMode, handleChange }) {
  return (
    <>
      <Typography>IPv6 Auto-Assign</Typography>
      <Grid container direction="column">
        <Grid item>
          <Checkbox
            checked={v6AssignMode["rfc4193"]}
            color="primary"
            onChange={(e) => {
              handleChange("config", "v6AssignMode", "custom", {
                "rfc4193": e.target.checked,
                "6plane": v6AssignMode["6plane"],
                "zt": v6AssignMode["zt"],
              })(null)
            }}
          />
          <span>ZeroTier RFC4193 (/128 for each device)</span>
          {v6AssignMode["rfc4193"] && (
            <div>
              <small style={{ marginLeft: '2rem', letterSpacing: '1px' }}>
                <code>
                  fd
                  <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(0, 2)}</span>
                  :
                  <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(2, 6)}</span>
                  :
                  <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(6, 10)}</span>
                  :
                  <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(10, 12)}</span>
                  99:93
                  <span style={{ backgroundColor: '#ccffff' }}>__</span>
                  :
                  <span style={{ backgroundColor: '#ccffff' }}>____</span>
                  :
                  <span style={{ backgroundColor: '#ccffff' }}>____</span>
                </code>
              </small>
            </div>
          )}
        </Grid>


        <Grid item>
          <Checkbox
            checked={v6AssignMode["6plane"]}
            color="primary"
            onChange={(e) => {
              handleChange("config", "v6AssignMode", "custom", {
                "rfc4193": v6AssignMode["rfc4193"],
                "6plane": e.target.checked,
                "zt": v6AssignMode["zt"],
              })(null)
            }}
          />
          <span>ZeroTier 6PLANE (/80 routable for each device)</span>
        </Grid>

        {/* TODO: Implement v6 ipAssignmentPools, might break ipv4 pool settings */}
        {/* <Grid>
          <Checkbox
            checked={v6AssignMode["zt"]}
            color="primary"
            onChange={(e) => {
              handleChange("config", "v6AssignMode", "custom", {
                "rfc4193": v6AssignMode["rfc4193"],
                "6plane": v6AssignMode["6plane"],
                "zt": e.target.checked,
              })(null)
            }}
          />
          <span>Auto-Assign from Range</span>
        </Grid> */}
      </Grid>
    </>
  );
}

export default IPv6AutoAssign;
