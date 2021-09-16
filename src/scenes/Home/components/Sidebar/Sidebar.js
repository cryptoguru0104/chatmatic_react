import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import { NavLink, withRouter } from "react-router-dom";
import { Tooltip } from "@material-ui/core";

import iconActiveSub from "assets/images/icon-active-chat.png";
import iconDeactiveSub from "assets/images/icon-deactive-chat.png";
import iconActiveCampaign from "assets/images/icon-active-campaign.png";
import iconDeactiveCampaign from "assets/images/icon-deactive-campaign.png";
import iconActiveBroadcast from "assets/images/icon-active-engage.png";
import iconDeactiveBroadcast from "assets/images/icon-deactive-engage.png";
import iconActiveWorkflow from "assets/images/icon-active-workflow.png";
import iconDeactiveWorkflow from "assets/images/icon-deactive-workflow.png";
import trainingIcon from "assets/images/icon-training.png";
import iconDeactiveSettings from "assets/images/icon-deactive-settings.png";
import iconActiveSettings from "assets/images/icon-active-settings.png";
import PurchaseLicense from "../PurchaseLicense/PurchaseLicense";
import InstagramIcon from '@material-ui/icons/Instagram';
import { getBillingInfo } from "../../scenes/Settings/scenes/Billing/services/actions";

import { Svg, Block } from "../../Layout";
/** Import assets */
import "./sidebar.css";

class Sidebar extends React.Component {
    state = {
        showPages: false
    };

    componentDidMount() {
        this.initializePageInfo(this.props.match.params.id);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.initializePageInfo(nextProps.match.params.id);
        }
    }

    initializePageInfo(pageId) {
        if(pageId) {
            this.props.actions.getBillingInfo(parseInt(pageId, 10));
        }
    }

    
    togglePageDashboard = e => {
        e.preventDefault();
        this.props.history.push(`/page/${this.props.match.params.id}`);
    }

    togglePageMenu = e => {
        e.preventDefault();
        this.setState(({ showPages }) => ({
            showPages: !showPages
        }));
    };

    openPage = pageId => {
        this.setState(({ showPages }) => ({
            showPages: !showPages
        }));
        this.props.history.push(`/page/${pageId}`);
    };

    render() {
        const props = this.props;
        const { showPages } = this.state;
        const {
            pages: { pages }
        } = props;
        const id = props.match.params.id;

        let activePage = null;
        let inactivePages = pages;
        if (pages) {
            activePage = pages.find(p => p.uid === Number(id));
            inactivePages = pages.filter(p => p.uid !== Number(id));
        }

        return (
            <React.Fragment>
                <Menu {...props} menuClassName="shadow-sm sidebar-container">
                    <ul className="sidebar-menu-container card p-3 list-group list-group-flush text-center d-flex flex-column align-items-start shadow-sm">
                        {activePage && activePage.uid && (
                            <Tooltip
                                arrow
                                title={
                                    !!inactivePages && inactivePages.length > 0
                                        ? "Change Fan Page"
                                        : ""
                                }
                                placement="right"
                            >
                                <div
                                    to={`#`}
                                    id="menu-fanpage"
                                    className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
                                >
                                    <Block className="pn-img" onClick={this.togglePageDashboard}>
                                        {activePage.source === 'fb' && <img
                                            src={`https://graph.facebook.com/${activePage.fbId}/picture?type=small`}
                                            alt=""
                                            className="align-self-center"
                                        />}
                                        {activePage.source === 'ig' && <InstagramIcon style={{color:"black", fontSize:"40px"}}/>}
                                    </Block>
                                    <small className="mt-2">
                                        <h4 onClick={this.togglePageDashboard}>{activePage.fbName}</h4>
                                        <div className="btn-browse-pages"
                                            onClick={this.togglePageMenu}><i
                                            aria-hidden="true"
                                            className="triangle down icon"
                                        ></i>
                                        </div>
                                    </small>
                                </div>
                            </Tooltip>
                        )}

                        {showPages && <Block
                            className={`p-sidebar-main ${
                                showPages ? "show" : ""
                            }`}
                        >
                            {inactivePages &&
                                inactivePages.map(p => (
                                    <Block
                                        key={p.uid}
                                        className="p-sidebar-inner"
                                        onClick={() => this.openPage(p.uid)}
                                    >
                                        <Block className="pn-img">
                                            {p.source === 'fb' && <img
                                                src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                                                alt=""
                                                className="align-self-center"
                                            />}
                                            {p.source === 'ig' && <InstagramIcon style={{color:"black", fontSize:"40px"}}/>}
                                        </Block>
                                        <small className="mt-2">
                                            <h4>{p.fbName}</h4>
                                        </small>
                                    </Block>
                                ))}
                        </Block> }

                        {!showPages && <>
                        <NavLink
                            id="menu-subscribers"
                            activeClassName="active"
                            to={`/page/${id}/subscribers`}
                            className="list-group-item list-group-item-action d-flex flex-column"
                        >
                            <Svg name="navbar-subscribers" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Subscribers</small>
                        </NavLink>

                        {/* <Popup
                            trigger={<NavLink
                            activeClassName="active"
                            to={`/page/${id}/campaigns`}
                            className="list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={campaignIcon}
                                alt=""
                                className="align-self-center sidebar-nav-img"
                            />
                        </NavLink>}
                            content='CAMPAIGNS'
                            inverted
                            offset='-50px, 0px'
                            position='bottom left'
                            />
                            

                         <NavLink
                            activeClassName="active"
                            to={`/page/${id}/engages`}
                            className="list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={engageIcon}
                                alt=""
                                className="align-self-center sidebar-nav-img"
                            />
                            <small className="mt-2">ENGAGE</small>
                        </NavLink> */}

                        <NavLink
                            id="menu-triggers"
                            activeClassName="active"
                            to={`/page/${id}/triggers`}
                            className="list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <Svg name="navbar-triggers" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Triggers</small>
                        </NavLink>

                        <NavLink
                            id="menu-broadcasts"
                            activeClassName="active"
                            to={`/page/${id}/broadcasts`}
                            className="list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <Svg name="navbar-broadcasts" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Broadcasts</small>
                        </NavLink>
                        <NavLink
                            id="menu-workflows"
                            activeClassName="active"
                            to={`/page/${id}/workflows`}
                            className="list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <Svg name="navbar-workflows" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Workflows</small>
                        </NavLink>

                        <a
                            id="menu-training"
                            className="list-group-item mt-auto list-group-item-action d-flex flex-column"
                            href="https://members.chatmatic.com/training"
                            target="_blank"
                        >
                            <Svg name="navbar-trainings" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Training</small>
                        </a>
                        <NavLink
                            id="menu-settings"
                            activeClassName="active"
                            to={`/page/${id}/settings`}
                            className="list-group-item border-bottom-0 list-group-item-action d-flex flex-column border-top-0"
                        >
                            <Svg name="navbar-settings" className="sidebar-nav-img"></Svg>
                            <small className="mt-2">Settings</small>
                        </NavLink>
                        </>}
                    </ul>
                </Menu>
                <PurchaseLicense />
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect(
        state => ({
            // auth: state.default.auth,
            pages: state.default.pages
        }),
        dispatch => ({
            actions: bindActionCreators(
                {
                    // getPages,
                    getBillingInfo
                    // logout
                },
                dispatch
            )
        })
    )(Sidebar)
);
