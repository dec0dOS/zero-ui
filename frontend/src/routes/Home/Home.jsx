import { useLocalStorage } from "react-use";

import HomeLoggedIn from "components/HomeLoggedIn/HomeLoggedIn.jsx";
import HomeLoggedOut from "components/HomeLoggedOut/HomeLoggedOut.jsx";

function Home() {
  const [loggedIn] = useLocalStorage("loggedIn", false);

  if (loggedIn) {
    return <HomeLoggedIn />;
  } else {
    return <HomeLoggedOut />;
  }
}

export default Home;
