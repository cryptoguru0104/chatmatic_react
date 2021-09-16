import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";
import Tour from "reactour";
import {
    Button,
    Box,
    Typography,
    IconButton,
    makeStyles,
    Tooltip
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";

import Grid from '@material-ui/core/Grid';


import Overview from "./components/Overview/Overview";
import Subscribers from "./components/Subscribers/Subscribers";
import NewDetails from "./components/NewDetails";

import { getPagePosts } from "services/pages/pagesActions";
import { getPageFromUrl } from "services/pages/selector";

import "./styles.css";
import { useEffect } from "react";
import { useState } from "react";
import AppSumoIntro from "./components/AppSumoIntro/AppSumoIntro";
import WelcomeDialog from "./components/WelcomeDialog";
const useStyles = makeStyles(theme => ({
    helpIcon: {
        position: "absolute",
        top: "0",
        left: "0"
    }
}));

const steps = [
    {
        content: ({ goTo, inDOM }) => (
            <Box px={2}>
                <Typography variant="h5">Chatmatic Tour</Typography>
                <p>
                    Click “Take The Tour” for a walkthrough of the different
                    sections
                </p>
                <p>
                    You can also use the ⬅️ and ➡️ keys on your keyboard to
                    navigate
                </p>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            goTo(1);
                        }}
                    >
                        Take The Tour
                    </Button>
                </div>
            </Box>
        )
    },

    {
        selector: "#menu-fanpage",
        content: ({ goTo, inDOM }) => (
            <Box px={2}>
                <Typography variant="h5">Fan Page</Typography>
                <p>This shows the Fan Page you’re currently working on….</p>
                <p>
                    To change your Fan Page click on the drop down arrow and
                    choose a different page
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-subscribers",
        content: (
            <Box px={2}>
                <Typography variant="h5">Subscribers</Typography>
                <p>Here is where you can manage your Subscribers.</p>
                <p>
                    Please Note: A Subscriber is someone who has engaged with
                    your Fan Page in Messenger while your page has been
                    connected to Chatmatic
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-triggers",
        content: (
            <Box px={2}>
                <Typography variant="h5">Triggers</Typography>
                <p>
                    Here is where you’ll turn your existing sequences
                    (workflows) into an active message on your Fan Page.
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-broadcasts",
        content: (
            <Box px={2}>
                <Typography variant="h5">Broadcasts</Typography>
                <p>
                    If you’d like to send a mass message to all of your
                    subscribers or a specific group of your subscribers you’ll
                    do so here.
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-workflows",
        content: (
            <Box px={2}>
                <Typography variant="h5">Workflows</Typography>
                <p>
                    Here is where you either create a new sequence or get one of
                    our pre-built Templates in our Marketplace, which can then
                    be used for a “Trigger” message.
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-training",
        content: (
            <Box px={2}>
                <Typography variant="h5">Training</Typography>
                <p>
                    This section will link you outside of Chatmatic to our
                    Accelerator training area…Note: You will need the login
                    details emailed to you upon purchasing your subscription.
                </p>
            </Box>
        )
    },
    {
        selector: "#menu-settings",
        content: (
            <Box px={2}>
                <Typography variant="h5">Settings</Typography>
                <p>
                    Here is where you’ll edit your Persistent Menu, manage your
                    Custom Fields & Tags, Templates, Integrations, Automations,
                    Admins, and Billing.
                </p>
            </Box>
        )
    },
    {
        selector: "#support-link",
        content: (
            <Box px={2}>
                <Typography variant="h5">Support</Typography>
                <p>
                    Clicking “Support” will allow you to submit a ticket to our
                    support team.
                </p>
            </Box>
        )
    },
    {
        selector: "#profile-dropdown",
        content: (
            <Box px={2}>
                <Typography variant="h5">Profile</Typography>
                <p>
                    Clicking on the drop-down arrow next to your Profile Image
                    will allow you to go back to the main Chatmatic dashboard,
                    view your Chatmatic Profile, grab your API Key, or logout.
                </p>
            </Box>
        )
    },
    {
        selector: "#page-help",
        content: (
            <Box px={2}>
                <p>
                    You can always come back to this walkthrough by clicking
                    here.
                </p>
            </Box>
        )
    }
];

function Page(props) {
    const { isSumoUser, match, page, error, getPagePosts, getBillingInfo } = props;
    const classes = useStyles();
    const [isTourOpen, setIsTourOpen] = useState(false);

    useEffect(() => {
        getPagePosts(parseInt(match.params.id, 10));
    }, [match.params.id]);

    useEffect(() => {
        !!error && toastr.error("Page Loading Error", error);
    }, [error]);

    useEffect(() => {
        if (page.loading == undefined) {
            return;
        }
        page.loading &&
            Swal({
                title: "Please wait...",
                text: "We are generating a listing of your pages...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        !page.isLoading && Swal.close();
    }, [page.loading]);

    const toggleTour = () => {
        setIsTourOpen(isTourOpen => !isTourOpen);
    };

    if (!page) {
        return <Redirect to="/404" />;
    }

    return (
        <>
            <div
                className="outer-main-padding"
                style={{ position: "relative" }}
            >
                <div className="fanpage-home-container mt-0">
                    <div className="d-flex flex-column">
                        <Grid container className="d-flex homepage-top-container" spacing={2}
                                data-aos="fade"
                                data-aos-delay="100">
                            <Grid item xs={12} sm={12} md={5}
                                className="d-flex align-items-stretch user-info-container"
                            >
                                <Overview />
                            </Grid>
                            <Grid item xs={12} sm={12} md={7}
                                className="d-flex align-items-stretch subscribers-chart-container"
                            >
                                <Subscribers />
                            </Grid>
                            <NewDetails />
                        </Grid>
                    </div>
                </div>
                <Tooltip
                    arrow
                    title="Click for a walkthrough"
                    placement="left-end"
                >
                    <IconButton
                        id="page-help"
                        color="primary"
                        aria-label="Walkthrough"
                        component="span"
                        onClick={toggleTour}
                        className={classes.helpIcon}
                    >
                        <HelpIcon />
                    </IconButton>
                </Tooltip>
            </div>
            {isTourOpen && (
                <Tour
                    steps={steps}
                    isOpen={isTourOpen}
                    onRequestClose={toggleTour}
                    lastStepNextButton={
                        <Button variant="contained" color="primary">
                            Finish
                        </Button>
                    }
                />
            )}
            {isSumoUser && <AppSumoIntro />}
            <WelcomeDialog />
        </>
    );
}

export default connect(
    (state, props) => ({
        page: getPageFromUrl(state, props),
        isSumoUser: state.default.pages.isSumoUser,
        error: state.default.pages.error
    }),
    dispatch => ({
        getPagePosts: bindActionCreators(getPagePosts, dispatch)
    })
)(Page);
