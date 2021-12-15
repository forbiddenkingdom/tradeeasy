import React from "react";
// Frameworks
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
// Custom imports
import "lib/i18n"; // Translation configuration.
import App from "views/_app";
import AutoLogOut from "lib/AutoLogOut";
import theme from "lib/theme";
import store from "store/index.store";
// Assets
import "assets/global.css";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Provider store={store}>
        <CssBaseline />
        <AutoLogOut />
        <Route path="/:page?" render={(props) => <App {...props} />} />
      </Provider>
    </BrowserRouter>
  </ThemeProvider>,
  document.querySelector("#root")
);
