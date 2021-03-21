import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "black",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: "8px",
  },
  name: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  nwid: {
    color: "#007fff",
    fontWeight: "bolder",
  },
  cidr: {
    color: "#b5b5b5",
  },
}));

export default useStyles;
