import "@fontsource/roboto";

import { Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Theme from "./components/Theme";
import Bar from "./components/Bar";

import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Network from "./routes/Network/Network";
import Settings from "./routes/Settings";

import Loading from "./components/Loading";

import "./i18n";

function App() {
  return (
    <Theme>
      <Suspense fallback={<Loading />}>
        <BrowserRouter basename="/app">
          <Bar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/network/:nwid" component={Network} />
            <Route path="/settings" component={Settings} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </Theme>
  );
}

export default App;
