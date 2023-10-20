import "./index.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import App from "./App";

import "./i18n";
import Loading from "components/Loading";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
