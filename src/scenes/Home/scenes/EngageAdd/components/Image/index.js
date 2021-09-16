import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { FileUploader, Popover } from 'components';
import ActionButton from '../../components/ActionButton';
import ImageFinder from '../ImageFinder';
import UrlEdit from '../../components/Image/UrlEdit/index';
import GifSearch from '../GifSearch';
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

import { getPageFromId } from "services/pages/selector";
import { getPageFromUrl } from 'services/pages/selector';

class Image extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeActionBtn: -1,
            target: null,
            targetName: ''
        };
    }

    _onImageLoad = image => {
        this.props.actions.fileUpload(
            this.props.pageId,
            this.props.currentStep.stepUid,
            this.props.itemIndex,
            image
        );
    };

    _imageOnSave = url => {
        this.props.actions.fileUpload(
            this.props.pageId,
            this.props.currentStep.stepUid,
            this.props.itemIndex,
            null,
            0,
            url
        );
        this.setState({ target: null, targetName: '' });
    };

    _renderImageUploader = () => (
        <div
            className="position-relative w-100 h-100 d-flex flex-column align-items-center"
            style={{ paddingTop: 40, minHeight: 139 }}
        >
            <img src={uploadIcon} alt="" width="24" />
            <span style={{ fontSize: 14, color: '#b1b9cc', marginTop: 11 }}>
                Drag and drop your image,{' '}
                <span className="text-underline">browse</span>, or
                {''} <br />
                select an action below
            </span>
            <img
                src={warningIcon}
                alt=""
                className="position-absolute upload-warning"
            />
        </div>
    );

    _saveActionChanges = data => {
        this.setState({ target: null, targetName: '' });
        this.props.actions.updateActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn,
            data
        );
    };

    _deleteActionItem = () => {
        this.setState({ target: null, targetName: '' });
        this.props.actions.deleteActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn
        );
    };

    _deleteComponent = () => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this Image',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this Image',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteItemInfo(this.props.itemIndex);
            }
        });
    };

    render() {
        const { isRestrictedForJSON } = this.props;
        return (
            <div className="position-relative d-flex flex-column image-container">
                <FileUploader
                    style={{
                        width: '100%',
                        minHeight: 139,
                        backgroundColor: '#f9fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: '6px'
                    }}
                    handleOnLoad={this._onImageLoad}
                    file={this.props.currentItem.image || ''}
                    type="image"
                    renderContent={this._renderImageUploader}
                    stepUid={this.props.currentStep.stepUid}
                    itemIndex={this.props.itemIndex}
                />
                <div className="d-flex flex-row justify-content-center my-3 image-actions">
                    <div className="mx-2">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={event => {
                                this.setState({
                                    targetName: 'image',
                                    target: event.target
                                });
                            }}
                        >
                            Search
                        </button>
                    </div>
                    <div className="mx-2">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={event => {
                                this.setState({
                                    targetName: 'urlEdit',
                                    target: event.target
                                });
                            }}
                        >
                            Url
                        </button>
                    </div>
                    {(!isRestrictedForJSON &&  this.props.currentPage.source == 'fb') && (
                        <div className="mx-2">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={event => {
                                    this.setState({
                                        targetName: 'gif',
                                        target: event.target
                                    });
                                }}
                            >
                                Gif
                            </button>
                        </div>
                    )}
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
                                    className="position-relative d-flex align-items-center justify-content-center text-primary image-action-btn"
                                    onClick={event =>
                                        this.setState({
                                            activeActionBtn: index,
                                            target: event.target,
                                            targetName: 'action'
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
                        className="btn btn-link mr-0 font-weight-normal image-add-btn"
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
                        toggle={() =>
                            this.setState({ target: null, targetName: '' })
                        }
                    >
                        {this.state.targetName == 'action' && (
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
                        )}
                        {this.state.targetName == 'image' && (
                            <ImageFinder onSave={this._imageOnSave} />
                        )}
                        {this.state.targetName == 'urlEdit' && (
                            <UrlEdit url="" onSave={this._imageOnSave} />
                        )}
                        {(this.state.targetName == 'gif' && this.props.currentPage.source == 'fb') && (
                            <GifSearch onSave={this._imageOnSave} />
                        )}
                    </Popover>
                )}
            </div>
        );
    }
}

Image.propTypes = {
    pageId: PropTypes.string.isRequired,
    isRestrictedForJSON: PropTypes.bool.isRequired,
    itemIndex: PropTypes.number.isRequired,
    currentStep: PropTypes.object.isRequired,
    currentItem: PropTypes.shape({
        type: PropTypes.string.isRequired,
        image: PropTypes.string,
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
Image.defaultProps = {
    isRestrictedForJSON: false
};
const mapStateToProps = (state, props) => ({
    currentItem: getActiveItem(state, props),
    currentStep: getCurrentStep(state),
    currentPage: getPageFromUrl(state, props)
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Image));
