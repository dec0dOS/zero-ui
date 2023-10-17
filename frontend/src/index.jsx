import "./index.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";

import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
