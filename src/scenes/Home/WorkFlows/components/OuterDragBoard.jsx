import React, { Component } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { isValidPhoneNumber } from "react-phone-number-input";
import { Tooltip } from "@material-ui/core";

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';


import DragBoard from "./DragBoard";
import { Svg, Block } from "../../Layout";
import { getEngageAddState } from "../../scenes/EngageAdd/services/selector";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
    updateEngageInfo,
    updateItemInfo,
    updateStepInfo
} from "../../scenes/EngageAdd/services/actions";
// import uuid from 'uuid/v4';
import {
    parseToArray,
    cloneObject,
    isValidUrl
} from "../../../../services/utils";
import { conditionBuilderTransformer } from "services/workflows/transformers";

//#region Constants
const validActions = [
    "btn",
    "btn-qr",
    "btn-dy",
    "btn-rd",
    "btn-ur",
    "btn-fb",
    "btn-cd",
    "btn-sms",
    "btn-smtp",
    "btn-cr",
    "btn-ui"
];
//#endregion

class OuterDragBoard extends Component {
    constructor(props) {
        super(props);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.state = {
            scale: 1,
            maxScale: 1.8,
            minScale: 0.2,
            data: [],
            autoArrange: false,
            delModal: false,
            name: this.props.name || this.props.workflowName || "",
            updatedAt: null,
            workflowType: urlParams.get("type"),
        };
        this.updateNextStep = this.updateNextStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.flow = [];
        this.hasPosition = true;
        this.refresh = false;
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        if (this.props.name !== nextProps.name) {
            this.setState({
                name: nextProps.name
            });
        }
        if (this.props.workflowName !== nextProps.workflowName) {
            this.setState({
                name: nextProps.workflowName
            });
        }
    };

