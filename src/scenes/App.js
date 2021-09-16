import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AOS from "aos";
import ReduxToastr from "react-redux-toastr";

// Import scenes
import Login from "./Login";
import Home from "./Home/Home";
import Landing from "./Landing";
import Pricing from "./Pricing";
import Page404 from "./Page404";
import Messenger from "./Home/scenes/Messenger";
import { Templates, PreviewTemplate } from "./Templates";

/** Import redux actions */
import {
    getUser,
    getApiToken,
    getAuthInfoSucceed
} from "../services/auth/authActions";

import { setCookie } from "services/utils";
import AppsumoLogin from "./Appsumo/Login";

import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
// import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const referral = urlParams.get("referral");
        if (referral) {
            setCookie("referral", referral, 2); // name,value,days
        }
    }
    componentWillMount() {
        this.props.authActions.getApiToken();
        this.props.authActions.getUser();

        window.fakeLogin = (apiToken, userId) => {
            this.props.authActions.getAuthInfoSucceed(
                {
                    facebookName: "Fake User",
                    facebookEmail: "face@user.com",
                    facebookProfileImage: null,
                    accessToken: apiToken,
                    userId: 23
                },
                "/"
            );
        };
    }

    componentDidMount() {
        AOS.init({
            offset: 100,
            duration: 700,
            easing: "ease-in-out-sine",
            delay: 100
        });
    }

    render() {
        return (
            <main id="main">
                <Router>
                    <Switch>
                        <Route
                            path="/login"
                            exact
                            render={props => <Login {...props} />}
                        />
                        <Route
                            path="/landing"
                            exact
                            render={props => <Landing {...props} />}
                        />
                        <Route
                            path="/pricing"
                            exact
                            render={props => <Pricing {...props} />}
                        />
                        <Route
                            path="/c"
                            exact
                            render={props => <Messenger {...props} />}
                        />
                        <Route
                            path="/404"
                            render={props => <Page404 {...props} />}
                        />
                        <Route
                            path="/templates"
                            render={props => <Templates />}
                        />
                        <Route
                            path="/login_appsumo"
                            render={props => <AppsumoLogin />}
                        />
                        <Route
                            path="/template/:id"
                            render={props => <PreviewTemplate />}
                        />
                        <Route path="/" render={props => <Home {...props} />} />
                    </Switch>
                </Router>
                <ReduxToastr position="bottom-left" />
            </main>
        );
    }
}

export default connect(
    state => ({
        auth: state.default.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(
            {
                getUser,
                getApiToken,
                getAuthInfoSucceed
            },
            dispatch
        )
    })
)(App);
