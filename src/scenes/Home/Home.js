import React from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import classnames from "classnames";

/** Import components */
import TopNav from "./components/TopNav/TopNav";
import FlyoutNav from "./components/FlyoutNav";
import Sidebar from "./components/Sidebar/Sidebar";

import { getPages } from "services/pages/pagesActions";
import { logout } from "services/auth/authActions";

/** Import scenes */
import Campaigns from "./scenes/Campaigns";
import CampaignsAdd from "./scenes/CampaignsAdd";
import Dashboard from "./scenes/Dashboard";
import Engages from "./scenes/Engages";
import EngageAdd from "./scenes/EngageAdd";
import EngageBuilder from "./scenes/EngageAdd/scenes/EngageBuilder";
import BroadcastSelect from "./scenes/EngageAdd/scenes/BroadcastSelect";
import AppSumoLicenseInfo from "./AppSumo/LicenseInfo";
import Page from "./scenes/Page";
import PageAdd from "./scenes/PageAdd/";
import Subscribers from "./scenes/Subscribers";
import Settings from "./scenes/Settings";
import {
    AddWorkflow,
    ListWorkflows,
    EditWorkflow,
    StatsWorkflow,
    SelectTemplate
} from './WorkFlows';
import Authorization from './scenes/Settings/scenes/Authorization';
import { ListTriggers, EditTriggers, AddTriggers, AddInstagramTriggers } from './Triggers';

import NewDashboard from "./Dashboard";
import { ListBroadcasts, AddBroadcasts } from "./broadcasts";
import UserProfile from "./UserProfile";

/** Import assets */
import "./home.css";
// import 'assets/styles/index.scss';
import "semantic-ui-css/semantic.min.css";

class Home extends React.Component {
    state = {
        mountedPageId: null
    };

