import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import PropTypes from "prop-types";
import MediaQuery from "react-responsive";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// Import Componetns
import Header from "../components/Header";
import { loginSucceed, getAuthInfo } from "../../services/auth/authActions";
import { getUrlParameter } from "../../services/auth/services";
// Import Assets
import logo from "assets/images/login/chatmatic-logo.png";
import facebookIcon from "assets/images/login/facebook.png";
import "./styles.css";

class Login extends React.Component {
    componentDidMount() {
        const {
            apiToken,
            currentUser,
            history,
            location: { search }
        } = this.props;
        const redirectUrl = getUrlParameter(search, "redirectUrl");
        if (!!apiToken && !!currentUser) {
            if (!!redirectUrl) history.push(redirectUrl);
            else history.push("/");
        }
        const userID = getUrlParameter(search, "userid");
        const accessToken = getUrlParameter(search, "accesstoken");

        if (!!userID && !!accessToken) {
            this.responseFacebook({ userID, accessToken });
            return;
        }
        if (process.env.REACT_APP_IS_CHATDEPLOY == undefined) {
            return;
        }
        if (process.env.REACT_APP_IS_CHATDEPLOY == "false") {
            window.location.replace(
                "https://staging.chatdeploy.com/login" +
                    (!!redirectUrl ? "?redirectUrl=" + redirectUrl : "")
            );
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.loading) {
            Swal({
                title: "Please wait...",
                text: "We are fetching user info...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loading) {
            Swal.close();

            if (nextProps.error) {
                toastr.error("Error", nextProps.error);
            }
        }
    }

    _showModal = () => {
        Swal({
            title: "Coming soon...",
            text: "Should be updated.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    };

    responseFacebook = response => {
        const {
            location: { search }
        } = this.props;

        const redirectUrl = getUrlParameter(search, "redirectUrl");
        if (!!response && response.accessToken) {
            if (process.env.REACT_APP_IS_CHATDEPLOY == "true") {
                let url = `https://app.chatmatic.com/login?userid=${response.userID}&accesstoken=${response.accessToken}`;
                if (!!redirectUrl) {
                    url += `&redirectUrl=${redirectUrl}`;
                }
                window.location.replace(url);
                return;
            }
            this.props.actions.loginSucceed(response);
            this.props.actions.getAuthInfo(redirectUrl);
        }
    };

    renderFacebookLoginBtn = () => {
        return (
            <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                callback={this.responseFacebook}
                scope={process.env.REACT_APP_FACEBOOK_LOGIN_SCOPE}
                disableMobileRedirect={true}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        className="btn-login text-white"
                    >
                        <img src={facebookIcon} alt="" />
                        Continue With Facebook
                    </button>
                )}
            />
        );
    };

    render() {
        const {
            location: { search }
        } = this.props;

        const redirectUrl = getUrlParameter(search, "redirectUrl");
        if (!!this.props.apiToken && !!this.props.currentUser) {
            if (!!redirectUrl) this.props.history.push(redirectUrl);
            else this.props.history.push("/");
        }

        return (
            <div className="position-relative login-scene">
                <Header pathname={this.props.location.pathname} />
                <MediaQuery minWidth={1024}>
                    <div className="d-flex login-container">
                        <div className="d-flex flex-column align-items-center login-left-container">
                            <img src={logo} alt="" />
                            <div className="d-flex flex-column login-form">
                                <span>Log in to your Chatmatic account</span>
                                {this.renderFacebookLoginBtn()}
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center login-right-container">
                            {/* <div className="d-flex justify-content-center align-items-center w-100 official-release">
                                <button
                                    className="btn btn-link btn-official-release"
                                    onClick={this._showModal}
                                >
                                    OFFICIAL RELEASE MESSAGE
                                </button>
                            </div> */}
                            <div className="d-flex flex-column align-items-center message-content">
                                <span className="note-message">
                                    Chatmatic Officially Released Our Beta!
                                </span>
                                <span className="text-primary">
                                    Thanks To All Of Our Members
                                </span>
                            </div>
                        </div>
                    </div>
                </MediaQuery>

                <MediaQuery maxWidth={1023}>
                    <div className="login-container">
                        <div className="d-flex flex-column justify-content-start align-items-center login-right-container">
                            <div className="d-flex justify-content-center align-items-center w-100 official-release">
                                <button
                                    className="btn btn-link btn-official-release"
                                    onClick={this._showModal}
                                >
                                    OFFICIAL RELEASE MESSAGE
                                </button>
                            </div>
                            <div className="d-flex flex-grow-1 align-items-center">
                                <div className="d-flex flex-column align-items-center message-content">
                                    <div className="d-flex flex-column">
                                        <span className="note-message">
                                            Chatmatic Officially Released Our
                                            Beta!
                                        </span>
                                        <span className="text-primary">
                                            Thanks To All Of Our Members
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column login-form">
                                        <span>
                                            Log in to your Chatmatic account
                                        </span>
                                        {this.renderFacebookLoginBtn()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

Login.propTypes = {
    loading: PropTypes.bool,
    currentUser: PropTypes.object,
    apiToken: PropTypes.any,
    error: PropTypes.any,
    actions: PropTypes.object.isRequired
};

export default withRouter(
    connect(
        state => ({
            ...state.default.auth
        }),
        dispatch => ({
            actions: bindActionCreators(
                {
                    getAuthInfo,
                    loginSucceed
                },
                dispatch
            )
        })
    )(Login)
);
