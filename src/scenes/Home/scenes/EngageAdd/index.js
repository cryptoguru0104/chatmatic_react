import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import CreatableSelect from 'react-select/lib/Creatable';
import uuidv1 from 'uuid/v1';

import { getEngageAddState } from './services/selector';
import { updateEngageInfo } from './services/actions';

import Constants from 'config/Constants';
import iconMessages from 'assets/images/icon-messages-lg.png';
import pencilIcon from 'assets/images/icon-pencil.png';
import './styles.css';

const defaultEngageSetting = {
    image: iconMessages,
    title: 'Select a Message Type To Begin Building',
    description:
        "If you aren't sure which type you want, select it to read a brief description. " +
        'Make sure you read what each option is. ' +
        'Once you have selected which type you want to build, click the Start Building button.'
};

class EngageAdd extends React.Component {
    state = {
        workflowType: '',
        name: '',
        keywords: [],
        keywordsOption: Constants.keywordsOptions[0].key
    };

    _addNewKeyword = keyword => {
        const value = uuidv1();
        this.setState({
            keywords: this.state.keywords.concat([{ label: keyword, value }])
        });
    };

    _startMessageBuilding = () => {
        if (!this.state.name) {
            toastr.warning(
                'WARNING!',
                'Please do not forget give a name to your engagement.'
            );
        } else if (!this.state.workflowType) {
            toastr.warning(
                'WARNING!',
                'Woops, you forgot to customize the engagement type.'
            );
        } else if (
            this.state.workflowType === 'keywordmsg' &&
            this.state.keywords.length === 0
        ) {
            toastr.warning(
                'WARNING!',
                'Please add one or more keywords to the engagement.'
            );
        } else {
            this.props.updateEngageInfo({
                ...this.state,
                keywords: this.state.keywords.map(keyword => keyword.label)
            });
        }
    };

