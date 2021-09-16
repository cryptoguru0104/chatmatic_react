import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { FileUploader, Popover } from 'components';
import ActionButton from '../../components/ActionButton';

import { getActiveItem, getCurrentStep } from '../../services/selector';
import {
    updateItemInfo,
    deleteItemInfo,
    addActionButton,
    updateActionButton,
    deleteActionButton,
    swapItem,
    fileUpload
} from '../../services/actions';

import './styles.css';
import uploadIcon from 'assets/images/icon-upload.png';
import warningIcon from 'assets/images/icon-warning.png';
import openUrlIcon from 'assets/images/icon-open-url.png';
import phoneIcon from 'assets/images/icon-phone-call.png';
import shareIcon from 'assets/images/icon-share.png';
import sendMessageIcon from 'assets/images/icon-send-message.png';

import { Svg } from "../../../../Layout";

class Video extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeActionBtn: null,
            target: null
        };
    }

    _onVideoLoad = video => {
        this.props.actions.fileUpload(
            this.props.pageId,
            this.props.currentStep.stepUid,
            this.props.itemIndex,
            video
        );
    };

    _renderVideoUploader = () => (
        <div
            className="position-relative w-100 h-100 d-flex flex-column align-items-center"
            style={{ paddingTop: 40 }}
        >
            <img src={uploadIcon} alt="" width="24" />
            <span style={{ fontSize: 14, color: '#b1b9cc', marginTop: 11 }}>
                Drag and drop your video, or{' '}
                <span className="text-underline">browse</span>
            </span>
            <small>Video has a limit of 25mb upload</small>
            <img
                src={warningIcon}
                alt=""
                className="position-absolute upload-warning"
            />
        </div>
    );

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
            text: 'Please verify that you want to delete this video',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this video',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteItemInfo(this.props.itemIndex);
            }
        });
    };

    render() {
        return (
            <div className="position-relative d-flex flex-column video-container">
                <FileUploader
                    style={{
                        width: '100%',
                        minHeight: 139,
                        backgroundColor: '#f9fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: '6px'
                    }}
                    handleOnLoad={this._onVideoLoad}
                    file={this.props.currentItem.video || ''}
                    type="video"
                    renderContent={this._renderVideoUploader}
                    stepUid={this.props.currentStep.stepUid}
                    itemIndex={this.props.itemIndex}
                />
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
                                    className="position-relative d-flex align-items-center justify-content-center text-primary video-action-btn"
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
                    this.props.currentItem.actionBtns &&
                    this.props.currentItem.actionBtns.length >= 3
                ) && (
                    <span
                        className="btn btn-link mr-0 font-weight-normal video-add-btn"
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
                            showShareOption={true}
                        />
                    </Popover>
                )}
            </div>
        );
    }
}

Video.propTypes = {
    pageId: PropTypes.string.isRequired,
    itemIndex: PropTypes.number.isRequired,
    currentStep: PropTypes.object.isRequired,
    currentItem: PropTypes.shape({
        type: PropTypes.string.isRequired,
        video: PropTypes.string,
        actionBtns: PropTypes.array
    }).isRequired,
    actions: PropTypes.shape({
        updateItemInfo: PropTypes.func.isRequired,
        deleteItemInfo: PropTypes.func.isRequired,
        addActionButton: PropTypes.func.isRequired,
        updateActionButton: PropTypes.func.isRequired,
        deleteActionButton: PropTypes.func.isRequired,
        swapItem: PropTypes.func.isRequired
    }).isRequired
};

const mapStateToProps = (state, props) => ({
    currentItem: getActiveItem(state, props),
    currentStep: getCurrentStep(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateItemInfo,
            deleteItemInfo,
            addActionButton,
            updateActionButton,
            deleteActionButton,
            swapItem,
            fileUpload
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Video);
