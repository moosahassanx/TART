import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./components/ui/provider";
import AboutApp from "./AboutApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <AboutApp />
    </Provider>
  </React.StrictMode>,
);
