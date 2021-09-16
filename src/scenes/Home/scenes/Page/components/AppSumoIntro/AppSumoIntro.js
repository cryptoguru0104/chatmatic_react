import React, { useState } from "react";
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
import WistiaEmbed from "./WistiaEmbed";

const useStyles = makeStyles(theme => ({
    content: {
        maxWidth: "624px"
    },
    mainVideo: {
        background: "#ECF0F3",
        borderRadius: "8px",
        width: "576px",
        height: "320px"
    }
}));

const AppSumoIntro = () => {
    const [hasSeen, setHasSeen] = useLocalStorage("appsumo_intro", false);
    const [showModal, setShowModal] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        console.log("hasSeen", hasSeen);
        !hasSeen && setShowModal(true);
        //setHasSeen(true);
    }, []);

    const onClose = () => {
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
            <DialogTitle>
                <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                >
                    <Typography align="center" variant="h3">
                        Welcome &#9996; AppSumo Members - <br />
                        Please Watch This{" "}
                        <span style={{ color: "#3350EE" }}>IMPORTANT</span>{" "}
                        Video!
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent className={classes.content}>
                <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                    mb={2}
                >
                    <Box className={classes.mainVideo}>
                        <WistiaEmbed embedId="ch4pkk509z" />
                    </Box>
                </Box>
                <Box pb={3}>
                    <Box mb={1} textAlign="center">
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            size="large"
                            href="https://pro.chatmatic.com/bblive"
                            target="_blank"
                        >
                            Click Here For More Info
                        </Button>
                    </Box>
                    <Box mb={1} textAlign="center">
                        <a
                            // variant="link"
                            // color="primary"
                            href="https://www.facebook.com/travisincome/photos/gm.1444009365965737/4297940080263372"
                            target="_blank"
                        >
                            And To See An Informal Roadmap, Click Here
                        </a>
                    </Box>
                    <Typography variant="h4" marginBottom={2} mb={3}>
                        Video Name
                    </Typography>
                    <Typography>
                        We now have a “Save” option to allow you to save AS you
                        are building a sequence, before you’re completely
                        finished.
                    </Typography>
                </Box>
                <Box
                    display={"flex"}
                    justifyContent="space-between"
                    alignItems={"center"}
                >
                    <Box>
                        <Box mb={1}>
                            <iframe
                                width="182"
                                height="102"
                                src="https://www.youtube.com/embed/HbE9ps9wzI8"
                                title="Chatmatic Walkthrough Training Video 1"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </Box>
                        <Typography variant="h5">Walkthrough 1</Typography>
                    </Box>
                    <Box>
                        <Box mb={1}>
                            <iframe
                                width="182"
                                height="102"
                                src="https://www.youtube.com/embed/ntbC95XzCTU"
                                title="Chatmatic Walkthrough Training Video 2"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </Box>
                        <Typography variant="h5">Walkthrough 2</Typography>
                    </Box>
                    <Box>
                        <Box mb={1}>
                            <iframe
                                width="182"
                                height="102"
                                src="https://www.youtube.com/embed/Nx2Dw5duFDk"
                                title="Chatmatic Walkthrough Training Video 3"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </Box>
                        <Typography variant="h5">Walkthrough 3</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <Box
                display={"flex"}
                flexDirection="column"
                alignItems={"center"}
                justifyContent="center"
                py={4}
            >
                <Box mb={1}>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        size="large"
                        href="https://www.facebook.com/groups/chatmatic"
                        target="_blank"
                    >
                        View More Videos
                    </Button>
                </Box>
                <Button
                    variant={"link"}
                    color={"primary"}
                    size="large"
                    onClick={handleSeenClick}
                    mr={2}
                >
                    Don't show me this again
                </Button>
            </Box>
        </Dialog>
    );
};

export default AppSumoIntro;
