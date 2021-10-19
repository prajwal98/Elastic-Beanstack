import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Amplify from "aws-amplify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { HashRouter } from "react-router-dom";
import { pdfjs } from "react-pdf";
import App from "./app/App";
import store from "./redux/redux_store/store";
import * as serviceWorker from "./serviceWorker";
import awsExports from "./config/aws-exports";

import "semantic-ui-css/semantic.min.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let persistor = persistStore(store);
Amplify.configure(awsExports);
document.documentElement.style.setProperty("--button-background", awsExports.main_color_2);
document.documentElement.style.setProperty("--sub-heading-color", awsExports.main_color_2);
document.documentElement.style.setProperty("--color-grey-dark-1", awsExports.main_color_1);
document.documentElement.style.setProperty("--color-grey-dark-2", awsExports.main_color_1);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
