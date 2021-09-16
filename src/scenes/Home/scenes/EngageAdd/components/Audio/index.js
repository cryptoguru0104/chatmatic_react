import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { FileUploader } from 'components';

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
import { Svg } from "../../../../Layout";

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeActionBtn: -1,
      target: null
    };
  }

  _onAudioLoad = audio => {
    this.props.actions.fileUpload(
      this.props.pageId,
      this.props.currentStep.stepUid,
      this.props.itemIndex,
      audio
    );
  };

  _renderAudioUploader = () => (
    <div
      className="position-relative w-100 h-100 d-flex flex-column align-items-center"
      style={{ paddingTop: 40 }}
    >
      <img src={uploadIcon} alt="" width="24" />
      <span style={{ fontSize: 14, color: '#b1b9cc', marginTop: 11 }}>
        Drag and drop your audio, or{' '}
        <span className="text-underline">browse</span>
      </span>
      <img
        src={warningIcon}
        alt=""
        className="position-absolute upload-warning"
      />
    </div>
  );

  _deleteComponent = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete this audio',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this audio',
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
      <div
        className="position-relative d-flex flex-column audio-container"
        style={{ minHeight: !!this.props.currentItem.audio ? 75 : 162 }}
      >
        <FileUploader
          style={{
            width: '100%',
            height: !!this.props.currentItem.audio ? 52 : 139,
            borderRadius: 6,
            backgroundColor: '#f9fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          handleOnLoad={this._onAudioLoad}
          file={this.props.currentItem.audio || ''}
          type="audio"
          renderContent={this._renderAudioUploader}
          stepUid={this.props.currentStep.stepUid}
          itemIndex={this.props.itemIndex}
        />
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
          {this.props.currentStep.items.length - 1 > this.props.itemIndex &&
            this.props.currentStep.items[this.props.itemIndex + 1].type !==
              'free_text_input' && (
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
      </div>
    );
  }
}

Audio.propTypes = {
  pageId: PropTypes.string.isRequired,
  itemIndex: PropTypes.number.isRequired,
  currentStep: PropTypes.object.isRequired,
  currentItem: PropTypes.shape({
    type: PropTypes.string.isRequired,
    audio: PropTypes.string,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Audio);
