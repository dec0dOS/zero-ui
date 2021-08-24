import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { red, amber } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: amber[500],
    },
    secondary: {
      main: red[500],
    },
    type: "light",
  },
});

function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
