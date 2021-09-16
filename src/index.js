import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { ThemeProvider } from "@material-ui/styles";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import LogRocket from "logrocket";
// Import {history} and store
import store, { history } from "./store";
import Themes from "./themes";
// Import root scene
import App from "./scenes/App";

// Import assets
import "./assets/fonts/font-awesome/css/font-awesome.css";
import "aos/dist/aos.css";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import "assets/scss/chatmatic.css";
import "global.css";
import "emoji-mart/css/emoji-mart.css";
import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-phone-number-input/style.css";

// Import register service worker
import { unregister } from "./registerServiceWorker";
unregister();
if (process.env.NODE_ENV !== "development") {
    LogRocket.init(
        process.env.NODE_ENV === "production"
            ? "0ph1nt/chatmatic"
            : "0ph1nt/chatmatic-dev"
    );
}
const target = document.querySelector("#root");
Bugsnag.start({
    apiKey: "f2f02a63a1c11a4dd8a90864f59340ee",
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV || "development",
    enabledReleaseStages: ["production", "staging"]
});

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: '1',
//   wsHost: process.env.REACT_APP_WS_HOST,
//   wsPort: '',
//   disableStats: true
// });

// wrap your entire app tree in the ErrorBoundary provided
const ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React);

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ErrorBoundary>
                <ThemeProvider theme={Themes.default}>
                    <App />
                </ThemeProvider>
            </ErrorBoundary>
        </ConnectedRouter>
    </Provider>,
    target
);
// registerServiceWorker();

// Just adding a change here to trigger a new .js file hash as a test - Mike - 2/1/2019
