import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

function Tag({ member, tagName, tagDetail, handleChange }) {
  const [tagValue, setTagValue] = useState("");
  const [tagChangedByUser, setTagChangedByUser] = useState(false);

  useEffect(() => {
    let tagIndex = member["config"]["tags"].findIndex((item) => {
      return item[0] === tagDetail["id"];
    });
    let value = "";
    if (tagIndex !== -1) {
      value = member["config"]["tags"][tagIndex][1];
    }
    value = value !== false ? value : "";
    setTagValue(value);
  }, [member, tagDetail]);

  useDebounce(
    async () => {
      if (tagChangedByUser) {
        let value = tagValue === "" ? "" : parseInt(tagValue);
        let event = { target: { value: value } };
        handleChange(
          member,
          "config",
          "tags",
          "tagChange",
          tagDetail["id"]
        )(event);
      }
      setTagChangedByUser(false);
    },
    500,
    [tagValue]
  );

  const handleSelectChange = (event) => {
    let newValue = event.target.value;
    setTagChangedByUser(true);
    setTagValue(newValue);
  };

  const handleFlagChange = (value) => (event) => {
    let newValue;
    let oldValue;

    if (tagValue === "") {
      oldValue = 0;
    } else {
      oldValue = tagValue;
    }

    if (event.target.checked) {
      newValue = oldValue + value;
    } else {
      newValue = oldValue - value;
    }
    setTagChangedByUser(true);
    setTagValue(newValue);
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    if (/^(|0|[1-9]\d*)$/.test(value)) {
      value = value === "" ? value : parseInt(value);
    } else {
      value = 0;
    }
    setTagChangedByUser(true);
    setTagValue(value);
  };

  const clearTag = (event) => {
    setTagChangedByUser(true);
    setTagValue("");
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            color={tagValue === "" ? "error" : "primary"}
          >
            {tagName}
            {tagValue === "" ? (
              ""
            ) : (
              <IconButton aria-label="delete" onClick={clearTag}>
                <DeleteIcon />
              </IconButton>
            )}
          </Typography>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <Select
              native
              value={tagValue}
              onChange={handleSelectChange}
              displayEmpty
              style={{ minWidth: 100 }}
            >
              <option value="">--</option>
              {Object.entries(tagDetail["enums"]).map(
                ([enumKey, enumValue]) => (
                  <option key={enumKey} value={enumValue}>
                    {enumKey}
                  </option>
                )
              )}
              {Object.values(tagDetail["enums"]).length === 0 &&
              tagValue !== "" ? (
                <option value={tagValue}>(no enums)</option>
              ) : (
                ""
              )}
              {Object.values(tagDetail["enums"]).length !== 0 &&
              !Object.values(tagDetail["enums"]).includes(tagValue) &&
              tagValue !== "" ? (
                <option value={tagValue}>(custom)</option>
              ) : (
                ""
              )}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Input
              value={tagValue}
              onChange={handleInputChange}
              placeholder="Tag Value"
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {Object.entries(tagDetail["flags"]).map(([flagKey, flagValue]) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={(tagValue & flagValue) === flagValue}
                  onChange={handleFlagChange(flagValue)}
                  color="primary"
                />
              }
              key={"flag-" + flagKey}
              label={flagKey}
            />
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Tag;
