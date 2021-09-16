import React from 'react';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { Popover } from 'components';
import ActionButton from '../../components/ActionButton';
import TextEdit from '../TextEdit';

import { getActiveItem, getCurrentStep } from '../../services/selector';
import {
    updateItemInfo,
    deleteItemInfo,
    addActionButton,
    updateActionButton,
    deleteActionButton,
    swapItem
} from '../../services/actions';
import { getPageFromUrl } from 'services/pages/selector';

import './styles.css';
import warningIcon from 'assets/images/icon-warning.png';
import openUrlIcon from 'assets/images/icon-open-url.png';
import phoneIcon from 'assets/images/icon-phone-call.png';
import shareIcon from 'assets/images/icon-share.png';
import sendMessageIcon from 'assets/images/icon-send-message.png';
import { getEngageAddState } from '../../services/selector';
import { Svg } from "../../../../Layout";

const MESSAGE_LENGTH = 2000;
const MESSAGE_LENGTH_WITH_BUTTON = 640;

class Text extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeActionBtn: null,
            target: null
        };
    }

    _saveActionChanges = data => {
        this.setState({ target: null });
        this.props.actions.updateActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn,
            data
        );
    };

    _deleteActionItem = () => {
        this.setState({ target: null });
        this.props.actions.deleteActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn
        );
    };

    _deleteComponent = () => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this text',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this text',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteItemInfo(this.props.itemIndex);
            }
        });
    };

    render() {
        const { steps, currentStep, newWorkflowType } = this.props;
        let isRestrictedForJSON = false;
        if (
            currentStep &&
            steps[0].stepUid === currentStep.stepUid &&
            currentStep.items.length > 0 &&
            (
                newWorkflowType === 'json'
            )
        ) {
            isRestrictedForJSON = true;
        }
        console.log('isRestrictedForJSON', isRestrictedForJSON);
        console.log(this.props.page);
        const max_length = this.props.currentItem.actionBtns && this.props.currentItem.actionBtns.length > 0 ? MESSAGE_LENGTH_WITH_BUTTON : MESSAGE_LENGTH;
        return (
            <div className="position-relative d-flex flex-column text-container">
                <div className="d-flex flex-column position-relative text-content">
                    <TextEdit
                        isRestrictedForJSON={isRestrictedForJSON}
                        textMessage={this.props.currentItem.textMessage || ''}
                        updateItemInfo={data =>
                            this.props.actions.updateItemInfo(
                                this.props.itemIndex,
                                data
                            )
                        }
                        maxLength={max_length}
                    />
                </div>
                {this.props.currentItem.actionBtns &&
                    this.props.currentItem.actionBtns.map(
                        (actionBtn, index) => {
                            const actionIcon = actionBtn.label
                                ? actionBtn.actionType === 'web_url'
                                    ? openUrlIcon
                                    : actionBtn.actionType === 'phone_number'
                                    ? phoneIcon
                                    : actionBtn.actionType === 'share'
                                    ? shareIcon
                                    : sendMessageIcon
                                : warningIcon;

                            return (
                                <div
                                    key={index}
                                    style={{
                                        borderBottomLeftRadius:
                                            index === 2 ? 18 : 0,
                                        borderBottomRightRadius:
                                            index === 2 ? 18 : 0
                                    }}
                                    className="position-relative d-flex align-items-center justify-content-center text-action-btn"
                                    onClick={event =>
                                        this.setState({
                                            activeActionBtn: index,
                                            target: event.target
                                        })
                                    }
                                >
                                    {actionBtn.label
                                        ? actionBtn.label
                                        : 'No Button Label'}
                                    <img
                                        src={actionIcon}
                                        alt=""
                                        className="position-absolute action-icon"
                                    />
                                </div>
                            );
                        }
                    )}
                {!(
                    this.props.page.source == 'ig' ||
                    (this.props.currentItem.actionBtns &&
                    this.props.currentItem.actionBtns.length >= 3)
                ) && (
                    <span
                        className="btn btn-link mr-0 font-weight-normal text-add-btn"
                        onClick={() =>
                            this.props.actions.addActionButton(
                                this.props.itemIndex
                            )
                        }
                    >
                        <Svg name="toolbar-plus" />
                        Add Button
                    </span>
                )}
                <div className="position-absolute d-flex flex-column swap-container">
                    {this.props.itemIndex > 0 && (
                        <button
                            className="btn btn-link btn-swap-prev mr-0"
                            onClick={() =>
                                this.props.actions.swapItem(
                                    this.props.itemIndex,
                                    this.props.itemIndex - 1
                                )
                            }
                        >
                            <i className="fa fa-arrow-up" />
                        </button>
                    )}
                    {this.props.currentStep.items.length - 1 >
                        this.props.itemIndex &&
                        this.props.currentStep.items[this.props.itemIndex + 1]
                            .type !== 'free_text_input' && (
                            <button
                                className="btn btn-link btn-swap-next"
                                onClick={() =>
                                    this.props.actions.swapItem(
                                        this.props.itemIndex,
                                        this.props.itemIndex + 1
                                    )
                                }
                            >
                                <i className="fa fa-arrow-down" />
                            </button>
                        )}
                </div>
                <div
                    className="position-absolute d-flex justify-content-center align-items-center bg-white delete-btn"
                    onClick={this._deleteComponent}
                >
                    <Svg name="delete" />
                </div>
                {this.state.target && (
                    <Popover
                        isOpen={true}
                        target={this.state.target}
                        offset={75}
                        toggle={() => this.setState({ target: null })}
                    >
                        <ActionButton
                            onSave={this._saveActionChanges}
                            onDeleteItem={this._deleteActionItem}
                            item={
                                this.props.currentItem.actionBtns[
                                    this.state.activeActionBtn
                                ]
                            }
                        />
                    </Popover>
                )}
            </div>
        );
    }
}

Text.propTypes = {
    pageId: PropTypes.string.isRequired,
    itemIndex: PropTypes.number.isRequired,
    currentStep: PropTypes.object.isRequired,
    currentItem: PropTypes.shape({
        type: PropTypes.string.isRequired,
        textMessage: PropTypes.string,
        actionBtns: PropTypes.array
    }).isRequired,
    actions: PropTypes.shape({
        updateItemInfo: PropTypes.func.isRequired,
        deleteItemInfo: PropTypes.func.isRequired,
        addActionButton: PropTypes.func.isRequired,
        updateActionButton: PropTypes.func.isRequired,
        deleteActionButton: PropTypes.func.isRequired,
        swapItem: PropTypes.func.isRequired
    }).isRequired,
    isRestrictedForJSON: PropTypes.bool.isRequired
};

Text.defaultProps = {
    isRestrictedForJSON: false
};

const urlParams = new URLSearchParams(window.location.search);
const mapStateToProps = (state, props) => ({
    currentItem: getActiveItem(state, props),
    currentStep: getCurrentStep(state),
    steps: getEngageAddState(state).steps,
    newWorkflowType: urlParams.get('type'),
    page: getPageFromUrl(state, props),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateItemInfo,
            deleteItemInfo,
            addActionButton,
            updateActionButton,
            deleteActionButton,
            swapItem
        },
        dispatch
    )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Text));
