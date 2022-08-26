import { Divider } from "@mui/material";

import LogInUser from "./components/LogInUser";
import LogInToken from "./components/LogInToken";

function LogIn() {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <>
          <LogInToken />
          <Divider orientation="vertical" />
        </>
      )}
      <LogInUser />
    </>
  );
}

export default LogIn;
