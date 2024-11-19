import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./components/ui/provider";
import DetailsApp from "./DetailsApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <DetailsApp />
    </Provider>
  </React.StrictMode>,
);
