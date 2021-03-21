import { useLocalStorage } from "react-use";

import HomeLoggedIn from "components/HomeLoggedIn";
import HomeLoggedOut from "components/HomeLoggedOut";

function Home() {
  const [loggedIn] = useLocalStorage("loggedIn", false);

  if (loggedIn) {
    return <HomeLoggedIn />;
  } else {
    return <HomeLoggedOut />;
  }
}

export default Home;
