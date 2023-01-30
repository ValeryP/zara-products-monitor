import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApplyTheme } from "./utils/theme";
import { store } from "./utils/store";

import { Provider } from "react-redux";
import { NetworkErrorBoundary } from "./components/NetworkErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NetworkErrorBoundary>
            <Provider store={store}>
                <ApplyTheme>
                    <App />
                </ApplyTheme>
            </Provider>
        </NetworkErrorBoundary>
    </React.StrictMode>
);

document.body.style.margin = "0";
