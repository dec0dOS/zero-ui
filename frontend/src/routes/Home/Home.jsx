import { useLocalStorage } from "react-use";

import HomeLoggedIn from "components/HomeLoggedIn";
import HomeLoggedOut from "components/HomeLoggedOut";
import HomeUserMember from "components/HomeUserMember";


function Home() {
  const [loggedIn] = useLocalStorage("loggedIn", false);
 
  if (loggedIn === true) {
    return <HomeLoggedIn />;
  } else if (loggedIn === "user") {
    return <HomeUserMember />;
  } else {
    return <HomeLoggedOut />;
  }
}

export default Home;