    createData = () => {
        const { steps } = this.props;
        // const { data } = this.state;
        // console.log('steps =>', steps);
        const flow = steps.map((s, i) => {
            const left = i === 0 ? 60 : 340 * i + 60 * (i + 1);
            const flowObj = {
                ...s,
                id: s.stepUid.toString(),
                top: s.position && s.position.y ? Number(s.position.y) : 150,
                left: s.position && s.position.x ? Number(s.position.x) : left,
                parents: [],
                children: [],
                allChildren: [],
                actions: [],
                nextStepUid: s.nextStepUid || s.childUid,
                stepType: s.type || s.stepType
            };

            if (
                this.props.stats &&
                this.props.workflowStats &&
                this.props.workflowStats.steps &&
                this.props.workflowStats.steps.length > 0
            ) {
                flowObj.stepStats = this.props.workflowStats.steps.find(
                    ws => ws.uid === flowObj.stepUid
                );
            }

            const element = document.getElementById(flowObj.id);
            if (element) {
                flowObj.left = element.offsetLeft || flowObj.left;
                flowObj.top = element.offsetTop || flowObj.top;
            }
            return flowObj;
        });

        // add parent ids
        this.hasPosition = true;
        flow.forEach((s, i) => {
            const items = s.options || s.items;
            if (items && items.length) {
                items.forEach(item => {
                    const actionBtns = item.actionBtns;
                    if (actionBtns && actionBtns.length) {
                        actionBtns.forEach(actionBtn => {
                            const nextId = actionBtn.nextStepUid;
                            if (nextId) {
                                const ind = flow.findIndex(
                                    step => step.id == nextId
                                );
                                const actionId = `btn_${actionBtn.uid}_${item.uid}_${s.id}`;
                                if (ind !== -1) {
                                    flow[ind].parents.push(actionId);
                                    flow[i].allChildren.push(nextId);
                                    flow[i].actions.push({
                                        actionId,
                                        child: nextId
                                    });
                                }
                            }
                        });
                    }
                    if (s.stepType === "randomizer") {
                        const nextId = item.nextStepUid;
                        if (nextId) {
                            const ind = flow.findIndex(
                                step => step.id == nextId
                            );
                            const actionId = `btn-rd_${item.uid}_${s.id}`;
                            if (ind !== -1) {
                                flow[ind].parents.push(actionId);
                                flow[i].allChildren.push(nextId);
                                flow[i].actions.push({
                                    actionId,
                                    child: nextId,
                                    type: "RD"
                                });
                            }
                        }
                    }
                    if (item.type === "free_text_input") {
                        const nextId = item.nextStepUid;
                        if (nextId) {
                            const ind = flow.findIndex(
                                step => step.id == nextId
                            );
                            const actionId = `btn-ui_${item.uid}_${s.id}`;
                            if (ind !== -1) {
                                flow[ind].parents.push(actionId);
                                flow[i].allChildren.push(nextId);
                                flow[i].actions.push({
                                    actionId,
                                    child: nextId,
                                    type: "UI"
                                });
                            }
                        }
                    }
                    if (item.type === "carousel") {
                        item.items.forEach(cItem => {
                            const cActionBtns = cItem.actionBtns;
                            if (cActionBtns && cActionBtns.length) {
                                cActionBtns.forEach(cActionBtn => {
                                    const nextId = cActionBtn.nextStepUid;
                                    if (nextId) {
                                        const ind = flow.findIndex(
                                            step => step.id == nextId
                                        );
                                        const actionId = `btn-cr_${cItem.uid}_${s.id}`;
                                        if (ind !== -1) {
                                            flow[ind].parents.push(actionId);
                                            flow[i].allChildren.push(nextId);
                                            flow[i].actions.push({
                                                actionId,
                                                child: nextId,
                                                type: "CR"
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
            const quickReplies = s.quickReplies;
            if (quickReplies && quickReplies.length) {
                quickReplies.forEach(qr => {
                    const nextId = qr.nextStepUid;
                    if (nextId) {
                        const ind = flow.findIndex(step => step.id == nextId);
                        const actionId = `btn-qr_${qr.uid}_${s.id}`;
                        if (ind !== -1) {
                            flow[ind].parents.push(actionId);
                            flow[i].allChildren.push(nextId);
                            flow[i].actions.push({
                                actionId,
                                child: nextId,
                                type: "QR"
                            });
                        }
                    }
                });
            }

            if (s.stepType === "sms") {
                const userReplies = s.userReplies;
                if (userReplies && userReplies.length) {
                    userReplies.forEach(ur => {
                        const nextId = ur.nextStepUid;
                        if (nextId) {
                            const ind = flow.findIndex(
                                step => step.id == nextId
                            );
                            const actionId = `btn-ur_${ur.uid}_${s.id}`;
                            if (ind !== -1) {
                                flow[ind].parents.push(actionId);
                                flow[i].allChildren.push(nextId);
                                flow[i].actions.push({
                                    actionId,
                                    child: nextId,
                                    type: "UR"
                                });
                            }
                        }
                    });
                }
                if (s.fallBack) {
                    const nextId = s.fallBack.nextStepUid;
                    if (nextId) {
                        const ind = flow.findIndex(step => step.id == nextId);
                        const actionId = `btn-fb_${s.fallBack.uid}_${s.id}`;
                        if (ind !== -1) {
                            flow[ind].parents.push(actionId);
                            flow[i].allChildren.push(nextId);
                            flow[i].actions.push({
                                actionId,
                                child: nextId,
                                type: "FB"
                            });
                        }
                    }
                }
            }
            if (s.stepType === "smtp") {
                const userReplies = s.userReplies;
                if (userReplies && userReplies.length) {
                    userReplies.forEach(ur => {
                        const nextId = ur.nextStepUid;
                        if (nextId) {
                            const ind = flow.findIndex(
                                step => step.id == nextId
                            );
                            const actionId = `btn-ur_${ur.uid}_${s.id}`;
                            if (ind !== -1) {
                                flow[ind].parents.push(actionId);
                                flow[i].allChildren.push(nextId);
                                flow[i].actions.push({
                                    actionId,
                                    child: nextId,
                                    type: "UR"
                                });
                            }
                        }
                    });
                }
                if (s.fallBack) {
                    const nextId = s.fallBack.nextStepUid;
                    if (nextId) {
                        const ind = flow.findIndex(step => step.id == nextId);
                        const actionId = `btn-fb_${s.fallBack.uid}_${s.id}`;
                        if (ind !== -1) {
                            flow[ind].parents.push(actionId);
                            flow[i].allChildren.push(nextId);
                            flow[i].actions.push({
                                actionId,
                                child: nextId,
                                type: "FB"
                            });
                        }
                    }
                }
            }
            if (s.stepType === "conditions") {
                const ifElseBlocks = s.ifElseBlocks;
                if (ifElseBlocks && ifElseBlocks.length) {
                    ifElseBlocks.forEach(cd => {
                        const nextId = cd.nextStepUid;
                        if (nextId) {
                            const ind = flow.findIndex(
                                step => step.id == nextId
                            );
                            const actionId = `btn-cd_${cd.uid}_${s.id}`;
                            if (ind !== -1) {
                                flow[ind].parents.push(actionId);
                                flow[i].allChildren.push(nextId);
                                flow[i].actions.push({
                                    actionId,
                                    child: nextId,
                                    type: "CD"
                                });
                            }
                        }
                    });
                }
            }

            if (s.nextStepUid) {
                const nextId = s.nextStepUid;
                const ind = flow.findIndex(step => step.id == nextId);
                let actionId = s.id;
                let action = {
                    child: nextId
                };
                if (s.stepType === "conditions") {
                    actionId = `btn-cd_${s.id}`;
                    action = { ...action, actionId, type: "CD" };
                    flow[i].actions.push(action);
                } else if (s.stepType === "delay") {
                    actionId = `btn-dy_${s.id}`;
                    action = { ...action, actionId, type: "DY" };
                    flow[i].actions.push(action);
                } else if (s.stepType === "sms") {
                    actionId = `btn-sms_${s.id}`;
                    action = { ...action, actionId, type: "SMS" };
                    flow[i].actions.push(action);
                } else {
                    flow[i].children.push(nextId);
                }
                if (ind !== -1) {
                    if (s.stepType === "items") {
                        flow[i].allChildren.unshift(nextId);
                    } else {
                        flow[i].allChildren.push(nextId);
                    }
                    flow[ind].parents.push(actionId);
                }
            }

            if (s.top === 0 && s.left === 0) {
                this.hasPosition = false;
            }

            // add positions for new step
            // console.log('s.position', s.position, s);
            if (
                s.position &&
                s.position.x === 0 &&
                s.position.y === 0 &&
                s.parents &&
                s.parents.length === 1
            ) {
                let btnTop = s.top;
                const elementId = s.parents[0];
                // console.log('elementId', elementId);
                if (document.getElementById(elementId)) {
                    let top = 0,
                        left = 0;
                    let id = s.parents[0];
                    if (elementId.includes("btn")) {
                        const idArr = elementId.split("_");
                        id = idArr[idArr.length - 1];
                        btnTop = document.getElementById(elementId).offsetTop;
                    }
                    const parent = document.getElementById(id);
                    top = parent.offsetTop + 50 + btnTop;
                    const parentLeft = parent.offsetLeft;
                    const parentWidth = parent.offsetWidth;
                    left = parentLeft + parentWidth + 200;
                    const currentStep = steps[i];
                    const position = {
                        x: left,
                        y: top
                    };
                    currentStep.position = position;
                    flow[i].position = position;
                    flow[i].left = left;
                    flow[i].top = top;
                    // console.log('position', position);
                } else {
                    this.refresh = true;
                }
            }
        });

        this.flow = flow;
        // console.log('flow =>', this.flow);
        return this.flow;
    };

    handleRefresh = () => {
        this.refresh = false;
        this.setState({ updatedAt: Date.now() });
    };

    handleFlow = data => {
        this.setState({ data, autoArrange: false });
        if (this.props.autoSaveWorkflow) {
            this.props.autoSaveWorkflow({ name: this.state.name });
        }
    };

    handleScale = type => () => {
        let { maxScale, minScale, scale } = this.state;
        if (type === "add") {
            if (scale < maxScale) {
                scale = Number((scale + 0.2).toFixed(1));
                if (scale > maxScale) {
                    scale = maxScale;
                }
            }
        } else {
            if (scale > minScale) {
                scale = Number((scale - 0.2).toFixed(1));
                if (scale < minScale) {
                    scale = minScale;
                }
            }
        }
        this.setState({ scale });
    };

    // manage workflow scale
    findAndSetScale = scale => {
        this.setState({ scale });
    };

    // create auto positions for steps
    handleAutoArrange = () => {
        // console.log('handleAutoArrange');
        const data = this.autoArrange([...this.flow]);

        this.setState({
            data,
            autoArrange: true
        });
    };

    autoArrange = data => {
        const positions = [];
        const firstStep = data[0];
        firstStep.left = 60;
        firstStep.top = 150;
        positions.push({ id: firstStep.id, x: 60, y: 150 });

        // let e = 0;
        const arranged = [];
        const arrangeAllChildren = parentId => {
            // console.log('parentId', parentId);
            const parent = data.find(step => step.id == parentId);
            let left = parent.left + 230 + 340;
            let pTop = 0;
            let pHeight = 0;
            parent.allChildren.forEach((id, j) => {
                const ind = data.findIndex(step => step.id == id);
                const posInd = positions.findIndex(step => step.id == id);
                // console.log('AR => ', data[ind].name);
                if (ind !== -1) {
                    let top = 150;
                    if (posInd === -1) {
                        if (j === 0) {
                            top = this.getPositionY(
                                positions,
                                left,
                                top,
                                data[ind].id
                            );
                            data[ind].left = left;
                            data[ind].top = top;
                            positions.push({
                                id: data[ind].id,
                                x: left,
                                y: top
                            });
                        } else {
                            top = pTop + pHeight + 30;
                            top = this.getPositionY(
                                positions,
                                left,
                                top,
                                data[ind].id
                            );
                            data[ind].left = left;
                            data[ind].top = top;
                            positions.push({
                                id: data[ind].id,
                                x: left,
                                y: top
                            });
                        }
                        pTop = top;
                        pHeight = document.getElementById(id).offsetHeight;
                    }
                    // console.log('arranged', arranged, id);
                    if (!arranged.includes(id)) {
                        arranged.push(id);
                        arrangeAllChildren(id);
                    }
                }
                // console.log('AR => ', data[ind].name, `id-${data[ind].id} ${data[ind].top}-${data[ind].left}`);
            });
        };

        arrangeAllChildren(firstStep.id);
        return data;
    };

    getPositionY = (positions, x, y, id) => {
        const index = positions.findIndex(
            s => s.x === x && s.y === y && s.id !== id
        );
        if (index !== -1) {
            const s = positions[index];
            const height = document.getElementById(s.id).offsetHeight;
            const top = y + height + 30;
            return this.getPositionY(positions, x, top, id);
        }
        return y;
    };

    //#region Next Step Functionality
    updateNextStep = (idFormat = "", nextStepUid) => {
        const idParts = String(idFormat).split("_");
        if (idParts.length > 0) {
            const idType = idParts[0];
            const stepUid = idParts[idParts.length - 1];

            //Getting current step
            const { steps } = this.props;
            const currentStep = cloneObject(
                parseToArray(steps).find(s => s.stepUid == stepUid) ||
                    Object.create(null)
            );
            if (!currentStep) return;
            if (validActions.includes(idType)) {
                this._findAndUpdateNextStep(
                    currentStep,
                    idParts[1],
                    nextStepUid
                );
            } else {
                this._findAndUpdateNextStep(
                    currentStep,
                    idParts[0],
                    nextStepUid
                );
            }

            this.props.actions.updateStepInfo(stepUid, currentStep);
        }
    };

    _findAndUpdateNextStep = (
        currentProp,
        itemUid,
        nextStepUid,
        findKeys = ["uid", "stepUid"]
    ) => {
        Object.keys(currentProp || Object.create(null)).forEach((key, idx) => {
            if (findKeys.includes(key) && currentProp[key] == itemUid) {
                currentProp.nextStepUid = nextStepUid;
                return currentProp;
            } else if (Array.isArray(currentProp[key])) {
                currentProp[key].forEach(item => {
                    this._findAndUpdateNextStep(
                        item,
                        itemUid,
                        nextStepUid,
                        findKeys
                    );
                });
            } else if (typeof currentProp[key] === "object") {
                this._findAndUpdateNextStep(
                    currentProp[key],
                    itemUid,
                    nextStepUid,
                    findKeys
                );
            }
        });
    };
    //#endregion

    //#region Step Delete Functionality
    deleteStep = (stepUid = "") => {
        const { steps } = this.props;
        if (parseToArray(steps).length > 1) {
            const clonedSteps = cloneObject(steps);
            const stepIndex = clonedSteps.findIndex(s => s.stepUid == stepUid);
            if (stepIndex > 0) {
                Swal({
                    title: "Are you sure?",
                    text: "Please verify that you want to delete this step",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete this step",
                    cancelButtonText: "No, I want to keep it",
                    confirmButtonColor: "#f02727"
                }).then(result => {
                    if (result.value) {
                        clonedSteps.splice(stepIndex, 1);
                        clonedSteps.forEach(step => {
                            this._findAndUpdateNextStep(step, stepUid, null, [
                                "nextStepUid"
                            ]);
                        });
                        this.props.actions.updateEngageInfo({
                            steps: clonedSteps,
                            activeStep: clonedSteps[0].stepUid
                        });
                    }
                });
            }
        }
    };
    //#endregion

    //#region Saving Work flow

    //#region check validation
    _checkRequiredFields = steps => {
        let isValid = true;

        steps.forEach((step, index) => {
            switch (step.type) {
                case "sms":
                    if (
                        !step.options ||
                        !step.options.smsTextMessage ||
                        step.options.smsTextMessage.trim() === ""
                    ) {
                        toastr.warning(
                            `You must type any message on Text in ${step.name ||
                                "Step " + (index + 1)}.`
                        );
                        isValid = false;
                    }
                    if (
                        step.options &&
                        step.options.phoneNumberTo &&
                        step.options.phoneNumberTo.trim() &&
                        !isValidPhoneNumber(step.options.phoneNumberTo)
                    ) {
                        toastr.warning(
                            `You must add valid phone number in ${step.name ||
                                "Step " + (index + 1)}.`
                        );
                        isValid = false;
                    }  

                    break;
                case "smtp":
                        if (
                            !step.options ||
                            !step.options.smtpIntegration ||
                            step.options.smtpIntegration === -1
                        ) {
                            toastr.warning(
                                `You must select any smtp service in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (
                            !step.options ||
                            !step.options.fromName ||
                            step.options.fromName.trim() === ""
                        ) {
                            toastr.warning(
                                `You must enter From Name in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (
                            !step.options ||
                            !step.options.fromEmailAddress ||
                            step.options.fromEmailAddress.trim() === ""
                        ) {
                            toastr.warning(
                                `You must enter From Email Address in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        // if (
                        //     !step.options ||
                        //     !step.options.toEmailAddress ||
                        //     step.options.toEmailAddress.trim() === ""
                        // ) {
                        //     toastr.warning(
                        //         `You must enter To Email Address in ${step.name ||
                        //             "Step " + (index + 1)}.`
                        //     );
                        //     isValid = false;
                        // }
                        if (
                            !step.options ||
                            !step.options.subject ||
                            step.options.subject.trim() === ""
                        ) {
                            toastr.warning(
                                `You must enter Subject in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (
                            !step.options ||
                            !step.options.body ||
                            step.options.body.trim() === ""
                        ) {
                            toastr.warning(
                                `You must enter Email Body in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        break;
                case "conditions":
                    step.options.forEach(op => {
                        if (!op.nextStepUid) {
                            toastr.warning(
                                `You must add next step to option "${
                                    op.option
                                }" in ${step.name || "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (op.conditions) {
                            Object.keys(op.conditions).map(c => {
                                if (
                                    !op.conditions[c] ||
                                    (Array.isArray(op.conditions[c]) &&
                                        op.conditions[c].length === 0)
                                ) {
                                    toastr.warning(
                                        `please select valid value for option "${
                                            op.option
                                        }" in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                            });
                        }
                    });
                    break;
                case "randomizer":
                    step.options.forEach(op => {
                        if (!op.nextStepUid) {
                            toastr.warning(
                                `You must add next step to option "${
                                    op.option
                                }" in ${step.name || "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                    });
                    break;
                case "delay":
                    if (!step.options.nextStepUid) {
                        toastr.warning(
                            `You must add next step to ${step.name ||
                                "Step " + (index + 1)}.`
                        );
                        isValid = false;
                    }
                    break;
                default:
                    if (step.items.length === 0) {
                        toastr.warning(
                            `You must add at least one item to ${step.name ||
                                "Step " + (index + 1)}.`
                        );
                        isValid = false;
                    }
                    step.items.forEach(item => {
                        switch (item.type) {
                            case "card":
                                if (
                                    !item.mediaUid ||
                                    !item.headline ||
                                    !item.description
                                ) {
                                    toastr.warning(
                                        `You must fill in all the required fields of Card in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                if (
                                    item.imageLink &&
                                    !isValidUrl(item.imageLink)
                                ) {
                                    toastr.warning(
                                        `You must input valid URL of Card in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                break;
                            case "carousel":
                                item.items.forEach(carouselItem => {
                                    if (
                                        !carouselItem.mediaUid ||
                                        !carouselItem.headline ||
                                        !carouselItem.description
                                    ) {
                                        toastr.warning(
                                            `You must fill in all the required fields of Carousel in ${step.name ||
                                                "Step " + (index + 1)}.`
                                        );
                                        isValid = false;
                                    }
                                    if (
                                        item.imageLink &&
                                        !isValidUrl(item.imageLink)
                                    ) {
                                        toastr.warning(
                                            `You must input valid URL of Carousel in ${step.name ||
                                                "Step " + (index + 1)}.`
                                        );
                                        isValid = false;
                                    }
                                });
                                break;
                            case "video":
                            case "image":
                            case "audio":
                                if (!item.mediaUid) {
                                    toastr.warning(
                                        `You must upload a ${
                                            item.type
                                        } in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                break;
                            case "text":
                                if (!item.textMessage) {
                                    toastr.warning(
                                        `You must type any message on Text in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                break;
                            case "free_text_input":
                                if (!item.textMessage) {
                                    toastr.warning(
                                        `You must type any message on User Input in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                if (!item.customFieldUid) {
                                    toastr.warning(
                                        `You must select a 'Save Response to Field' in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                                const nextStep = steps.find(s => s.stepUid == item.nextStepUid);
                                if(item.nextStepUid !== null && nextStep) {
                                    if(nextStep.type == 'smtp' || nextStep.type == 'sms') {
                                        const next2Step = steps.find(s => s.stepUid == nextStep.childUid);
                                        if(nextStep.childUid !== null || next2Step) { 

                                        }
                                        else {
                                            if((nextStep.type == 'smtp' && this.state.workflowType === 'broadcast-email')
                                                || (nextStep.type == 'sms' && this.state.workflowType === 'broadcast-sms')) {

                                                }
                                            else {
                                                toastr.warning(
                                                    `You must add next step in ${nextStep.name ||
                                                        "Step " + (index + 2)}.`
                                                );
                                                isValid = false;
                                            }         
                                        }
                                    }
                                }
                                else {
                                    toastr.warning(
                                        `You must select a next step on User Input in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }

                                break;
                        }

                        if (item.actionBtns && item.actionBtns.length > 0) {
                            item.actionBtns.forEach(actionBtn => {
                                if (
                                    !actionBtn.label ||
                                    !actionBtn.actionType ||
                                    (actionBtn.actionType === "postback" &&
                                        !actionBtn.nextStepUid) ||
                                    (actionBtn.actionType === "web_url" &&
                                        !actionBtn.openUrl) ||
                                    (actionBtn.actionType === "phone_number" &&
                                        !actionBtn.phone)
                                ) {
                                    toastr.warning(
                                        `You must fill in all the required fields of action buttons of ${
                                            item.type
                                        } component in ${step.name ||
                                            "Step " + (index + 1)}.`
                                    );
                                    isValid = false;
                                }
                            });
                        }
                    });

                    if(step.items.length > 0 && step.items[step.items.length - 1].type == 'delay') {

                        toastr.warning(
                            `A step can\'t end with a Delay component. Please fix in ${step.name || "Step " + (index + 1)}.`
                        );
                        isValid = false;
                    }
            }
        });

        return isValid;
    };

    _isValidWorkflow = steps => {
        if (!this.state.name) {
            toastr.error(
                'You must supply a "Name" to this workflow before you can save it.'
            );
            return false;
        }
        if (this.props.steps.length === 0) {
            toastr.error(
                "You must add at least one item to the flow from the toolbox on the left before you can save it."
            );
            return false;
        }

        if (!this._checkRequiredFields(steps)) {
            return false;
        }
        return true;
    };
    //#endregion

    //#region filter orphan steps
    _getOrphanSteps = steps => {
        let arr = [];
        const orphanSteps = [...steps]
            .splice(1)
            .filter(s => s.parents.length === 0);
        orphanSteps.forEach(s => {
            arr = this._getAllChildSteps(steps, s.id, arr);
        });
        return arr;
    };

    _getAllChildSteps = (steps, id, arr) => {
        const step = steps.find(s => s.id === id);
        let isOrphanStep = true;
        if (step.parents && step.parents.length) {
            step.parents.forEach(p => {
                p = p.split("_");
                p = p[p.length - 1];
                // console.log('p', p);
                if (!arr.includes(p)) {
                    isOrphanStep = false;
                }
            });
        }
        if (!isOrphanStep) {
            return arr;
        }
        arr.push(id);
        if (step) {
            if (step.allChildren && step.allChildren.length > 0) {
                step.allChildren.forEach(sid => {
                    arr = this._getAllChildSteps(steps, sid, arr);
                });
            }
        }
        return arr;
    };

    _filterOrphanSteps = (steps, orphanStepIds) => {
        return steps.filter(s => !orphanStepIds.includes(s.id));
    };
    //#endregion

    //#region transform steps
    _transformSteps = steps => {
        return steps.map(step => {
            let s = step;
            if (s.stepType === "items" || s.type === "items") {
                s.childUid = s.nextStepUid || null;
                s.type = s.stepType || "items";
                s.items = s.items.map((i, ind) => {
                    i.order = ind;
                    return i;
                });
            } else if (s.stepType === "randomizer" || s.type === "randomizer") {
                s = {
                    stepUid: step.stepUid,
                    name: step.name,
                    childUid: null,
                    type: "randomizer",
                    options: step.options
                };
            } else if (s.stepType === "delay" || s.type === "delay") {
                s = {
                    name: step.name,
                    stepUid: step.stepUid,
                    childUid: null,
                    type: "delay",
                    options: {
                        type: step.delayType,
                        timeUnit: step.timeUnit,
                        amount: step.amount,
                        nextStepUid: step.nextStepUid
                    }
                };
            } else if (s.stepType === "sms" || s.type === "sms") {
                s = {
                    name: step.name,
                    stepUid: step.stepUid,
                    childUid: step.nextStepUid || null,
                    type: "sms",
                    options: {
                        smsTextMessage: step.items[0].value,
                        phoneNumberTo: step.phoneNumberTo
                    }
                };
            }  else if (s.stepType === "smtp" || s.type === "smtp") {
                s = {
                    name: step.name,
                    stepUid: step.stepUid,
                    childUid: step.nextStepUid || null,
                    type: "smtp",
                    options: {
                        smtpIntegration: step.smtpIntegration,
                        fromName: step.items[0].value,
                        fromEmailAddress: step.items[1].value,
                        toEmailAddress: step.items[2].value,
                        subject: step.items[3].value,
                        body: step.items[4].value
                    }
                };
            } else if (s.stepType === "conditions" || s.type === "conditions") {
                s = conditionBuilderTransformer.forApi(step);
                // console.log('s', s);
            }

            // set position of step
            s.position = {
                x: step.left,
                y: step.top
            };

            delete s.nextStepUid;
            delete s.id;
            delete s.stepType;
            delete s.left;
            delete s.top;
            delete s.children;
            delete s.actions;
            delete s.allChildren;
            delete s.parents;
            // console.log('step', s);

            return s;
        });
    };
    //#endregion

    _removeAllLocalKeys = (
        oldObj,
        findKeys = ["uid"],
        ingnoreKeys = ["quickReplies", "actionBtns"]
    ) => {
        let obj = oldObj ? cloneObject(oldObj) : null;
        Object.keys(obj || Object.create(null)).map(key => {
            if (ingnoreKeys.includes(key)) {
                return;
            } else if (findKeys.includes(key)) {
                // console.log('key =>', key, obj[key]);
                if (key === "uid") {
                    // console.log('uid key =>', key, obj[key]);
                    if (isNaN(Number(obj[key]))) {
                        // console.log('delete key =>', key, obj[key]);
                        delete obj[key];
                    }
                } else {
                    delete obj[key];
                }
            } else if (Array.isArray(obj[key])) {
                obj[key] = obj[key].map(item =>
                    this._removeAllLocalKeys(item, findKeys)
                );
            } else if (typeof obj[key] === "object") {
                // console.log('object key', key, obj[key]);
                obj[key] = this._removeAllLocalKeys(obj[key], findKeys);
            }
        });
        return obj;
    };

    handleSaveWorkflow = (isRedirect = true) => {
        const allSteps = cloneObject(this.flow);
        // console.log('news steps', allSteps);
        // return false;
        const orphanStepIds = this._getOrphanSteps(allSteps);
        // console.log('orphanStepIds', orphanStepIds)
        let steps = this._filterOrphanSteps(allSteps, orphanStepIds); // remove orphan steps
        // console.log('_filterOrphanSteps', steps)
        steps = cloneObject(this._transformSteps(steps)); // transform API steps
        // console.log('_transformSteps', steps);
        steps = steps.map(step => this._removeAllLocalKeys(step));
        // console.log('save steps', steps);
        const isValid = this._isValidWorkflow(steps);
        console.log("steps", steps);
        // return false;
        if (isValid) {
            // console.log('save steps', steps);
            const workflow = {
                name: this.state.name,
                steps
            };
            this.props.saveWorkflow(workflow, isRedirect);
        }
    };

    _handleEditWorkflow = () => {
        Swal({
            title: "Please wait...",
            // text: 'We are saving trigger...',
            onOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
        const self = this;
        setTimeout(() => {
            self.props.history.push(
                `/page/${this.props.match.params.id}/workflows/${this.props.match.params.engageId}/edit`
            );
            Swal.close();
        }, 2000);
    };
    //#endregion

    render() {
        const { workflowItem } = this.props;
        const { scale, autoArrange, delModal, data, name } = this.state;
        let flow;
        if (autoArrange) {
            flow = data;
        } else {
            flow = this.createData();
        }

        return (
            <React.Fragment>
                <Block className="mainTitletext">
                    {!this.props.stats && (
                        <Block className="searchfield">
                            <input className="searchfield-input" placeholder="Workflow name" value={name} onChange={(e) => 
                                    this.setState({ name: e.target.value })
                                } />
                            <Tooltip arrow title="Edit Workflow Name">
                                <IconButton color="primary">
                                    <Svg name="penciloutline" />
                                </IconButton>
                            </Tooltip>
                        </Block>
                    )}
                </Block>
                <Block className="menuTopSide">
                    <Tooltip arrow title="Back to Workflow(s)">
                        <IconButton
                            color="secondary"
                            onClick={() => this.props.history.goBack()}
                            className="btn add custum-icons-topside"
                        >
                            <Svg name="keyboard-back"  />
                        </IconButton>
                    </Tooltip>
                    <span className="separator"></span>
                    <Tooltip arrow title="Zoom In">
                        <IconButton
                            color="secondary"
                            onClick={this.handleScale("add")}
                            className="btn add"
                        >
                            <Svg name="toolbar-plus" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title="Zoom Out">
                        <IconButton
                            color="secondary"
                            onClick={this.handleScale("minus")}
                            className="btn add"
                        >
                            <Svg name="toolbar-minus" />
                        </IconButton>
                    </Tooltip>
                    {!this.props.stats && (
                        <Tooltip arrow title="Magic Rearrange">
                            <IconButton
                                color="secondary"
                                onClick={this.handleAutoArrange}
                                className="btn add"
                            >
                                <Svg name="magicrefresh" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {this.props.stats && (
                        <Tooltip arrow title="Edit">
                            <IconButton
                                color="secondary"
                                onClick={this._handleEditWorkflow}
                                className="btn add custum-icons-topside"
                            >
                                <Svg name="penciloutline" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!this.props.stats && (
                        <React.Fragment>
                            <Tooltip arrow title="Save">
                                <IconButton
                                    color="secondary"
                                    onClick={() =>
                                        this.handleSaveWorkflow(false)
                                    }
                                    className="btn check"
                                >
                                    <Svg name="save" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                arrow
                                title="Save and return to all workflows"
                            >
                                <IconButton
                                    color="secondary"
                                    onClick={this.handleSaveWorkflow}
                                    className="btn check"
                                >
                                    <Svg name="checkcircle" />
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    )}
                </Block>
                {flow && flow.length > 0 && (
                    <DragBoard
                        updateEngageInfo={this.props.actions.updateEngageInfo}
                        updateNextStep={this.updateNextStep}
                        deleteStep={this.deleteStep}
                        data={flow}
                        newItem={workflowItem}
                        handleAutoSave={this.handleFlow}
                        scale={scale}
                        autoArrange={autoArrange}
                        handleAutoArrange={this.handleAutoArrange}
                        stats={this.props.stats}
                        hasPosition={this.hasPosition}
                        findAndSetScale={this.findAndSetScale}
                        isRefresh={this.refresh}
                        refresh={this.handleRefresh}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    workflowName: state.default.scenes.engageAdd.name,
    // workflowItem: state.default.workflow.workflowItem,
    workflowStats: state.default.workflows.workflowStats,
    lastUpdatedAt: Date.now(),
    activeStep: getEngageAddState(state).activeStep,
    steps: getEngageAddState(state).steps
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateEngageInfo,
            updateItemInfo,
            updateStepInfo
        },
        dispatch
    )
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OuterDragBoard)
);
