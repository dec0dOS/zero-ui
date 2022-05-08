import "@fontsource/roboto";

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Theme from "./components/Theme";
import Bar from "./components/Bar";

import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Network from "./routes/Network/Network";
import UserManagment from "routes/UserManagment/UserManagment";

function App() {
  return (
    <Theme>
      <BrowserRouter basename="/app">
        <Bar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/network/:nwid" component={Network} />
          <Route path="/user-managment" component={UserManagment} />
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
