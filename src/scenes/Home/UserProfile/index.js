import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    getUserProfile,
    saveUserInfo,
    getUserFollowInfo,
    followUser,
    getUserTemplateInfo,
    getUserSalesInfo
} from "./services/actions";
import UserIcon from "assets/images/user.png";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Block, Svg } from "../Layout";
import { Grid, Button } from "@material-ui/core";
import UserInfo from "./components/UserInfo";
import SocialLinks from "./components/SocialLinks";
import FollowButtons from "./components/FollowButtons";
import Echo from "laravel-echo";
import NumericalInfo from "./components/NumericalInfo";
import ListTemplates from "./components/ListTemplates";
import SalesChart from "./components/SalesChart";
import { Grid as MuiGrid } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";

import "./style.scss";

class UserProfile extends React.Component {
    _echo;
    constructor(props) {
        super(props);
        this.state = {
            user: {
                profileImage: null,
                name: null,
                email: null
            },
            isAdmin: false,
            followInfo: null,
            newNotification: {}
        };

        this._echo = new Echo({
            broadcaster: "pusher",
            key: process.env.REACT_APP_PUSHER_API_KEY,
            authEndpoint: `${process.env.REACT_APP_API_URL}/pusher/auth`,
            auth: {
                headers: {
                    Authorization: `Token ${this.props.apiToken}`,
                    Accept: "application/json"
                }
            },
            cluster: "us2",
            forceTLS: true
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            user,
            loading,
            error,
            followInfo,
            templateInfo,
            salesInfo
        } = nextProps;

        let salesChartData = {};
        if (!!salesInfo && !!salesInfo.salesByMonth) {
            salesInfo.salesByMonth.map(s => {
                salesChartData[
                    moment()
                        .year(s.year)
                        .month(s.month - 1)
                        .format("YYYY MM")
                ] = s.data;
            });
        }
        const totalSales = !!salesInfo && salesInfo.totalSales;

        this.setState({
            user,
            followInfo,
            templateInfo,
            salesChartData,
            totalSales
        });
        if (!!nextProps.currentUser) {
            const userId = nextProps.userId;
            if (nextProps.currentUser.userId + "" === userId + "")
                this.setState({ isAdmin: true });
            else this.setState({ isAdmin: false });
        }
        console.log("user", user, "loading", loading);
        if ((!user || (user && Object.keys(user).length === 0)) && loading) {
            Swal({
                title: "Please wait...",
                text: "We are loading user data...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && error) {
            Swal.fire({
                type: "error",
                name: "Oops...",
                text: error || "Something went wrong! Please try again."
            });
        } else {
            this.setState({ editableUserInfo: false });
            Swal.close();
        }
    }

    componentDidMount() {
        const userId = this.props.userId;
        this.props.actions.getUserProfile(userId);
        this.props.actions.getUserFollowInfo(userId);
        this.props.actions.getUserTemplateInfo(userId);
        this.props.actions.getUserSalesInfo(userId);

        this._echo.private(`App.User.${userId}`).notification(data => {
            console.log("echo: ", data);
        });

    }

    handleSaveUserInfo = editUser => {
        const userId = this.props.userId;
        const { user } = this.state;
        console.log("editUser: ", editUser);
        this.props.actions.saveUserInfo(userId, { ...user, ...editUser });
    };

    handleFollow = () => {
        const userId = this.props.userId;
        this.props.actions.followUser(userId);
    };

    render() {
        const {
            user,
            isAdmin,
            followInfo,
            templateInfo,
            salesChartData,
            totalSales
        } = this.state;
        const profileImg = user && user.profileImage;
        console.log("isAdmin: ", isAdmin);

        const isFollowed =
            !!followInfo &&
            !!followInfo.followers &&
            followInfo.followers.filter(
                element =>
                    !!this.props.currentUser &&
                    element.follower_uid + "" ===
                        this.props.currentUser.userId + ""
            ).length > 0;

            return (
                <React.Fragment>
                    <Dialog
                        maxWidth="xl"
                        fullWidth={true}
                        className="custom-popup mac-height preview-template-modal-container"
                        open={this.props.open}
                        onClose={this.props.close}
                    >
                        {!!user ? (<DialogContent>
                            <Grid container justify="flex-end">
                                <Button onClick={this.props.close} className="btn-close">
                                    <Svg name="modal-close" />
                                </Button>
                            </Grid>
                            <hr />
                            <Block className="d-flex flex-column profile-content">
                                <Block className="d-flex user-information">
                                    <Block className="avatar-container">
                                        {profileImg && (
                                            <img className="user-avatar" src={profileImg} />
                                        )}
                                        {!profileImg && (
                                            <img className="user-avatar" src={UserIcon} />
                                        )}
                                    </Block>
                                    <Block className="user-information-section">
                                        <UserInfo
                                            user={user}
                                            pageEditable={isAdmin}
                                            saveUser={this.handleSaveUserInfo}
                                        />
                                        <FollowButtons
                                            isAdmin={isAdmin}
                                            followInfo={followInfo}
                                            onFollow={this.handleFollow}
                                            isFollowed={isFollowed}
                                        />
                                    </Block>
                                    <SocialLinks
                                            user={user}
                                            pageEditable={isAdmin}
                                            saveUser={this.handleSaveUserInfo}
                                    />
                                </Block>
                                <hr/>
                                <Block className="d-flex flex-column user-statistics">
                                    <h2>My Templates</h2>
                                    {templateInfo ? (
                                    <Block className="numerical-information">
                                        <NumericalInfo templateInfo={templateInfo} />
                                    </Block>
                                    ) : null}
                                    <MuiGrid item className="d-flex statistics-container" xs={12}>
                                        <MuiGrid container spacing={1}>
                                            <Grid item xs={6} xm={4}>
                                            <Block className="templates-view">
                                            {!!templateInfo &&
                                                !!templateInfo.templates ? (
                                                    <ListTemplates
                                                        templates={templateInfo.templates}
                                                    />
                                                ) : null}
                                            </Block>
                                            </Grid>
                                            <Grid item xs={6} xm={4}>
                                            <Block className="graph-view">
                                                <SalesChart
                                                    chartData={salesChartData}
                                                    totalSales={totalSales}
                                                />
                                            </Block>
                                            </Grid>
                                        </MuiGrid>
                                    </MuiGrid>
                                </Block>
                            </Block>
                        </DialogContent>): null}
                    </Dialog>
                </React.Fragment>
            );
    }
}

const mapStateToProps = state => ({
    apiToken: state.default.auth.apiToken,
    user: state.default.scenes.userProfile.userProfile,
    loading: state.default.scenes.userProfile.loading,
    error: state.default.scenes.userProfile.error,
    followInfo: state.default.scenes.userProfile.followInfo,
    templateInfo: state.default.scenes.userProfile.templateInfo,
    salesInfo: state.default.scenes.userProfile.salesInfo,
    currentUser: state.default.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getUserProfile,
            saveUserInfo,
            getUserFollowInfo,
            followUser,
            getUserTemplateInfo,
            getUserSalesInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
