import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import useLocalStorage from "hooks/useLocalStorage";
import { useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    makeStyles,
    Typography
} from "@material-ui/core";
import { Svg } from "../../../../Layout";

import './styles.scss';

const WelcomeDialog = (props) => {
    const { match } = props;
    const [hasSeen, setHasSeen] = useLocalStorage("page-intro-" + match.params.id, false);
    const [showModal, setShowModal] = useState(!hasSeen);

    useEffect(() => {
    }, []);

    const onClose = () => {
        setHasSeen(true);
        setShowModal(false);
    };

    const handleSeenClick = () => {
        setHasSeen(true);
        onClose();
    };

    return (
        <Dialog
            open={showModal}
            onClose={onClose}
            aria-labelledby="chat-title"
            maxWidth="lg"
        >
            <DialogContent className="welcome-dialog-container">
                <div className="welcome-title">Welcome to Chatmatic!</div>
                <div className="welcome-desc">Take a Quick read through our new system</div>
                <div className="welcome-item-container">
                    <Svg name="navbar-subscribers" />
                    <div className="welcome-item-content">
                        <div className="welcome-item-content-title">Subscribers</div>
                        <div className="welcome-item-content-desc">This is where you’ll see all of your subscribers and live chat once you start collecting subscribers</div>
                    </div>
                </div>
                <div className="welcome-item-container">
                    <Svg name="navbar-triggers" />
                    <div className="welcome-item-content">
                        <div className="welcome-item-content-title">Triggers</div>
                        <div className="welcome-item-content-desc">This is how you send messages and generate subscribers once you’ve built a workflow</div>
                    </div>
                </div>
                <div className="welcome-item-container">
                    <Svg name="navbar-broadcasts" />
                    <div className="welcome-item-content">
                        <div className="welcome-item-content-title">Broadcasts</div>
                        <div className="welcome-item-content-desc">Once you’ve built a list of subscribers this is where you send them email, sms, and messenger/ DM messages in bulk!</div>
                    </div>
                </div>
                <div className="welcome-item-container">
                    <Svg name="navbar-workflows" />
                    <div className="welcome-item-content">
                        <div className="welcome-item-content-title">Workflows</div>
                        <div className="welcome-item-content-desc">This is where you build your amazing sequences that you’ll use to generate subscribers and make sales</div>
                    </div>
                </div>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={handleSeenClick}
                    className="btn-welcome-dialog-lets-start"
                >
                    Let's Start Your Business
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default withRouter(WelcomeDialog);