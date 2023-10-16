import { Grid, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function MemberName({ member, handleChange }) {
  const { t, i18n } = useTranslation();
  return (
    <Grid>
      <TextField
        value={member.name}
        onChange={handleChange(member, "name")}
        label={t("name")}
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={member.description}
        onChange={handleChange(member, "description")}
        label={t("description")}
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
  );
}

export default MemberName;
