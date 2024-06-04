import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import { WebSocketProvider } from "./CustomProvider/useWebSocket.jsx";
import { WebRtcProvider } from "./CustomProvider/useWebRtc.jsx";
import { register } from './serviceWorker';


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <WebSocketProvider>
          <WebRtcProvider>
            <App />
          </WebRtcProvider>
        </WebSocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
register()