    componentWillMount() {
        if (!!this.props.auth.currentUser && !!this.props.auth.apiToken) {
            this.props.actions.getPages(false);
        } else {
            this.props.actions.logout();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const isProfilePage =
            nextProps.location.pathname.split("/")[1] === "profile";
        if (
            nextProps.pages.error &&
            this.props.pages.error !== nextProps.pages.error
        ) {
            toastr.error("Error", nextProps.pages.error);
            if (
                [
                    "Invalid authorization token.",
                    "Invalid token provided."
                ].includes(nextProps.pages.error)
            ) {
                this.props.actions.logout();
            }
        }
        if (!nextProps.auth.currentUser || !nextProps.auth.apiToken) {
            nextProps.history.push("/login");
        }

        if (
            nextProps.location.pathname !== "/" &&
            nextProps.location.pathname !== "/404" &&
            nextProps.location.pathname !== "/dashboard" &&
            nextProps.location.pathname !== "/page/add" &&
            !isProfilePage
        ) {
            const pageId = nextProps.location.pathname.split("/")[2];

            this.setState({ mountedPageId: pageId });
        }
    }

    /**
     * Render top bar and flyout nav bar if route is not 404 page
     */
    renderTopBar = () => {
        if (
            this.props.location.pathname !== "/404" &&
            this.props.location.pathname !== "/c/"
        ) {
            return <TopNav />;
        }
    };

    renderFlyoutNav = () => {
        if (
            this.props.location.pathname !== "/404" &&
            this.props.location.pathname !== "/dashboard" &&
            this.props.location.pathname !== "/c/"
        ) {
            return <FlyoutNav />;
        }
    };

    /**
     * Render sidebar for specific pages : for dashboard page not render sidebar
     */
    renderSidebar = () => {
        // If not dashboard page then render sidebar
        const isProfilePage =
            this.props.location.pathname.split("/")[1] === "profile";
        if (
            this.props.location.pathname !== "/dashboard" &&
            this.props.location.pathname !== "/page/add" &&
            this.props.location.pathname !== "/c/" &&
            !isProfilePage
        ) {
            return (
                <Route
                    path="/page/:id"
                    render={props => (
                        <Sidebar
                            {...props}
                            pageWrapId="page-wrap"
                            outerContainerId="home"
                        />
                    )}
                />
            );
        }
    };

    render() {
        // if (this.props.pages.pages.length === 0 && this.props.pages.loading) {
        //     return <div />;
        // }
        const isProfilePage =
            this.props.location.pathname.split("/")[1] === "profile";

        const sceneContainerClass = classnames(
            "container-fluid",
            {
                "scenes-container": this.props.location.pathname !== "/c/"
            },
            {
                "no-sidebar":
                    this.props.location.pathname === "/new-dashboard" ||
                    this.props.location.pathname === "/appsumo_licenseinfo" ||
                    this.props.location.pathname === "/dashboard" ||
                    this.props.location.pathname === "/page/add" ||
                    isProfilePage
            },
            {
                sidebar:
                    this.props.location.pathname !== "/dashboard" &&
                    this.props.location.pathname !== "/page/add" &&
                    !isProfilePage
            },
            {
                "profile-scene": isProfilePage
            }
        );

        return (
            <div id="home" className="home-container home-newo">
                {this.renderTopBar()}
                {this.renderFlyoutNav()}
                {this.renderSidebar()}
                <div className={sceneContainerClass}>
                    <Switch>
                        <Redirect exact path="/" to="/dashboard" />
                        {/* <Route
                            path="/dashboard"
                            render={props => <Dashboard {...props} />}
                        /> */}
                        <Route
                            path="/dashboard"
                            render={props => <NewDashboard {...props} />}
                        />
                        <Route
                            path="/appsumo_licenseinfo"
                            render={props => <AppSumoLicenseInfo />}
                        />
                        <Route
                            path="/page/add"
                            exact
                            render={props => <PageAdd {...props} />}
                        />
                        <Route
                            path="/page/:id"
                            exact
                            render={props => <Page {...props} />}
                        />
                        <Route
                            path="/page/:id/subscribers"
                            exact
                            render={props => <Subscribers {...props} />}
                        />
                        <Route
                            path="/page/:id/campaigns"
                            exact
                            render={props => <Campaigns {...props} />}
                        />
                        <Route
                            path="/page/:id/campaigns/add"
                            render={props => <CampaignsAdd {...props} />}
                        />
                        <Route
                            path="/page/:id/settings"
                            render={props => <Settings {...props} />}
                        />
                        {/* <Route
                            path="/page/:id/engages"
                            exact
                            render={props => <Engages {...props} />}
                        />
                        <Route
                            path="/page/:id/engages/add"
                            exact
                            render={props => <EngageAdd {...props} />}
                        />
                        <Route
                            path="/page/:id/engages/:engageId/builder"
                            exact
                            render={props => <EngageBuilder {...props} />}
                        />
                        <Route
                            path="/page/:id/engages/:engageId/broadcast-select"
                            exact
                            render={props => <BroadcastSelect {...props} />}
                        /> */}
                        <Route
                            path="/page/:id/workflows"
                            exact
                            render={props => <ListWorkflows {...props} />}
                        />
                        <Route
                            path="/page/:id/workflows/select-template"
                            exact
                            render={props => <SelectTemplate {...props} />}
                        />
                        <Route
                            path="/page/:id/workflows/add"
                            exact
                            render={props => <AddWorkflow {...props} />}
                        />
                        <Route
                            path="/page/:id/workflows/:engageId/edit"
                            exact
                            render={props => <EditWorkflow {...props} />}
                        />
                        <Route
                            path="/page/:id/workflows/:engageId/stats"
                            exact
                            render={props => <StatsWorkflow {...props} />}
                        />
                        <Route
                            path="/page/:id/triggers"
                            exact
                            render={props => <ListTriggers {...props} />}
                        />
                        <Route
                            path="/page/:id/triggers/add"
                            exact
                            render={props => <AddTriggers {...props} />}
                        />
                        <Route
                            path="/page/:id/triggers/:triggerId/edit"
                            exact
                            render={props => <AddTriggers {...props} />}
                        />
                        <Route
                            path="/page/:id/broadcasts"
                            exact
                            render={props => <ListBroadcasts {...props} />}
                        />
                        <Route
                            path="/page/:id/broadcasts/add/:type"
                            exact
                            render={props => <AddBroadcasts {...props} />}
                        />
                        <Route
                            path="/oauth/authorize"
                            exact
                            render={props => <Authorization {...props} />}
                        />
                        {/* <Route
                            path="/profile/:userId"
                            exact
                            render={props => <UserProfile {...props} />}
                        /> */}
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    auth: PropTypes.shape({
        currentUser: PropTypes.shape({
            facebookName: PropTypes.string,
            facebookProfileImage: PropTypes.string
        }),
        error: PropTypes.any,
        loading: PropTypes.bool,
        apiToken: PropTypes.string
    }).isRequired,
    actions: PropTypes.object.isRequired,
    pages: PropTypes.shape({
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        pages: PropTypes.array
    }).isRequired
};
export default connect(
    state => ({
        auth: state.default.auth,
        pages: state.default.pages
    }),
    dispatch => ({
        actions: bindActionCreators(
            {
                getPages,
                logout
            },
            dispatch
        )
    })
)(Home);
