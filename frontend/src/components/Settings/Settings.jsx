import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Select,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useTranslation } from "react-i18next";
import localesList from "../../utils/localesList.json";

function Settings() {
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
            {localesList.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.name}
              </option>
            ))}
          </Select>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default Settings;
