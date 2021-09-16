import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import { getCampaignAdd } from '../../../../../../services/selector';
import { updateNewCampaignInfo } from '../../../../../../services/actions';

/** Import Components */
import { FileUploader } from 'components';

import uploadIcon from 'assets/images/icon-upload.png';

class PreSubmit extends React.Component {
  _nextStep = () => {
    if (!this.props.campaignAdd.campaignName) {
      toastr.warning('WARNING!', 'Please do not forget give a campaign name.');
    } else {
      this.props.onSelectStep('postsubmit');
    }
  };

  _imageChange = presubmitImage => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { presubmitImage },
      false
    );
  };

  _inputChange = event => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { [event.target.name]: event.target.value },
      false
    );
  };

  _renderImageUploader = () => (
    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
      <img src={uploadIcon} alt="" width="32" />
      <span style={{ fontSize: 14, color: '#b1b9cc', marginTop: 11 }}>
        Drag and drop your image, or{' '}
        <span className="text-underline">browse</span>
      </span>
    </div>
  );

  render() {
    const imgUploaderStyles = {
      position: 'relative',
      width: '100%',
      height: '200px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    return (
      <div>
        <div className="d-flex form-group mt-4">
          <input
            type="text"
            className="form-control"
            onChange={this._inputChange}
            value={this.props.campaignAdd.campaignName || ''}
            name="campaignName"
            placeholder="Add Campaign Name Here"
          />
        </div>

        <hr className="mt-1" />

        <div className="form-group">
          <label className="m-0">Headline</label>
          <input
            type="text"
            className="form-control"
            value={this.props.campaignAdd.presubmitTitle || ''}
            onChange={this._inputChange}
            name="presubmitTitle"
          />
        </div>
        <div className="form-group">
          <label className="m-0">Description</label>
          <textarea
            rows="3"
            className="form-control"
            value={this.props.campaignAdd.presubmitBody || ''}
            onChange={this._inputChange}
            name="presubmitBody"
          />
        </div>
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center m-0">
            <label>
              Image Upload <span className="text-muted">(Optional)</span>
            </label>
          </div>
          <div>
            <FileUploader
              style={imgUploaderStyles}
              handleOnLoad={presubmitImage => this._imageChange(presubmitImage)}
              handleClearToDefault={() => this._imageChange('')}
              file={this.props.campaignAdd.presubmitImage || ''}
              type="image"
              renderContent={this._renderImageUploader}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary px-5 ml-auto rounded-0"
            onClick={this._nextStep}
          >
            Next <i className="fa fa-arrow-right ml-2" />
          </button>
        </div>
      </div>
    );
  }
}

PreSubmit.propTypes = {
  onSelectStep: PropTypes.func.isRequired,
  campaignAdd: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  campaignAdd: getCampaignAdd(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateNewCampaignInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreSubmit)
);
