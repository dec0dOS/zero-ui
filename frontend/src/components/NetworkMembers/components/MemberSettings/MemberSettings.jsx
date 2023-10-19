import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import { useState } from "react";
import Tag from "./components/Tag";

import { useTranslation } from "react-i18next";

function MemberSettings({ member, network, handleChange }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClickOpen}>
        <BuildIcon style={{ fontSize: 20 }} />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {t("member") + member.config.id + t("settings")}
        </DialogTitle>
        <DialogContent>
          <Grid item>
            <Checkbox
              checked={member["config"]["activeBridge"]}
              color="primary"
              onChange={handleChange(
                member,
                "config",
                "activeBridge",
                "checkbox"
              )}
            />
            <span>{t("allowBridging")}</span>
          </Grid>
          <Grid item>
            <Checkbox
              checked={member["config"]["noAutoAssignIps"]}
              color="primary"
              onChange={handleChange(
                member,
                "config",
                "noAutoAssignIps",
                "checkbox"
              )}
            />
            <span>{t("noAutoIP")}</span>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{t("capabilities")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper style={{ padding: 20 }}>
                {Object.entries(network["capabilitiesByName"] || []).length ===
                0
                  ? t("noCapDef")
                  : ""}
                {Object.entries(network["capabilitiesByName"] || []).map(
                  ([capName, capId]) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={member["config"]["capabilities"].includes(
                            capId
                          )}
                          color="primary"
                          onChange={handleChange(
                            member,
                            "config",
                            "capabilities",
                            "capChange",
                            capId
                          )}
                        />
                      }
                      key={"cap-" + capId}
                      label={capName}
                    />
                  )
                )}
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{t("tags")}</Typography>
            </Grid>
            {Object.entries(network["tagsByName"] || []).length === 0 ? (
              <Grid item xs={12}>
                <Paper style={{ padding: 20 }}>{t("noTagDef")}</Paper>
              </Grid>
            ) : (
              ""
            )}
            {Object.entries(network["tagsByName"] || []).map(
              ([tagName, tagDetail]) => (
                <Grid item xs={12} sm={6} key={"tag-" + tagName}>
                  <Tag
                    member={member}
                    tagName={tagName}
                    tagDetail={tagDetail}
                    handleChange={handleChange}
                  />
                </Grid>
              )
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MemberSettings;
