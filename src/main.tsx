import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { HeroProvider } from "./providers";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HeroProvider>
          <App />
        </HeroProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
