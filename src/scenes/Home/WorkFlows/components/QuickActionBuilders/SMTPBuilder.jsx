import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Card, CardHeader , CardContent } from '@material-ui/core';

import {
  Message
} from 'semantic-ui-react';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Block, Svg } from '../../../Layout';
import uploadIcon from 'assets/images/icon-upload.png';
import warningIcon from 'assets/images/icon-warning.png';
import { getCurrentStep } from '../../../scenes/EngageAdd/services/selector';
import {
    updateEngageInfo,
    updateStepInfo,
    updateSmtpIntegration
} from '../../../scenes/EngageAdd/services/actions';

import { cloneObject, parseToArray } from '../../../../../services/utils';
import { SMTPBuilderModel } from '../../../scenes/EngageAdd/models/SMTPBuilderModel';
import Constants from '../../../../../config/Constants';
import FileUploader from '../../../../../components/FileUploader/FileUploader';
import UrlEdit from '../../../scenes/EngageAdd/components/Image/UrlEdit';
import InlineTextEdit from '../../../scenes/EngageAdd/components/InlineTextEdit';
import RichTextEditor from '../../../scenes/EngageAdd/components/RichTextEditor';

import './SMTPBuilder.scss';

class SMTPBuilder extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);

        const currentState = new SMTPBuilderModel.Model(this.props.currentStep);
        this.state = {
            ...currentState,
            smtpIntegrationError: false,
            smtpIntegration: props.smtpIntegration,
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
    }

    componentDidMount = () => {
        const { smtpIntegration } = this.props;
        if (smtpIntegration) {
            this.setStore({ smtpIntegration: smtpIntegration });
        }
    };
    //#endregion

    //#region Functionalities

    onSmtpIntegrationChange = smtpIntegration => { 
      if (smtpIntegration == 0) {
        this.setState({
          smtpIntegrationError: true
        });
      } else {
        this.setState({
          smtpIntegrationError: false
        });
      }
      this.setStore({ smtpIntegration: smtpIntegration });
      this.props.actions.updateSmtpIntegration(smtpIntegration);
    };
    
    updateIsNextStep = (isNextStep = false) => {
        this.setStore({ isNextStep, nextStepUid: null });
    };

    //#region Text and Multimedia
    addItem = (itemType, refItems = []) => {
        const item = new SMTPBuilderModel.Item();
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
        const userReply = new SMTPBuilderModel.UserReplyItem();
        userReply.text = '';
        userReply.uid = uuid();
        userReplies.push(userReply);
        const newState = { userReplies };
        if (userReplies.length == 1) {
            const fallBack = new SMTPBuilderModel.UserReplyItem({
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
        this.setStore(new SMTPBuilderModel.Model(this.state), true);
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
            if (item.type === Constants.smtpBuilderItemTypes.text) {
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
        const labels = ['From Name', 'From Email Address', 'Send to Address', 'Subject Line', 'Email Body'],
              placeholders = ['From Name', 'Email Address', 'Email Address', 'Subject Line', 'Email Body'];
        return parseToArray(items).map((item, index) => {
            if (item.type === Constants.smtpBuilderItemTypes.text) {
                if(index == 0) {
                    return (
                        <Block key={index} className="smtp-block-text">
                        <div className="label">{labels[index]}</div>
                        <Block>
                            <TextField className="smtp-text-field" maxLength={160} variant="outlined" placeholder={placeholders[index]} value={ item.value } 
                            onChange={(event) => 
                                this.updateItem(
                                index,
                                { ...item, value: event.target.value },
                                items
                                )} />
                        </Block>
                        </Block>
                    );
                }
                else {
                    return (index == 2 && this.state.builderType != null && this.state.builderType.startsWith('broadcast-')) ? null : (
                        <Block key={index} className="smtp-block-text">
                        <div className="label">{labels[index]}</div>
                        <Block>
                        <InlineTextEdit
                            isRestrictedForJSON={false}
                            maxLength={160}
                            textMessage={item.value || ''}
                            updateItemInfo={d =>
                                this.updateItem(
                                    index,
                                    { ...item, value: d.textMessage },
                                    items
                                )
                            }
                            type={index == 1 || index == 2 ? 'EMAIL' : ''}
                        />
                        </Block>
                        </Block>);
                }
            } else if (item.type === Constants.smtpBuilderItemTypes.editor) {
              return (
                <Block key={index} className="smtp-block-editor">
                  <div className="label">{labels[index]}</div>
                  <Block className="mui-rte" onClick={(e) => this.refEditorBody.focus() }>
                    <RichTextEditor maxLength={2000} textMessage={item.value || ""}
                        getRef = {(ref) => this.refEditorBody = ref }
                        updateItemInfo = {(data) => 
                            this.updateItem(
                            index,
                            { ...item, value: data },
                            items
                            )} />
                  </Block>
                </Block>);
            }
        });
    };
    renderUserReplies = (userReplies = []) => {
        return parseToArray(userReplies).map((item, index) => (
            <Block key={index} className="buttonsCol">
                <TextField
                    className={`${item.text ? '' : 'error'}`}
                    value={item.text}
                    placeholder="Add title"
                    onChange={(e, d) =>
                        this.updateUserReply(
                            index,
                            { text: e.target.value },
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
            smtpIntegration,
            // userReplies,
            isNextStep
            // fallBack
        } = this.props.currentStep;

        const { integrations } = this.props;
    
        const activeSmtpIntegrations = integrations.filter(i => i.active && ['sendgrid', 'mailgun', 'smtp'].includes(i.integrationType.slug) );

        return (
          <Block className="smtp-builder-block">
            <Block>
              <Block className={`smtp-builder-item-block ${this.state.smtpIntegrationError ? 'error' : ''}`}>
                <Select className="smtp-select" value={smtpIntegration || this.props.smtpIntegration } onChange={ event => this.onSmtpIntegrationChange(event.target.value)} variant="outlined"> 
                  <MenuItem value={-1}>Select SMTP Integration</MenuItem>
                  {activeSmtpIntegrations.map((i, index) => <MenuItem key={index} value={i.uid}>
                        <img src={require("assets/images/icon-" + i.integrationType.slug + '.png')} className="smtp-integration-icon" />
                        {i.integrationType.name}
                    </MenuItem>)}
                </Select>
              </Block>
              <Block className="smtp-builder-form-block">
                    {this.renderItems(items)}
                </Block>
                <Block className="smtp-builder-item-block">
                    <Button variant="contained" onClick={() => {
                        this.props.actions.updateEngageInfo({
                            // activeStep: "",
                            showBuilderAsideMenu: false
                        });
                    }} color="primary" className="smtp-builder-btn-save">Save & Complete</Button>
                </Block>
            </Block>
          </Block>
        );
    }
}

SMTPBuilder.propTypes = {
    currentStep: PropTypes.object,
    integrations: PropTypes.array
};
const mapStateToProps = state => ({
    currentStep: getCurrentStep(state),
    smtpIntegration: state.default.scenes.engageAdd.smtpIntegration,
    integrations: state.default.settings.integrations.integrations
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateStepInfo,
            updateSmtpIntegration,
            updateEngageInfo,
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SMTPBuilder)
);
