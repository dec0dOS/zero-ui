import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  Hidden,
  Snackbar,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/3024-day.css";
import { compile } from "external/RuleCompiler";
import debounce from "lodash/debounce";
import { useState } from "react";
import API from "utils/API";

import { useTranslation } from "react-i18next";

function NetworkRules({ network, callback }) {
  const { t, i18n } = useTranslation();

  const [editor, setEditor] = useState(null);
  const [flowData, setFlowData] = useState({
    rules: [...network.config.rules],
    capabilities: [...network.config.capabilities],
    tags: [...network.config.tags],
  });
  const [tagCapByNameData, setTagCapByNameData] = useState({
    tagsByName: network.tagsByName || {},
    capabilitiesByName: network.capabilitiesByName || {},
  });
  const [errors, setErrors] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const saveChanges = async () => {
    if (editor) {
      const req = await API.post("/network/" + network["config"]["id"], {
        config: { ...flowData },
        rulesSource: editor.getValue(),
        ...tagCapByNameData,
      });
      console.log("Action", req);
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1500);

      callback();

      return () => clearTimeout(timer);
    }
  };

  const onChange = debounce((event) => {
    const src = event.getValue();
    setEditor(event);
    let rules = [],
      caps = {},
      tags = {};
    const res = compile(src, rules, caps, tags);
    if (!res) {
      let capabilitiesByName = {};
      for (var key in caps) {
        capabilitiesByName[key] = caps[key].id;
      }

      let tagsByName = { ...tags };
      for (let key in tags) {
        tags[key] = { id: tags[key].id, default: tags[key].default };
      }

      setFlowData({
        rules: [...rules],
        capabilities: [...Object.values(caps)],
        tags: [...Object.values(tags)],
      });

      setTagCapByNameData({
        tagsByName: tagsByName,
        capabilitiesByName: capabilitiesByName,
      });
      setErrors([]);
    } else {
      setErrors(res);
    }
  }, 100);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t("flowRules")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/*   Important note: value in CodeMirror instance means INITAIL VALUE
              or it could be used to replace editor state with the new value.
              No need to update on every user character input Flow Rules
        */}
        <CodeMirror
          value={network["rulesSource"]}
          onChange={onChange}
          options={{ tabSize: 2, lineWrapping: true }}
        />
        <Hidden mdDown>
          <div>
            <CodeMirror
              value={JSON.stringify(flowData, null, 2)}
              width="100%"
              height="50%"
              options={{
                theme: "3024-day",
                readOnly: true,
                lineNumbers: false,
                lineWrapping: true,
              }}
            />
          </div>
        </Hidden>
        <Divider />
        <Grid
          item
          style={{
            margin: "1%",
            display: "block",
            overflowWrap: "break-word",
            width: "250px",
          }}
        >
          {errors.length ? (
            <Typography color="error">
              {"[" + errors[0] + ":" + errors[1] + "] " + errors[2]}
            </Typography>
          ) : (
            <Button variant="contained" color="primary" onClick={saveChanges}>
              {t("saveChanges")}
            </Button>
          )}
        </Grid>
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message="Saved"
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default NetworkRules;
