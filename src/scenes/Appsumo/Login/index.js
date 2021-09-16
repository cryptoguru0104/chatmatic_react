import React from "react";
import { toastr } from "react-redux-toastr";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { Accordion, Menu, Icon, List, Divider, Card } from "semantic-ui-react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { loginSucceed, getAuthInfo } from "../../../services/auth/authActions";

import facebookIcon from "assets/images/login/facebook.png";

import "./style.scss";

export const licenseTierList = {
    chatmatic_tier1: {
        name: "License Tier 1",
        price: 49,
        fanCount: 1,
        templateCount: 20
    },
    chatmatic_tier2: {
        name: "License Tier 2",
        price: 99,
        fanCount: 10,
        templateCount: 40
    },
    chatmatic_tier3: {
        name: "License Tier 3",
        price: 149,
        fanCount: 25,
        templateCount: 60
    },
    chatmatic_tier4: {
        name: "License Tier 4",
        price: 249,
        fanCount:50,
        templateCount: 80
    },
    chatmatic_tier5: {
        name: "License Tier 5",
        price: 349,
        fanCount: 100,
        templateCount: 100
    },
    canceled: {
        name: "Refunded",
        price: "NA",
        fanCount: "NA",
        templateCount: "NA"
    }
};

class AppsumoLogin extends React.Component {
    state = {
        activeStatus: [0, 0]
    };

    componentDidMount() {
        const {
            apiToken,
            currentUser,
            history,
            location: { search }
        } = this.props;
        const redirectUrl = this._getUrlParameter("redirectUrl");
        if (!!apiToken && !!currentUser) {
            if (!!redirectUrl) history.push(redirectUrl);
            else history.push("/");
        }
        const userID = this._getUrlParameter("userid");
        const accessToken = this._getUrlParameter("accesstoken");
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

        document.getElementById("main").style.overflow = "auto";
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

    handleAccordionChange = (e, options) => {
        const { index } = options;
        const { activeStatus } = this.state;

        activeStatus[index] = activeStatus[index] ? 0 : 1;

        this.setState({ activeStatus: [...activeStatus] });
    };

    responseFacebook = response => {
        const redirectUrl = this._getUrlParameter("redirectUrl");
        if (!!response && response.accessToken) {
            if (process.env.REACT_APP_IS_CHATDEPLOY == "true") {
                let url = `https://app.chatmatic.com/login?userid=${response.userID}&accesstoken=${response.accessToken}`;
                if (!!redirectUrl) {
                    url += `&redirectUrl=${redirectUrl}`;
                }
                window.location.replace(url);
                return;
            }
            const appsumo_user_uid = this._getUrlParameter("id");
            response["sumoUserId"] = appsumo_user_uid;
            this.props.actions.loginSucceed(response);
            this.props.actions.getAuthInfo(redirectUrl);
        }
    };

    _getUrlParameter = name => {
        const { location } = this.props;
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    render() {
        const { activeStatus } = this.state;
        const tier = this._getUrlParameter("plan_id");

        return (
            <div className="appsumo-scene ">
                <Header pathname={this.props.location.pathname} />
                <div className="appsumo-login">
                    <div className="left-panel">
                        <h1 className="scene-title">Chatmatic plan</h1>
                        {/* <Image src=""/> */}
                        <Divider />
                        <h1 className="category">Plans and Features</h1>
                        <Accordion>
                            <Menu.Item>
                                <Accordion.Title
                                    active={activeStatus[0] === 0}
                                    index={0}
                                    onClick={this.handleAccordionChange}
                                >
                                    Deal Terms
                                    <Icon
                                        name={
                                            "angle " +
                                            (activeStatus[0] === 0
                                                ? "down"
                                                : "right")
                                        }
                                    />
                                </Accordion.Title>
                                <Accordion.Content
                                    active={activeStatus[0] === 0}
                                >
                                    <List className="plan-features">
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Lifetime access to Chatmatic
                                                Unlimited Subscriber Plan
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                No codes, no staking - just
                                                choose the plan that's right for
                                                you
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                You must activate your license
                                                within 60 days of purchase
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                All future Unlimited Subscriber
                                                Plan updates
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Ability to upgrade/downgrade
                                                between 5 license tiers
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>GDPR compliant</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                60-day money-back guarantee, no
                                                matter the reason
                                            </p>
                                        </List.Item>
                                    </List>
                                </Accordion.Content>
                            </Menu.Item>
                            <Menu.Item>
                                <Accordion.Title
                                    active={activeStatus[1] === 0}
                                    index={1}
                                    onClick={this.handleAccordionChange}
                                >
                                    Features included in All Plans
                                    <Icon
                                        name={
                                            "angle " +
                                            (activeStatus[1] === 0
                                                ? "down"
                                                : "right")
                                        }
                                    />
                                </Accordion.Title>
                                <Accordion.Content
                                    active={activeStatus[1] === 0}
                                >
                                    <List className="plan-features">
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Unlimited users (must log in
                                                through Facebook)
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>Unlimited subscribers</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>Unlimited campaigns</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Full messenger automation
                                                capability
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Lead generation/ nurturing
                                                functionality
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Drag and drop campaign builder
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Quickly create m. me links, chat
                                                widgets, messenger buttons, post
                                                comment entry points, welcome
                                                messages, auto-responses
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Zapier app and Webhook
                                                integrations
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Email and phone number
                                                pre-population
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Tag and user attributes allow
                                                users to save data about
                                                subscribers
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>Messenger broadcasting</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                SMS capabilities built into drag
                                                and drop builder
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>Live chat with subscribers</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Messenger persistent menu
                                                customization
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Build, sell, and transfer
                                                workflows as templates
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Built-in messenger sequence
                                                marketplace
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>SMS broadcasting</p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Shopify integration with sales
                                                tracking and automated card and
                                                carousel creation
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Email integrations directly from
                                                chatmatic (allowing users to
                                                integrate with their
                                                autoresponders)
                                            </p>
                                        </List.Item>
                                        <List.Item>
                                            <Icon name="check" />
                                            <p>
                                                Enhanced statistics for deeper
                                                knowledge of what's taking place
                                                in your sequence to better
                                                optimize
                                            </p>
                                        </List.Item>
                                    </List>
                                </Accordion.Content>
                            </Menu.Item>
                        </Accordion>
                    </div>
                    <div className="right-panel">
                        <Card className="tier-card">
                            <Card.Content
                                className="tier-name"
                                header={licenseTierList[tier].name}
                            />
                            <Card.Content className="price-content">
                                <span className="description">
                                    One time Purchase of
                                </span>
                                <span className="price">
                                    ${licenseTierList[tier].price}
                                </span>
                            </Card.Content>
                            <Card.Content className="feature-content">
                                <List className="plan-features">
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>All features above included</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            {licenseTierList[tier].fanCount}{" "}
                                            fan/Facebook pages
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            {
                                                licenseTierList[tier]
                                                    .templateCount
                                            }{" "}
                                            templates
                                        </p>
                                    </List.Item>
                                </List>
                            </Card.Content>
                        </Card>
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
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.default.auth
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getAuthInfo,
            loginSucceed
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AppsumoLogin)
);
