import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Divider,
  Grid,
  Typography,
  TextField,
  Select,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore.js";

import API from "utils/API.js";
import { parseValue, replaceValue, setValue } from "utils/ChangeHelper.js";

import { useTranslation } from "react-i18next";

function SettingsComponent() {
  const { t, i18n } = useTranslation();

  const handleChange = () => (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t("language")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid item>
          <Select native value={i18n.language} onChange={handleChange()}>
            <option value={"en"}>English</option>
            <option value={"es-ES"}>Español</option>
          </Select>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default SettingsComponent;
