import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import {
    Checkbox,
    Input,
    Button,
    Message,
    Form,
    Icon,
    Popup,
    Label
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import { Block, Svg } from '../../../Layout';
import uploadIcon from 'assets/images/icon-upload.png';
import warningIcon from 'assets/images/icon-warning.png';
import { getCurrentStep } from '../../../scenes/EngageAdd/services/selector';
import { getPageFromUrl } from "services/pages/selector";
import {
    updateStepInfo,
    updateEngageInfo,
    updateSmsPhoneNumber
} from '../../../scenes/EngageAdd/services/actions';
import { cloneObject, parseToArray } from '../../../../../services/utils';
import { SMSBuilderModel } from '../../../scenes/EngageAdd/models/SMSBuilderModel';
import Constants from '../../../../../config/Constants';
import FileUploader from '../../../../../components/FileUploader/FileUploader';
import UrlEdit from '../../../scenes/EngageAdd/components/Image/UrlEdit';
import TextEdit from '../../../scenes/EngageAdd/components/TextEdit';
import './SMSBuilder.scss';

class SMSBuilder extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        const currentState = new SMSBuilderModel.Model(this.props.currentStep);
        this.state = {
            ...currentState,
            phoneError: false,
            phoneNumberTo: props.phone,
            builderType: params.get('type')
        };

        //Bindings
        this.updateIsNextStep = this.updateIsNextStep.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.addUserReply = this.addUserReply.bind(this);
        this.removeUserReply = this.removeUserReply.bind(this);
        this.updateUserReply = this.updateUserReply.bind(this);
        this.onImageLoad = this.onImageLoad.bind(this);
    }

    componentDidMount = () => {
        const { phone } = this.props;
        if (phone) {
            this.setStore({ phoneNumberTo: phone });
        }
    };
    //#endregion

    //#region Functionalities
    onPhoneChange = phone => {
        console.log('phone', phone);
        if (!isValidPhoneNumber(phone)) {
            this.setState({
                phoneError: true
            });
        } else {
            this.setState({
                phoneError: false
            });
        }
        this.setStore({ phoneNumberTo: phone });
        this.props.actions.updateSmsPhoneNumber(phone);
    };
    updateIsNextStep = (isNextStep = false) => {
        this.setStore({ isNextStep, nextStepUid: null });
    };

    //#region Text and Multimedia
    addItem = (itemType, refItems = []) => {
        const item = new SMSBuilderModel.Item();
        item.type = itemType;
        item.uid = uuid();
        const items = [...parseToArray(refItems)];
        items.push(item);
        this.setStore({ items });
    };
    removeItem = (index = -1, refItems = []) => {
        if (index > -1) {
            const items = [...parseToArray(refItems)];
            items.splice(index, 1);
            this.setStore({ items });
        }
    };
    updateItem = (index = -1, payLoad = {}, refItems = []) => {
        if (index > -1) {
            const items = parseToArray(refItems).map((item, idx) => {
                if (idx !== index) return item;
                return { ...item, ...payLoad };
            });
            this.setStore({ items });
        }
    };
    //#endregion

    //#region User replies
    addUserReply = (refUserReplies = []) => {
        const userReplies = [...parseToArray(refUserReplies)];
        const userReply = new SMSBuilderModel.UserReplyItem();
        userReply.text = '';
        userReply.uid = uuid();
        userReplies.push(userReply);
        const newState = { userReplies };
        if (userReplies.length == 1) {
            const fallBack = new SMSBuilderModel.UserReplyItem({
                text: 'Fallback',
                uid: uuid()
            });
            newState.fallBack = fallBack;
        }
        this.setStore(newState);
    };
    removeUserReply = (index = -1, refUserReplies = []) => {
        if (index > -1) {
            const userReplies = [...parseToArray(refUserReplies)];
            userReplies.splice(index, 1);
            const newState = { userReplies };
            if (userReplies.length <= 0) {
                newState.fallBack = null;
            }
            this.setStore(newState);
        }
    };
    updateUserReply = (index = -1, payLoad = {}, refUserReplies = []) => {
        if (index > -1) {
            const userReplies = parseToArray(refUserReplies).map(
                (item, idx) => {
                    if (idx !== index) return item;
                    return { ...item, ...payLoad };
                }
            );
            this.setStore({ userReplies });
        }
    };
    onImageLoad = imgSrc => {
        console.log('data', imgSrc);
    };
    //#endregion

    //#endregion

    //#region Store
    onSave = () => {
        this.setStore(new SMSBuilderModel.Model(this.state), true);
    };
    setStore = (modProps = Object.create(null), isReduxStore = true) => {
        if (isReduxStore) {
            const newState = {
                ...cloneObject(this.props.currentStep),
                ...modProps
            };
            this.props.actions.updateStepInfo(
                this.props.currentStep.stepUid,
                newState
            );
        } else {
            this.setState(modProps);
        }
    };
    //#endregion

    //#region Renders
    renderInfoMessage = (items = []) => {
        let textMsgCount = 0,
            multimediaMsgCount = 0,
            message = '';
        parseToArray(items).forEach(item => {
            if (item.type === Constants.smsBuilderItemTypes.text) {
                textMsgCount++;
            } else {
                multimediaMsgCount++;
            }
        });

        if (textMsgCount > 0)
            message = `${textMsgCount} Text Message${
                textMsgCount > 1 ? 's' : ''
                }`;
        if (multimediaMsgCount > 0)
            message += `, ${multimediaMsgCount} Multimedia Message${
                textMsgCount > 1 ? 's' : ''
                }`;
        if (!message.length) message = 'Message';

        return <Message compact={true} content={message} />;
    };
    renderItems = (items = []) => {
        return parseToArray(items).map((item, index) => {
            if (item.type === Constants.smsBuilderItemTypes.text) {
                return (
                    <Block className="sms-textblock" key={index}>
                        <br />
                        <Form>
                            {/* <Form.TextArea
                                required
                                rows={10}
                                className={`${item.value ? '' : 'error'}`}
                                placeholder="Enter your text..."
                                value={item.value}
                                onChange={(e, d) =>
                                    this.updateItem(
                                        index,
                                        { ...item, value: d.value },
                                        items
                                    )
                                }
                            /> */}
                            {item.value && item.value.length > 150 &&
                                <Message negative>
                                    <Message.Header>Warning!</Message.Header>
                                    <p>Your have been exceeded message limit, so this message will be split into two separate messages </p>
                                </Message>
                            }
                            <TextEdit
                                isRestrictedForJSON={false}
                                maxLength={1000}
                                textMessage={item.value || ''}
                                updateItemInfo={d =>
                                    this.updateItem(
                                        index,
                                        { ...item, value: d.textMessage },
                                        items
                                    )
                                }
                            />
                        </Form>
                        {/* <Block className="btnNextstep">
                            <Button circular>+ Link to another step</Button>
                        </Block> */}
                        {/* <Button
                            circular
                            className="close"
                            onClick={() => this.removeItem(index, items)}
                        >
                            <Svg name="delete" />
                        </Button> */}
                        <Block style={{ marginTop: '30px', color: '#969696' }}>
                            <b>Note:</b> SMS messages are billed separate at a rate of ${this.props.page.subscription ? this.props.page.subscription.stripePlan.smsPlanPrice : 0.02}.
                        </Block>
                    </Block>
                );
            } else {
                return (
                    <Block
                        key={index}
                        className={`smsImageblock${item.value ? '' : ' error'}`}
                    >
                        <Block className="btnReplyblock" key={index}>
                            <FileUploader
                                handleOnLoad={imgSrc => {
                                    this.updateItem(
                                        index,
                                        { ...item, value: imgSrc },
                                        items
                                    );
                                }}
                                file={item.value || ''}
                                type="image"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#f5f6fa',
                                    borderWidth: 1,
                                    borderColor: '#ebebeb',
                                    borderStyle: 'solid',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    borderRadius: '3px',
                                    borderBottomRightRadius: 0,
                                    borderBottomLeftRadius: 0
                                }}
                                renderContent={
                                    <div
                                        className="position-relative w-100 h-100 d-flex flex-column align-items-center"
                                        style={{ padding: '10px' }}
                                    >
                                        <img
                                            src={uploadIcon}
                                            alt=""
                                            width="24"
                                        />
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: '#b1b9cc',
                                                marginTop: 10
                                            }}
                                        >
                                            Drag and drop your image,{' '}
                                            <span className="text-underline">
                                                browse
                                            </span>
                                            , or
                                            {''} <br />
                                            select an action below
                                        </span>
                                    </div>
                                }
                                stepUid={this.props.currentStep.stepUid}
                                itemIndex={index}
                            />
                            <Button
                                circular
                                className="close"
                                onClick={() => this.removeItem(index, items)}
                            >
                                <Svg name="delete" />
                            </Button>
                        </Block>
                        <Block className="urlBlock">
                            <Popup
                                on="click"
                                trigger={
                                    <Button fluid size="small">
                                        Image URL
                                    </Button>
                                }
                                hoverable
                                flowing
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <UrlEdit
                                    url=""
                                    onSave={imgSrc => {
                                        this.updateItem(
                                            index,
                                            { ...item, value: imgSrc },
                                            items
                                        );
                                    }}
                                />
                            </Popup>
                        </Block>
                    </Block>
                );
            }
        });
    };
    renderUserReplies = (userReplies = []) => {
        return parseToArray(userReplies).map((item, index) => (
            <Block key={index} className="buttonsCol">
                <Input
                    className={`${item.text ? '' : 'error'}`}
                    value={item.text}
                    placeholder="Add title"
                    onChange={(e, d) =>
                        this.updateUserReply(
                            index,
                            { text: d.value },
                            userReplies
                        )
                    }
                />
                <Button circular className="close">
                    <Svg name="delete" />
                </Button>
            </Block>
        ));
    };
    //#endregion

    render() {
        const {
            items,
            phoneNumberTo,
            // userReplies,
            isNextStep
            // fallBack
        } = this.props.currentStep;
        const { phone } = this.props;

        return (
            <Block className="sms-builder-block">
                {/* {this.renderInfoMessage(items)} */}
                {(this.state.builderType == null || !this.state.builderType.startsWith('broadcast-')) && <Block>
                    <Label>
                        To send this message to someone else, enter the number
                        here, if sending to this subscriber we will send to the
                        number they provided
                    </Label>
                    <Block
                        className={`${this.state.phoneError ? 'error' : ''}`}
                    >
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={phoneNumberTo || phone}
                            onChange={this.onPhoneChange}
                        />
                    </Block>
                </Block>}
                {this.renderItems(items)}
                <Block className="sms-buider-form-block">
                    <Button variant="contained" onClick={() => {
                        this.props.actions.updateEngageInfo({
                            // activeStep: "",
                            showBuilderAsideMenu: false
                        });
                    }} color="primary" className="sms-builder-btn-save">Save & Complete</Button>
                </Block>

                {/* <Block className="btnNextstep addUserreply">
                    {this.renderUserReplies(userReplies)}
                    {fallBack ? (
                        <>
                            <Button circular basic>
                                {fallBack.text}
                            </Button>
                            <br />
                        </>
                    ) : null}
                    <Button
                        circular
                        onClick={() => this.addUserReply(userReplies)}
                    >
                        + Add User Reply
                    </Button>
                </Block> */}

                {/* <Block className="smsButtonlist">
                    <Block className="btnNextstep txtBtnblock">
                        <Button
                            circular
                            onClick={() =>
                                this.addItem(
                                    Constants.smsBuilderItemTypes.text,
                                    items
                                )
                            }
                        >
                            <Icon name="file text outline" />
                            Text
                        </Button>
                    </Block>
                    <Block className="btnNextstep imgBtnblock">
                        <Button
                            circular
                            onClick={() =>
                                this.addItem(
                                    Constants.smsBuilderItemTypes.image,
                                    items
                                )
                            }
                        >
                            <Icon name="image" />
                            Image
                        </Button>
                    </Block>
                </Block> */}

                {/* <Block className="another-step">
                    <Checkbox
                        label="Continue to another step"
                        type="checkbox"
                        checked={isNextStep}
                        onChange={(e, d) => this.updateIsNextStep(d.checked)}
                    />
                    {isNextStep ? (
                        <Block className="btnNextstep">
                            <Button fluid basic>
                                Choose Next Step
                            </Button>
                        </Block>
                    ) : null}
                </Block> */}
            </Block>
        );
    }
}

SMSBuilder.propTypes = {
    currentStep: PropTypes.object
};
const mapStateToProps = (state, props) => ({
    page: getPageFromUrl(state, props),
    currentStep: getCurrentStep(state),
    phone: state.default.scenes.engageAdd.smsPhone
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateStepInfo,
            updateSmsPhoneNumber,
            updateEngageInfo,
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SMSBuilder)
);
