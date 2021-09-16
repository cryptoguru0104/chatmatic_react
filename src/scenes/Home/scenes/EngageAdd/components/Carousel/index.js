import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { FileUploader, Popover, InlineEdit } from 'components';
import ActionButton from '../../components/ActionButton';
import Headline from '../Headline';
import Description from '../Description';
import ImageFinder from '../ImageFinder';
import GifSearch from '../GifSearch';
import UrlEdit from '../Image/UrlEdit';

import { getActiveItem, getCurrentStep } from '../../services/selector';
import {
    updateItemInfo,
    deleteItemInfo,
    updateCarouselItemInfo,
    deleteCarouselItemInfo,
    addActionButton,
    updateActionButton,
    deleteActionButton,
    addCarouselActionButton,
    updateCarouselActionButton,
    deleteCarouselActionButton,
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
import { screenOrientation } from '../../../../../../constants/AppConstants';
import { Svg, Block } from "../../../../Layout";
import { Icon } from 'semantic-ui-react';
import { Button } from "semantic-ui-react";
import { getPageFromId } from "services/pages/selector";
import { getPageFromUrl } from 'services/pages/selector';

class Carousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeActionBtn: null,
            target: null,
            targetName: '',
            activeItemIndex: 0,
            imageLinkEditing: false
        };
    }

    _imageOnUrlSave = url => {
        this.props.actions.fileUpload(
            this.props.pageId,
            this.props.currentStep.stepUid,
            this.props.itemIndex,
            null,
            this.state.activeItemIndex,
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
                <span className="text-underline">browse</span>, or {''} <br />
                select an action below
            </span>
        </div>
    );

    _deleteComponent = () => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this carousel',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this carousel',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteItemInfo(this.props.itemIndex);
            }
        });
    };

    _addCarouselItem = () => {
        const carouselItems = this.props.currentItem.items.concat([
            {
                image: '',
                headline: '',
                description: '',
                actionBtns: [],
                error: true
            }
        ]);

        this.setState({ activeItemIndex: this.props.currentItem.items.length });

        this.props.actions.updateItemInfo(this.props.itemIndex, {
            items: carouselItems
        });
    };

    _deleteCarouselItem = () => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete carousel item.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this carousel item',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                const currentIndex = this.state.activeItemIndex;

                this.setState({
                    activeItemIndex: currentIndex === 0 ? 0 : currentIndex - 1
                });
                this.props.actions.deleteCarouselItemInfo(
                    this.props.itemIndex,
                    currentIndex
                );
            }
        });
    };

    _setCarouselOrientation = (orientation = screenOrientation.portrait) => {
        const item = { ...this.props.currentItem };
        item.orientation = orientation;
        this.props.actions.updateItemInfo(this.props.itemIndex, item);
    };

    render() {
        const {
            image,
            headline,
            description,
            imageLink,
            actionBtns
        } = this.props.currentItem.items[this.state.activeItemIndex];
        const { isRestrictedForJSON } = this.props;
        const selectedOrientation = this.props.currentItem.orientation;

        return (
            <div className="position-relative d-flex flex-column carousel-container">
                <div className="position-relative">
                    <div
                        className={`position-relative carousel-images ${selectedOrientation}`}
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
                                width: '100%',
                                minHeight: 139,
                                backgroundColor: '#f9fafc',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                backgroundImage: `url(${image || ''})`,
                                borderRadius: '6px'
                            }}
                            handleOnLoad={image =>
                                this.props.actions.fileUpload(
                                    this.props.pageId,
                                    this.props.currentStep.stepUid,
                                    this.props.itemIndex,
                                    image,
                                    this.state.activeItemIndex
                                )
                            }
                            file={image}
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
                            {(!isRestrictedForJSON && this.props.currentPage.source == 'fb') && (
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
                        {this.props.currentItem.items.length > 1 && (
                            <div
                                className="d-flex justify-content-center align-items-center position-absolute delete-carousel-icon"
                                onClick={this._deleteCarouselItem}
                            >
                                <i className="fa fa-eraser" />
                            </div>
                        )}
                        {this.state.activeItemIndex > 0 && (
                            <div
                                className="d-flex justify-content-center align-items-center position-absolute backward-carousel-icon"
                                onClick={() =>
                                    this.setState({
                                        activeItemIndex:
                                            this.state.activeItemIndex - 1
                                    })
                                }
                            >
                                <i className="fa fa-arrow-left" />
                            </div>
                        )}
                        {this.state.activeItemIndex !==
                            this.props.currentItem.items.length - 1 && (
                                <div
                                    className="d-flex justify-content-center align-items-center position-absolute forward-carousel-icon"
                                    onClick={() =>
                                        this.setState({
                                            activeItemIndex:
                                                this.state.activeItemIndex + 1
                                        })
                                    }
                                >
                                    <i className="fa fa-arrow-right" />
                                </div>
                            )}
                    </div>
                    <div className="d-flex flex-column carousel-content">
                        <Headline
                            headline={headline}
                            updateItemInfo={data =>
                                this.props.actions.updateCarouselItemInfo(
                                    this.props.itemIndex,
                                    this.state.activeItemIndex,
                                    data
                                )
                            }
                        />
                        <Description
                            description={description}
                            updateItemInfo={data =>
                                this.props.actions.updateCarouselItemInfo(
                                    this.props.itemIndex,
                                    this.state.activeItemIndex,
                                    data
                                )
                            }
                        />
                        <InlineEdit
                            text={imageLink}
                            paramName="imageLink"
                            change={params =>
                                this.props.actions.updateCarouselItemInfo(
                                    this.props.itemIndex,
                                    this.state.activeItemIndex,
                                    { imageLink: params.imageLink }
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
                    {this.props.currentItem.items.length < 10 && (
                        <button
                            className="position-absolute add-carousel-icon"
                            onClick={this._addCarouselItem}
                        >
                            <i className="fa fa-plus mr-1" />
                            Add Carousel Item
                        </button>
                    )}
                </div>
                {actionBtns.map((actionBtn, index) => {
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
                                borderBottomLeftRadius: index === 2 ? 18 : 0,
                                borderBottomRightRadius: index === 2 ? 18 : 0
                            }}
                            className="position-relative d-flex align-items-center justify-content-center text-primary carousel-action-btn"
                            onClick={event =>
                                this.setState({
                                    target: event.target,
                                    targetName: 'action',
                                    activeActionBtn: index
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
                })}
                {actionBtns.length < 3 && (
                    <span
                        className="btn btn-link mr-0 font-weight-normal carousel-add-btn"
                        onClick={() =>
                            this.props.actions.addCarouselActionButton(
                                this.props.itemIndex,
                                this.state.activeItemIndex
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
                        {this.state.targetName == 'action' && (
                            <ActionButton
                                onSave={data => {
                                    this.props.actions.updateCarouselActionButton(
                                        this.props.itemIndex,
                                        this.state.activeItemIndex,
                                        this.state.activeActionBtn,
                                        data
                                    );
                                    this.setState({
                                        target: null,
                                        targetName: '',
                                        activeActionBtn: null
                                    });
                                }}
                                onDeleteItem={() => {
                                    this.props.actions.deleteCarouselActionButton(
                                        this.props.itemIndex,
                                        this.state.activeItemIndex,
                                        this.state.activeActionBtn
                                    );
                                    this.setState({
                                        target: null,
                                        targetName: '',
                                        activeActionBtn: null
                                    });
                                }}
                                item={actionBtns[this.state.activeActionBtn]}
                                showShareOption={true}
                            />
                        )}
                        {this.state.targetName == 'image' && (
                            <ImageFinder onSave={this._imageOnUrlSave} />
                        )}
                        {this.state.targetName == 'urlEdit' && (
                            <UrlEdit url="" onSave={this._imageOnUrlSave} />
                        )}
                        {(!isRestrictedForJSON &&
                            this.state.targetName == 'gif' && this.props.currentPage.source == 'fb') && (
                                <GifSearch onSave={this._imageOnUrlSave} />
                            )}
                    </Popover>
                )}
            </div>
        );
    }
}

Carousel.propTypes = {
    pageId: PropTypes.string.isRequired,
    itemIndex: PropTypes.number.isRequired,
    currentStep: PropTypes.object.isRequired,
    currentItem: PropTypes.object.isRequired,
    actions: PropTypes.shape({
        updateItemInfo: PropTypes.func.isRequired,
        deleteItemInfo: PropTypes.func.isRequired,
        updateCarouselItemInfo: PropTypes.func.isRequired,
        deleteCarouselItemInfo: PropTypes.func.isRequired,
        addActionButton: PropTypes.func.isRequired,
        updateActionButton: PropTypes.func.isRequired,
        deleteActionButton: PropTypes.func.isRequired,
        addCarouselActionButton: PropTypes.func.isRequired,
        updateCarouselActionButton: PropTypes.func.isRequired,
        deleteCarouselActionButton: PropTypes.func.isRequired,
        swapItem: PropTypes.func.isRequired
    }).isRequired,
    isRestrictedForJSON: PropTypes.bool.isRequired
};
Carousel.defaultProps = {
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
            updateCarouselItemInfo,
            deleteCarouselItemInfo,
            addActionButton,
            updateActionButton,
            deleteActionButton,
            addCarouselActionButton,
            updateCarouselActionButton,
            deleteCarouselActionButton,
            swapItem,
            fileUpload
        },
        dispatch
    )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Carousel));
