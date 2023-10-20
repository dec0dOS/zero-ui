// Loading.styles.jsx
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loadingText: {
    marginTop: "16px",
    position: "relative",
    "& .loadingDots::after": {
      content: '"."',
      position: "absolute",
      left: "100%",
      marginLeft: "4px",
      animation: "$loadingDots 1s infinite",
    },
  },
  "@keyframes loadingDots": {
    "0%": { content: '"."' },
    "25%": { content: '".."' },
    "50%": { content: '"..."' },
    "75%": { content: '"...."' },
    "100%": { content: '"."' },
  },
});

export default useStyles;
