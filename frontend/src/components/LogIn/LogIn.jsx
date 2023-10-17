import { Divider } from "@material-ui/core";

import LogInUser from "./components/LogInUser/LogInUser.jsx";
import LogInToken from "./components/LogInToken/LogInToken.jsx";

function LogIn() {
  return (
    <>
      {import.meta.env.DEV && (
        <>
          <LogInToken />
          <Divider orientation="vertical" />
        </>
      )}
      &nbsp;
      <LogInUser />
    </>
  );
}

export default LogIn;
