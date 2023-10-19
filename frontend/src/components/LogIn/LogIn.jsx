import { Divider } from "@material-ui/core";

import LogInUser from "./components/LogInUser";
import LogInToken from "./components/LogInToken";

function LogIn() {
  return (
    <>
      {import.meta.env.DEV && (
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
