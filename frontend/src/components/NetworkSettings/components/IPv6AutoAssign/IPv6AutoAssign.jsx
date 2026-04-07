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
            <div style={{ marginLeft: '4rem', letterSpacing: '1px' }}>
              <code>
                fd
                <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(0, 2)}</span>
                :
                <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(2, 6)}</span>
                :
                <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(6, 10)}</span>
                :
                <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(10, 14)}</span>
                :
                <span style={{ backgroundColor: '#ffffcc' }}>{id.slice(14, 16)}</span>
                99:93
                <span style={{ backgroundColor: '#ccffff' }}>__</span>
                :
                <span style={{ backgroundColor: '#ccffff' }}>____</span>
                :
                <span style={{ backgroundColor: '#ccffff' }}>____</span>
              </code>
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
          {v6AssignMode["6plane"] && (
            <div style={{ marginLeft: '4rem', letterSpacing: '1px' }}>
              <code>
                fc
                {
                  (() => {
                    const sixPlaneID = id.match(/.{1,2}/g)
                    .map((substr, idx, arr) => parseInt(substr, 16) ^ parseInt(arr[idx + 4], 16))
                    .map((byte) => byte.toString(16).toLowerCase())
                    .map((byte) => (byte.length === 2) ? byte : '0' + byte)
                    .slice(0, 4)
                    .join('')
                    return (
                      <>
                        <span style={{ backgroundColor: '#ffffcc' }}>{sixPlaneID.slice(0, 2)}</span>
                        :
                        <span style={{ backgroundColor: '#ffffcc' }}>{sixPlaneID.slice(2, 6)}</span>
                        :
                        <span style={{ backgroundColor: '#ffffcc' }}>{sixPlaneID.slice(6, 8)}</span>
                      </>
                    )
                  })()
                }
                <span style={{ backgroundColor: '#ccffff' }}>__</span>
                :
                <span style={{ backgroundColor: '#ccffff' }}>____</span>
                :
                <span style={{ backgroundColor: '#ccffff' }}>____</span>
                :0000:0000:0001
              </code> 
            </div>
          )}
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
