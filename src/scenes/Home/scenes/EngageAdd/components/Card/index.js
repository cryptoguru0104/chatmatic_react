import React from "react";
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Button, Icon } from "semantic-ui-react";
import { Popover } from "@material-ui/core";

import { FileUploader, Popover as Popover2, InlineEdit } from "components";
import { getPageFromId } from "services/pages/selector";
import { getPageFromUrl } from 'services/pages/selector';
import ActionButton from "../../components/ActionButton";
import Headline from "../Headline";
import Description from "../Description";
import GifSearch from "../GifSearch";
import ImageFinder from "../ImageFinder";
import UrlEdit from "../Image/UrlEdit";

import { getActiveItem, getCurrentStep } from "../../services/selector";
import {
    updateItemInfo,
    deleteItemInfo,
    addActionButton,
    updateActionButton,
    deleteActionButton,
    swapItem,
    fileUpload
} from "../../services/actions";
import { screenOrientation } from "../../../../../../constants/AppConstants";
import { Svg, Block } from "../../../../Layout";

import "./styles.css";
import uploadIcon from "assets/images/icon-upload.png";
import warningIcon from "assets/images/icon-warning.png";
import openUrlIcon from "assets/images/icon-open-url.png";
import phoneIcon from "assets/images/icon-phone-call.png";
import shareIcon from "assets/images/icon-share.png";
import sendMessageIcon from "assets/images/icon-send-message.png";

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeActionBtn: null,
            imageLinkEditing: false,
            target: null,
            targetName: ""
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

    _imageOnUrlSave = url => {
        this.props.actions.fileUpload(
            this.props.pageId,
            this.props.currentStep.stepUid,
            this.props.itemIndex,
            null,
            0,
            url
        );
        this.setState({ target: null, targetName: "" });
    };

    _renderImageUploader = () => (
        <div
            className="position-relative w-100 h-100 d-flex flex-column align-items-center"
            style={{ paddingTop: 40, minHeight: 139 }}
        >
            <img src={uploadIcon} alt="" width="24" />
            <span style={{ fontSize: 14, color: "#b1b9cc", marginTop: 11 }}>
                Drag and drop your image,{" "}
                <span className="text-underline">browse</span>, or {""} <br />
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
        this.setState({ target: null, targetName: "" });
        this.props.actions.updateActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn,
            data
        );
    };

    _deleteActionItem = () => {
        this.setState({ target: null, targetName: "" });
        this.props.actions.deleteActionButton(
            this.props.itemIndex,
            this.state.activeActionBtn
        );
    };

    _deleteComponent = () => {
        Swal({
            title: "Are you sure?",
            text: "Please verify that you want to delete this card",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete this card",
            cancelButtonText: "No, I want to keep it",
            confirmButtonColor: "#f02727"
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteItemInfo(this.props.itemIndex);
            }
        });
    };

    _setCarouselOrientation = (orientation = screenOrientation.portrait) => {
        const item = { ...this.props.currentItem };
        item.orientation = orientation;
        this.props.actions.updateItemInfo(this.props.itemIndex, item);
    };

    render() {
        const { isRestrictedForJSON } = this.props;
        const selectedOrientation = this.props.currentItem.orientation;

        return (
            <div
                className="position-relative "
                className={`position-relative d-flex flex-column card-container ${selectedOrientation ||
                    "landscape"}`}
            >
                <Block className="changeView">
                    <Button
                        className="btn portrait"
                        onClick={() =>
                            this._setCarouselOrientation(
                                screenOrientation.portrait
                            )
                        }
                    >
                        <Icon name="file image outline" />
                    </Button>
                    <Button
                        className="btn landscape"
                        onClick={() =>
                            this._setCarouselOrientation(
                                screenOrientation.landscape
                            )
                        }
                    >
                        <Icon name="image outline" />
                    </Button>
                </Block>
                <FileUploader
                    style={{
                        minHeight: 139,
                        borderTopRightRadius: 18,
                        backgroundColor: "#f5f6fa",
                        borderTopLeftRadius: 18,
                        borderWidth: 1,
                        borderColor: "#ebebeb",
                        borderStyle: "solid",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundImage: `url(${this.props.currentItem.image ||
                            ""})`
                    }}
                    handleOnLoad={this._onImageLoad}
                    file={this.props.currentItem.image || ""}
                    type="image"
                    className="uploader"
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
                                    targetName: "image",
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
                                    targetName: "urlEdit",
                                    target: event.target
                                });
                            }}
                        >
                            Url
                        </button>
                    </div>
                    {(!isRestrictedForJSON && this.props.currentPage.source == 'fb') && (
                        <div className="mx-2">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={event => {
                                    this.setState({
                                        targetName: "gif",
                                        target: event.target
                                    });
                                }}
                            >
                                Gif
                            </button>
                        </div>
                    )}
                </div>
                <div className="d-flex flex-column card-content">
                    <Headline
                        headline={this.props.currentItem.headline || ""}
                        updateItemInfo={data =>
                            this.props.actions.updateItemInfo(
                                this.props.itemIndex,
                                data
                            )
                        }
                    />
                    <Description
                        description={this.props.currentItem.description || ""}
                        updateItemInfo={data =>
                            this.props.actions.updateItemInfo(
                                this.props.itemIndex,
                                data
                            )
                        }
                    />
                    <InlineEdit
                        text={this.props.currentItem.imageLink || ""}
                        paramName="imageLink"
                        change={params =>
                            this.props.actions.updateItemInfo(
                                this.props.itemIndex,
                                {
                                    imageLink: params.imageLink
                                }
                            )
                        }
                        placeholder="Image Link (Optional)"
                        editing={this.state.imageLinkEditing}
                        onChangeEditing={imageLinkEditing =>
                            this.setState({ imageLinkEditing })
                        }
                        className="image-link"
                        activeClassName="image-link-active"
                        minLength={0}
                    />
                </div>
                {this.props.currentItem.actionBtns &&
                    this.props.currentItem.actionBtns.map(
                        (actionBtn, index) => {
                            const actionIcon = actionBtn.label
                                ? actionBtn.actionType === "web_url"
                                    ? openUrlIcon
                                    : actionBtn.actionType === "phone_number"
                                    ? phoneIcon
                                    : actionBtn.actionType === "share"
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
                                    className="position-relative d-flex align-items-center justify-content-center text-primary card-action-btn"
                                    onClick={event =>
                                        this.setState({
                                            activeActionBtn: index,
                                            target: event.target,
                                            targetName: "action"
                                        })
                                    }
                                >
                                    {actionBtn.label
                                        ? actionBtn.label
                                        : "No Button Label"}
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
                        className="btn btn-link mr-0 font-weight-normal card-add-btn"
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
                <div
                    className="position-absolute d-flex justify-content-center align-items-center bg-white delete-btn"
                    onClick={this._deleteComponent}
                >
                    <Svg name="delete" />
                </div>
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
                            .type !== "free_text_input" && (
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
                {this.state.target && (
                    <Popover
                        open={this.state.target || false}
                        anchorEl={this.state.target}
                        anchorOrigin={{
                            vertical: "center",
                            horizontal: "left"
                        }}
                        transformOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        disablePortal
                        onClose={() => this.setState({ target: null })}
                    >
                        {this.state.targetName == "action" && (
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
                        {this.state.targetName == "image" && (
                            <ImageFinder onSave={this._imageOnUrlSave} />
                        )}
                        {this.state.targetName == "urlEdit" && (
                            <UrlEdit url="" onSave={this._imageOnUrlSave} />
                        )}
                        {(!isRestrictedForJSON && this.props.currentPage.source == 'fb') &&
                            this.state.targetName == "gif" && (
                                <GifSearch onSave={this._imageOnUrlSave} />
                            )}
                    </Popover>
                )}
            </div>
        );
    }
}

Card.propTypes = {
    pageId: PropTypes.string.isRequired,
    itemIndex: PropTypes.number.isRequired,
    currentStep: PropTypes.object.isRequired,
    currentItem: PropTypes.shape({
        type: PropTypes.string.isRequired,
        image: PropTypes.string,
        headline: PropTypes.string,
        description: PropTypes.string,
        actionBtns: PropTypes.array,
        imageLink: PropTypes.string
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

Card.defaultProps = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
