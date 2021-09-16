import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Form, Button, Input, Grid, Image, Popup } from "semantic-ui-react";
import Swal from "sweetalert2";

import { getPageWorkflows } from "services/workflows/workflowsActions";
import { Block, Svg } from "../Layout";
import { updateNewCampaignInfo } from "./services/actions";
import { sequenceGraph } from "assets/img";
import { getPagePosts } from "services/pages/pagesActions";
import { domainRegex } from "../scenes/Settings/scenes/Domains/components/Domains";
import { NumberAlphaRegex } from "services/utils";
import {
    Buttons,
    MDotMe,
    // AutoResponse,
    // Json,
    KeywordMessage,
    PrivateReplay,
    ChatWidget,
    HtmlModal,
    Welcomemsg
} from "./components";
import { getButtonHtml, getChatWidgetHtml } from "./services/CreateHtml";
import { triggerTypes } from "constants/AppConstants";
import { snakeCaseKeys } from "services/utils";
import {
    getDomains,
    updateDomains
} from "../scenes/Settings/scenes/Domains/services/actions";

class AddTriggers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "welcomemsg",
            triggerName: "",
            workflowUid: null,
            loading: false,
            saveTrigger: false,
            options: {},
            isOpenHtmlPopUp: false,
            triggerHtml: null,
            defaultOptions: {},
            isWelcomeMsg: false,
            isAutoResponse: false,
            trigger: null,
            htmlType: "html"
        };
    }

    //#region life cycle
    componentDidMount = () => {
        const triggerId = this.props.match.params.triggerId;
        this.props.actions.getPageWorkflows(this.props.match.params.id);
        this.props.actions.getPagePosts(this.props.match.params.id);
        this.getCurrentTrigger(Number(triggerId));
        this.props.actions.getDomains(this.props.match.params.id);

        const { triggers } = this.props;
        let isWelcomeMsg = false;
        let isAutoResponse = false;

        if (triggers && triggers.length > 0) {
            isWelcomeMsg = triggers.filter(
                t =>
                    t.type === triggerTypes.welcomemsg.type &&
                    t.uid !== triggerId
            ).length;
            isAutoResponse = triggers.filter(
                t =>
                    t.type === triggerTypes.autoresponse.type &&
                    t.uid !== triggerId
            ).length;
        }
        this.setState({
            isWelcomeMsg,
            isAutoResponse
        });
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { triggers } = nextProps;
        let isWelcomeMsg = false;
        let isAutoResponse = false;

        if (triggers && triggers.length > 0) {
            isWelcomeMsg = triggers.filter(
                t => t.type === triggerTypes.welcomemsg.type
            ).length;
            isAutoResponse = triggers.filter(
                t => t.type === triggerTypes.autoresponse.type
            ).length;
        }
        this.setState({
            isWelcomeMsg,
            isAutoResponse
        });

        const { loading, saveTrigger } = this.state;
        if (nextProps.loading && !loading && saveTrigger) {
            this.setState({ loading: true });
            this.loading();
        } else if (!nextProps.loading && loading) {
            Swal.close();
            this.setState(
                {
                    loading: false,
                    saveTrigger: false
                },
                () => {
                    if (nextProps.error) {
                        Swal.fire({
                            type: "error",
                            title: "Oops...",
                            text:
                                nextProps.error ||
                                "Something went wrong! Please try again."
                        });
                    } else {
                        this.postSave();
                    }
                }
            );
        }
    };
    //#endregion life cycle

    //#region functionality
    getCurrentTrigger = triggerId => {
        const { triggers } = this.props;
        if (triggers && triggers.length > 0) {
            const trigger = triggers.find(t => t.uid === triggerId);
            if (trigger) {
                this.setState({
                    triggerUid: triggerId,
                    type: trigger.type,
                    triggerName: trigger.triggerName,
                    workflowUid: trigger.workflowUid,
                    defaultOptions: trigger.options,
                    trigger
                });
                return trigger;
            }
        }

        Swal.fire({
            timer: 1500,
            type: "error",
            title: "Oops...",
            text: "Trigger doesn't exist"
        });

        this.props.history.push(`/page/${this.props.match.params.id}/triggers`);
    };

    closeHtmlModal = () => {
        this.setState({ isOpenHtmlPopUp: false, triggerHtml: null }, () => {
            this.props.history.push(
                `/page/${this.props.match.params.id}/triggers`
            );
        });
    };
    //#endregion

    //#region loaders
    loading = () => {
        Swal({
            title: "Please wait...",
            text: "We are updating trigger...",
            onOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    };
    //#endregion loaders

    //#region  post save triggers
    postSave = () => {
        console.log("workflow trigger created");
        Swal.fire({
            type: "success",
            title: "Success!",
            text: "Trigger has been saved",
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => {
            const { type, options } = this.state;
            let triggerHtml = null;
            let isOpenHtmlPopUp = false;
            let htmlType = "html";
            if (type === triggerTypes.buttons.type) {
                console.log("this.props.triggerInfo", this.props.triggerInfo);
                options.publicId = this.props.triggerInfo.publicId;
                triggerHtml = getButtonHtml(options);
                isOpenHtmlPopUp = true;
                // alert(triggerHtml);
            } else if (type === triggerTypes.json.type) {
                triggerHtml = JSON.stringify(
                    snakeCaseKeys(this.props.triggerInfo.jsonStep),
                    null,
                    2
                );
                console.log(triggerHtml);
                isOpenHtmlPopUp = true;
                htmlType = "json";
                // alert(triggerHtml);
            } else if (type === triggerTypes.chat_widget.type) {
                options.publicId = this.props.triggerInfo.publicId;
                triggerHtml = getChatWidgetHtml(options);
                isOpenHtmlPopUp = true;
            }
            this.setState(
                {
                    type: null,
                    triggerName: "",
                    workflowUid: null,
                    loading: false,
                    saveTrigger: false,
                    options: {},
                    triggerHtml,
                    isOpenHtmlPopUp,
                    isWorkflowsBlur: true,
                    htmlType
                },
                () => {
                    if (!isOpenHtmlPopUp) {
                        this.props.history.push(
                            `/page/${this.props.match.params.id}/triggers`
                        );
                    }
                }
            );
        }, 2000);
    };

    redirect = () => {};
    //#endregion post save triggers

    //#region handle Values
    handleType = type => {
        this.setState({
            type
        });
    };

    handleNameChange = triggerName => {
        this.setState({
            triggerName
        });
    };

    onSelectWorkflow = ({ uid }) => {
        // console.log('workflow', w);
        this.setState({
            workflowUid: uid
        });
    };

    updateOptions = options => {
        this.setState({
            options
        });
    };
    //#endregion handle values

    //#region save trigger
    checkValidations = trigger => {
        let isValid = true;
        const { triggerName, workflowUid, type, options } = trigger;
        if (!triggerName || (triggerName && !triggerName.trim())) {
            toastr.error(
                'You must supply a "Name" to this trigger before you can save it.'
            );
            return false;
        }

        if (type === triggerTypes.buttons.type) {
            const { redirectUrl } = options;
            if (!!redirectUrl && !domainRegex.test(redirectUrl)) {
                toastr.error(
                    "Invalid Redirect URL",
                    "Please enter a valid URL. inlcuding the protocol identifier (e.g. 'https://' or 'http://')"
                );
                isValid = false;
            }
            if (!isValid) {
                return false;
            }
        } else if (type === triggerTypes.m_dot_me.type) {
            if (this.state.options.isCustomRef) {
                if (
                    !options.customRef ||
                    !NumberAlphaRegex.test(options.customRef)
                ) {
                    toastr.error(
                        "Invalid Custom Ref",
                        "Please enter a valid Custom Ref. only Alphanumeric value is allowed"
                    );
                    isValid = false;
                }
            }
            if (!isValid) {
                return false;
            }
        } else if (type === triggerTypes.keywordmsg.type) {
            if (!options.keywords || options.keywords.length === 0) {
                toastr.error(
                    "Invalid Keywords",
                    "Please enter valid keywords."
                );
                isValid = false;
            }
            if (!isValid) {
                return false;
            }
        } else if (type === triggerTypes.post_trigger.type) {
            if (!options.postUid) {
                toastr.error("Invalid Post", "Please select a post.");
                isValid = false;
            }
            if (!isValid) {
                return false;
            }
        }

        if (!workflowUid) {
            toastr.error("You must select a workflow");
            return false;
        }

        return true;
    };

    createTriggerData = () => {
        const {
            triggerUid: uid,
            triggerName,
            workflowUid,
            type,
            options
        } = this.state;
        const trigger = {
            uid,
            triggerName,
            workflowUid,
            type
        };

        if (type === triggerTypes.buttons.type) {
            trigger.options = {
                redirectUrl: options.redirectUrl.trim() || null,
                color: options.color,
                size: options.size,
                uid: options.uid
            };
        } else if (type === triggerTypes.m_dot_me.type) {
            if (options.isCustomRef) {
                trigger.options = {
                    customRef: options.customRef.trim() || null,
                    uid: options.uid
                };
            } else {
                trigger.options = {
                    customRef: null,
                    uid: options.uid
                };
            }
        } else if (type === triggerTypes.keywordmsg.type) {
            trigger.options = options;
        } else if (type === triggerTypes.post_trigger.type) {
            trigger.options = options;
        } else if (type === triggerTypes.chat_widget.type) {
            trigger.options = options;
        }

        return trigger;
    };

    handleSave = () => {
        const trigger = this.createTriggerData();
        const isValid = this.checkValidations(trigger);
        if (isValid) {
            console.log("save trigger");
            // return false;
            this.setState(
                {
                    saveTrigger: true
                },
                () => {
                    this.props.actions.updateNewCampaignInfo(
                        this.props.match.params.id,
                        trigger,
                        true
                    );
                }
            );
        }
    };
    //#endregion save trigger

    addDomain = domainUrls => {
        this.props.actions.updateDomains(
            this.props.match.params.id,
            domainUrls
        );
    };

    render() {
        const {
            type,
            triggerName,
            workflowUid,
            isOpenHtmlPopUp,
            triggerHtml,
            defaultOptions,
            isWelcomeMsg,
            isAutoResponse,
            trigger,
            htmlType
        } = this.state;
        const { workflows: allWorkflows, loading } = this.props;
        // console.log('workflows =>', workflows);
        let workflows = allWorkflows;
        if (type === triggerTypes.json.type) {
            workflows = allWorkflows.filter(w => w.toJson);
        } else if (type === triggerTypes.post_trigger.type) {
            workflows = allWorkflows.filter(w => w.toPrivateRep);
        }

        return (
            <Block className="main-container trigger-container trigger-newo">
                <HtmlModal
                    html={triggerHtml}
                    open={isOpenHtmlPopUp}
                    close={this.closeHtmlModal}
                    htmlType={htmlType}
                />
                <Block className="trigger-aside-form">
                    <Form>
                        <h3 className="heading">Step One</h3>
                        <Form.Field className="">
                            <label className="no-padding">
                                Name Your Trigger
                            </label>
                            <Input
                                placeholder="Enter Name..."
                                type="text"
                                value={triggerName}
                                onChange={(e, { value }) =>
                                    this.handleNameChange(value)
                                }
                            />
                        </Form.Field>

                        <h4>Choose An Event That Will Trigger This Message</h4>
                        <Block className="step-1-pop-outer">
                            {isWelcomeMsg > 0 && (
                                <Block className="step-1-pop-hide">
                                    <Popup
                                        trigger={<Button icon="add" />}
                                        content="You are only allowed to add one welcome message at a time"
                                        // inverted
                                    />
                                </Block>
                            )}
                            {isAutoResponse > 0 && (
                                <Block className="step-1-pop-hide step-1-pop-hide-right">
                                    <Popup
                                        trigger={<Button icon="add" />}
                                        content="You are only allowed to add one autoresponse at a time"
                                        position="top right"
                                        // inverted
                                    />
                                </Block>
                            )}
                            <Block className="buttonsField left-sidebar-newo">
                                {Object.keys(triggerTypes).map(t => {
                                    if (
                                        triggerTypes[t].type ===
                                        triggerTypes.checkbox.type
                                    ) {
                                        return (
                                            <Popup
                                                content="Coming Soon"
                                                position="top center"
                                                trigger={
                                                    <Button
                                                        key={
                                                            triggerTypes[t].type
                                                        }
                                                        className="btn-default btn-disabled"
                                                        style={{
                                                            cursor: "default",
                                                            opacity: 0.5
                                                        }}
                                                    >
                                                        <Block className="sidebar-list-img">
                                                            <span>
                                                                <Image
                                                                    src={
                                                                        triggerTypes[
                                                                            t
                                                                        ].icon
                                                                    }
                                                                    className="wel"
                                                                />
                                                            </span>
                                                            <p>
                                                                {
                                                                    triggerTypes[
                                                                        t
                                                                    ].text
                                                                }
                                                            </p>
                                                        </Block>
                                                    </Button>
                                                }
                                            />
                                        );
                                    } else {
                                        return (
                                            <Button
                                                key={triggerTypes[t].type}
                                                className={`btn btn-default ${
                                                    triggerTypes[t].type ===
                                                    type
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    this.handleType(
                                                        triggerTypes[t].type
                                                    )
                                                }
                                                disabled={
                                                    (triggerTypes[t].type ===
                                                        triggerTypes.welcomemsg
                                                            .type &&
                                                        trigger &&
                                                        trigger.type !==
                                                            triggerTypes
                                                                .welcomemsg
                                                                .type &&
                                                        isWelcomeMsg > 0) ||
                                                    (triggerTypes[t].type ===
                                                        triggerTypes
                                                            .autoresponse
                                                            .type &&
                                                        trigger &&
                                                        trigger.type !==
                                                            triggerTypes
                                                                .autoresponse
                                                                .type &&
                                                        isAutoResponse > 0)
                                                }
                                            >
                                                <Block className="sidebar-list-img">
                                                    <span>
                                                        <Image
                                                            src={
                                                                triggerTypes[t]
                                                                    .icon
                                                            }
                                                            className="wel"
                                                        />
                                                    </span>
                                                    <p>
                                                        {triggerTypes[t].text}
                                                    </p>
                                                </Block>
                                            </Button>
                                        );
                                    }
                                })}
                            </Block>
                        </Block>

                        {(isWelcomeMsg > 0 || isAutoResponse > 0) && (
                            <Block>
                                <span style={{ color: "#969696" }}>
                                    <strong>Note:</strong> You are only allowed
                                    to add one welcome message at a time and one
                                    autoresponse at a time.
                                </span>
                            </Block>
                        )}

                        {/*<Button type="submit" className="primary">
                Next
            </Button>

            {/*<Divider section />

              <h3 className="heading">Step Two</h3>
            <Block className="messageBlockMain"> 
                <label>Choose From Existing Sequence</label>
                <Select
                    placeholder="Select..."
                    options={countryOptions}
                />
            </Block>
            {/* <Block className="messageBlockMain">
                <Input placeholder='Super Long Test Name For Sequence' value="Super Long Test Name For Sequence" />
            </Block> */}

                        {/*<p>Or Create A New Sequence</p>
            <Button type="submit" className="primary">
                Create New Sequence
            </Button>*/}
                    </Form>
                </Block>

                <Block className="inner-box-main">
                    <h2 className="title-head mb-4">
                        {/* SELECT EXISTING OR CREATE NEW WORKFLOW */}
                        Select Workflow
                    </h2>
                    <Block className="trigger-main-left">
                        <Grid columns={2} className="grid-inner-block">
                            <Grid.Column>
                                <Block className="sequence-inner add-new-workflow">
                                    <Block className="add-plus-icon-outer">
                                        <Block className="add-plus-icon-inner">
                                            <Svg name="plus" />
                                        </Block>
                                    </Block>
                                    <h3 className="sq-title">
                                        Add New Work Flow
                                    </h3>
                                </Block>
                            </Grid.Column>
                            {workflows &&
                                workflows.length > 0 &&
                                workflows.map(w => (
                                    <Grid.Column
                                        key={w.uid}
                                        onClick={() => this.onSelectWorkflow(w)}
                                    >
                                        <Block
                                            className={`sequence-inner ${
                                                workflowUid === w.uid
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            {/*<h6 className="sq-titlesm">
                          Last edited <span>04/03</span>
                      </h6>*/}
                                            <h3 className="sq-title">
                                                {w.name}
                                            </h3>
                                            <Image
                                                src={sequenceGraph}
                                                size="huge"
                                                className="graph"
                                            />
                                        </Block>
                                    </Grid.Column>
                                ))}
                        </Grid>
                    </Block>

                    {/* <Block className="paginationCol">
            <Pagination
              defaultActivePage={1}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              totalPages={3}
            />
          </Block> */}
                </Block>

                <Block
                    className={`trigger-aside-form trigger-aside-right ${
                        workflowUid ? "open" : ""
                    }`}
                >
                    <Form className="d-flex">
                        <Block className="buttonsField left-sidebar-newo">
                            {type === triggerTypes.welcomemsg.type && (
                                <Welcomemsg />
                            )}
                            {type === triggerTypes.m_dot_me.type && (
                                <MDotMe
                                    updateOptions={this.updateOptions}
                                    defaultOptions={defaultOptions}
                                />
                            )}
                            {type === triggerTypes.buttons.type && (
                                <Buttons
                                    updateOptions={this.updateOptions}
                                    defaultOptions={defaultOptions}
                                />
                            )}
                            {/* {type === triggerTypes.json.type && <Json />} */}
                            {type === triggerTypes.keywordmsg.type && (
                                <KeywordMessage
                                    updateOptions={this.updateOptions}
                                    defaultOptions={defaultOptions}
                                />
                            )}
                            {type === triggerTypes.post_trigger.type && (
                                <PrivateReplay
                                    updateOptions={this.updateOptions}
                                    defaultOptions={defaultOptions}
                                />
                            )}
                            {type === triggerTypes.chat_widget.type && (
                                <ChatWidget
                                    updateOptions={this.updateOptions}
                                    defaultOptions={defaultOptions}
                                    addDomain={this.addDomain}
                                />
                            )}

                            <Form.Field className="mt-auto">
                                <Button
                                    onClick={this.handleSave}
                                    className="btn btn-default blue-bg"
                                    loading={loading}
                                >
                                    Update & Finish
                                </Button>
                            </Form.Field>
                        </Block>
                    </Form>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = state => ({
    workflows: state.default.workflows.workflows,
    loading: state.default.scenes.campaignAdd.loading,
    error: state.default.scenes.campaignAdd.error,
    triggers: state.default.campaigns.campaigns,
    triggerInfo: state.default.scenes.campaignAdd.campaignAdd
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflows,
            updateNewCampaignInfo,
            getPagePosts,
            getDomains,
            updateDomains
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AddTriggers)
);
