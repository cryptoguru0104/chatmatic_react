import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "components";
/** Import components */
import {
    Navbar,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "components";
import { IconButton } from '@material-ui/core';
import { Svg } from '../../Layout';
import { logout } from "services/auth/authActions";
import UserProfile from "../../UserProfile";
/** Import assets */
import logo from "assets/images/logo.png";
import { profileImg as defaultImage } from "assets/images/subscriber.png";
import "./topNav.css";

class TopNav extends React.Component {
    state = {
        showApiKeyModal: false,
        showProfileModal: false
    };

    toggleShowApiKeyModal = () => {
        this.setState({ showApiKeyModal: !this.state.showApiKeyModal });
    };

    _showProfileModal = () => {
        this.setState({ showProfileModal: true});
    }

    _closeProfileModal = () => {
        this.setState({ showProfileModal: false});
    }

    render() {
        const userId = this.props.match.params.userId;
        const { showApiKeyModal, showProfileModal } = this.state;
        const { isSumoUser } = this.props;
        if (!this.props.currentUser) {
            return <Redirect to="/login" />;
        }
        const notificationAlert = 0, notificationMail = 0;

        const profileImg =
            this.props.currentUser.facebookProfileImage || defaultImage;
        const currentUserId = this.props.currentUser.userId;
        // const currentUserId = 23;
        return (
            <div className="top-nav">
                {showProfileModal && (
                    <UserProfile
                        userId={userId}
                        // userId={currentUserId}
                        open={showProfileModal}
                        close={this._closeProfileModal}
                    />
                )}
                <Navbar light expand className="shadow-sm bg-white p-0 h-100">
                    <Link className="navbar-brand" to="/dashboard">
                        <img
                            src={logo}
                            alt="ChatMatic"
                            className="top-nav-logo"
                        />
                    </Link>
                    <Nav className="ml-auto" navbar>
                        {/* <li className="nav-item mr-2">
                            <IconButton className="nav-item-btn-icon">
                                <Svg name="search" />
                            </IconButton>
                        </li> */}
                        <li className="nav-item mr-2">
                            <IconButton className="nav-item-btn-icon">
                                <Svg name="alarm" />
                                {notificationAlert > 0 && <div className="notification">{notificationAlert}</div>}
                            </IconButton>
                        </li>
                        {/* <li className="nav-item mr-4">
                            <IconButton className="nav-item-btn-icon">
                                <Svg name="support" />
                            </IconButton>
                        </li> */}
                        {/* <li className="nav-item mr-2">
                            <a
                                id="support-link"
                                href="http://members.chatmatic.com/support"
                                className="nav-link p-2"
                                target="_blank"
                            >
                                Support
                            </a>
                        </li> */}
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle id="profile-dropdown" nav caret>
                                <img
                                    src={profileImg}
                                    alt=""
                                    width={35}
                                    height={35}
                                    style={{ objectFit: "cover" }}
                                />
                            </DropdownToggle>

                            <DropdownMenu right>
                                <DropdownItem>
                                    <Link to="/dashboard">Dashboard</Link>
                                </DropdownItem>
                                <DropdownItem onClick={this._showProfileModal}>
                                        Profile
                                </DropdownItem>
                                <DropdownItem
                                    className="link"
                                    onClick={() => {
                                        this.setState({
                                            showApiKeyModal: true
                                        });
                                    }}
                                >
                                    API Key
                                </DropdownItem>
                                {isSumoUser && (
                                    <DropdownItem>
                                        <Link to="/appsumo_licenseinfo">
                                            My AppSumo Account
                                        </Link>
                                    </DropdownItem>
                                )}
                                <DropdownItem divider />
                                <DropdownItem
                                    onClick={this.props.actions.logout}
                                >
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <li className="nav-item ml-4 nav-user-name">
                            Hello,&nbsp;<b>{this.props.currentUser.facebookName}</b>
                        </li>
                    </Nav>
                </Navbar>
                <Modal
                    isOpen={showApiKeyModal}
                    toggle={this.toggleShowApiKeyModal}
                >
                    <ModalHeader toggle={this.toggleShowApiKeyModal}>
                        API Key
                    </ModalHeader>
                    <ModalBody>
                        <div>Your API Key:</div>
                        <div className="mb-3">{this.props.extApiToken}</div>
                        <div>
                            <a
                                className="text-underline"
                                href="https://kartrausers.s3.amazonaws.com/travisstephenson/5591355_1567705491851chatmatic_guide_to_using_zapier...pdf"
                                target="_blank"
                            >
                                Our Zapier Walkthrough Documentation
                            </a>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

TopNav.propTypes = {
    currentUser: PropTypes.any,
    actions: PropTypes.object.isRequired,
    extApiToken: PropTypes.string,
    isSumoUser: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    currentUser: state.default.auth.currentUser,
    extApiToken: state.default.pages.extApiToken,
    isSumoUser: state.default.pages.isSumoUser || false,
    userId: state.default.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            logout
        },
        dispatch
    )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopNav));