    _renderOptions = () => {
        const _renderDescription = () => {
            switch (this.state.workflowType) {
                case 'broadcast':
                    return (
                        <small className="form-text text-description">
                            This is a one time broadcast that will go to a
                            select group of your subscribers (which you will
                            choose below). When broadcasting it's important to
                            remember you are NOT ALLOWED to send marketing
                            related messages to anyone who has NOT been active
                            with your bot in the last 24 hours. So if you are
                            sending a marketing related broadcast, you will
                            select "marketing" below and we will automatically
                            remove anyone who is subscribed to your bot but is
                            NOT within that 24 hour window. There is one
                            exception to this rule which you will see below.
                            Remember to outline, in detail, what type of message
                            you are sending once you choose either Marketing,
                            Subscription, or One Time message. We deliver this
                            information to Facebook to ensure compliance.
                        </small>
                    );
                case 'keywordmsg':
                    return (
                        <div className="keyword-description-container">
                            <small className="form-text text-description">
                                When someone chooses to message you through the
                                Messenger platform, if they use the keyword or
                                phrase below, they will receive the response you
                                setup in the next step
                            </small>
                            <div className="d-flex flex-column option-list">
                                {Constants.keywordsOptions.map(
                                    (option, index) => (
                                        <label
                                            key={index}
                                            className="keyword-option"
                                        >
                                            <input
                                                onChange={event =>
                                                    this.setState({
                                                        keywordsOption:
                                                            event.target.value
                                                    })
                                                }
                                                type="radio"
                                                value={option.key}
                                                checked={
                                                    this.state
                                                        .keywordsOption ===
                                                    option.key
                                                }
                                            />
                                            <span>
                                                <span className="option-label">
                                                    {option.label}
                                                </span>
                                                <span className="option-description">
                                                    {option.description}
                                                </span>
                                                <span className="option-constraint">
                                                    {option.constraint}
                                                </span>
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>
                            <CreatableSelect
                                isMulti
                                placeholder="Keywords"
                                onChange={keywords =>
                                    this.setState({ keywords })
                                }
                                isClearable={false}
                                components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null
                                }}
                                onBlur={event => {
                                    if (
                                        !!event.target.value &&
                                        !this.state.keywords.find(
                                            keyword =>
                                                keyword.label ===
                                                event.target.value
                                        )
                                    ) {
                                        this._addNewKeyword(event.target.value);
                                    }
                                }}
                                onCreateOption={keyword =>
                                    this._addNewKeyword(keyword)
                                }
                                value={this.state.keywords}
                            />
                        </div>
                    );
                default:
                    return <div />;
            }
        };

        return (
            <div className="flow-content">
                <label className="font-weight-bold my-3">
                    Customization Options For Who Gets The Message
                </label>

                {Object.keys(Constants.messageType).map(
                    (workflowType, index) => (
                        <div className="form-check mb-4" key={index}>
                            <label className="form-check-label">
                                <input
                                    className="form-check-input"
                                    onChange={event =>
                                        this.setState({
                                            workflowType: event.target.value
                                        })
                                    }
                                    type="radio"
                                    value={
                                        Constants.messageType[workflowType]
                                            .value
                                    }
                                    checked={
                                        this.state.workflowType ===
                                        Constants.messageType[workflowType]
                                            .value
                                    }
                                    disabled={workflowType === 'integrated'}
                                />
                                <img
                                    src={
                                        Constants.messageType[workflowType]
                                            .image
                                    }
                                    alt=""
                                />
                                <span className="pl-2">
                                    {Constants.messageType[workflowType].label}
                                </span>
                            </label>
                        </div>
                    )
                )}
                {_renderDescription()}
            </div>
        );
    };

    _renderDescription = () => {
        let settingObj = {};

        switch (this.state.workflowType) {
            case Constants.messageType.welcomemsg.value:
                settingObj = Constants.messageType.welcomemsg;
                break;
            case Constants.messageType.keywordmsg.value:
                settingObj = Constants.messageType.keywordmsg;
                break;
            case Constants.messageType.general.value:
                settingObj = Constants.messageType.general;
                break;
            case Constants.messageType.json.value:
                settingObj = Constants.messageType.json;
                break;
            case Constants.messageType.broadcast.value:
                settingObj = Constants.messageType.broadcast;
                break;
            case Constants.messageType.autoresponse.value:
                settingObj = Constants.messageType.autoresponse;
                break;
            default:
                settingObj = defaultEngageSetting;
        }

        return (
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
                <div className="text-center col-sm-10">
                    <img
                        className="description-image"
                        src={settingObj.image}
                        alt=""
                    />
                    <h5 className="font-weight-normal">{settingObj.title}</h5>
                    <span className="font-weight-light">
                        {settingObj.description}
                    </span>
                </div>
            </div>
        );
    };

    render() {
        if (this.props.name && this.props.workflowType) {
            return (
                <Redirect
                    to={`/page/${this.props.match.params.id}/engages/${this
                        .props.uid || 'add'}/builder`}
                />
            );
        }

        return (
            <div>
                <div
                    className="card d-flex align-items-stretch flex-row w-100 engage-add-container"
                    data-aos="fade"
                >
                    <div className="d-flex flex-column justify-content-between col-sm-5 py-2 px-3 type-left-container">
                        <div>
                            <div className="position-relative flow-name-container">
                                <input
                                    type="text"
                                    className="form-control bg-white mb-2 flow-name-input pr-5"
                                    placeholder="Flow Name"
                                    onChange={event =>
                                        this.setState({
                                            name: event.target.value
                                        })
                                    }
                                    value={this.state.name}
                                />
                                <img
                                    src={pencilIcon}
                                    alt=""
                                    className="position-absolute"
                                />
                            </div>
                            {this._renderOptions()}
                        </div>
                        <div className="text-center">
                            <button
                                className="btn btn-primary btn-start-building my-4"
                                onClick={this._startMessageBuilding}
                            >
                                Start Building
                            </button>
                        </div>
                    </div>
                    <div
                        className="d-flex flex-stretch w-100 type-right-container"
                        data-aos="fade"
                        data-aos-delay="200"
                    >
                        <div className="card-body">
                            {this._renderDescription()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EngageAdd.propTypes = {
    uid: PropTypes.number,
    name: PropTypes.string.isRequired,
    workflowType: PropTypes.string.isRequired,
    updateEngageInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    uid: getEngageAddState(state).uid,
    name: getEngageAddState(state).name,
    workflowType: getEngageAddState(state).workflowType
});

const mapDispatchToProps = dispatch => ({
    updateEngageInfo: bindActionCreators(updateEngageInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EngageAdd);
