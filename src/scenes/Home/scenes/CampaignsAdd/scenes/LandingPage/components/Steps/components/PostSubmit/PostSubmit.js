import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Import Components */
import { FileUploader } from 'components';

import { getCampaignAdd } from '../../../../../../services/selector';
import { updateNewCampaignInfo } from '../../../../../../services/actions';

import uploadIcon from 'assets/images/icon-upload.png';

class PostSubmit extends React.Component {
  componentWillMount() {
    if (!this.props.campaignAdd.postsubmitType) {
      this.props.actions.updateNewCampaignInfo(
        this.props.match.params.id,
        { postsubmitType: 'content_display' },
        false
      );
    }
  }

  _inputChange = event => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { [event.target.name]: event.target.value },
      false
    );
  };

  _imageChange = postsubmitContentImage => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { postsubmitContentImage },
      false
    );
  };

  _nextStep = () => {
    this.props.onSelectStep('submitAction');
  };

  renderShowSuccessPageForm = () => {
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
      <React.Fragment>
        <div className="form-group">
          <label>Headline</label>
          <input
            type="text"
            className="form-control"
            value={this.props.campaignAdd.postsubmitContentTitle || ''}
            onChange={this._inputChange}
            name="postsubmitContentTitle"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            className="form-control"
            value={this.props.campaignAdd.postsubmitContentBody || ''}
            onChange={this._inputChange}
            name="postsubmitContentBody"
          />
        </div>

        <div className="form-group">
          <label>
            Image Upload <span className="text-muted">(Optional)</span>
          </label>
          <FileUploader
            style={imgUploaderStyles}
            handleOnLoad={postsubmitContentImage =>
              this._imageChange(postsubmitContentImage)
            }
            handleClearToDefault={() => this._imageChange('')}
            file={this.props.campaignAdd.postsubmitContentImage}
            type="image"
            renderContent={this._renderImageUploader}
          />
        </div>

        <div className="form-group">
          <label>Customize Button Redirect URL</label>
          <input
            type="text"
            className="form-control"
            value={this.props.campaignAdd.postsubmitRedirectUrl || ''}
            onChange={this._inputChange}
            name="postsubmitRedirectUrl"
          />
        </div>

        <div className="form-group">
          <label>Customize Button Text</label>
          <input
            type="text"
            className="form-control"
            placeholder="Custom Button Text"
            value={this.props.campaignAdd.postsubmitRedirectUrlButtonText || ''}
            onChange={this._inputChange}
            name="postsubmitRedirectUrlButtonText"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-white border px-5 rounded-0"
            onClick={() => this.props.onSelectStep('presubmit')}
          >
            <i className="fa fa-arrow-left mr-2" />
            Back
          </button>
          <button
            className="btn btn-primary px-5 ml-auto rounded-0"
            onClick={this._nextStep}
          >
            Next
            <i className="fa fa-arrow-right ml-2" />
          </button>
        </div>
      </React.Fragment>
    );
  };

  renderRedirecUrlForm = () => {
    return (
      <div>
        <div className="form-group">
          <label>Customize Redirect URL</label>
          <input
            type="text"
            className="form-control"
            value={this.props.campaignAdd.postsubmitRedirectUrl || ''}
            onChange={this._inputChange}
            name="postsubmitRedirectUrl"
          />
        </div>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-white border px-5 rounded-0"
            onClick={() => this.props.onSelectStep('presubmit')}
          >
            <i className="fa fa-arrow-left mr-2" />
            Back
          </button>
          <button
            className="btn btn-primary px-5 ml-auto rounded-0"
            onClick={this._nextStep}
          >
            Next
            <i className="fa fa-arrow-right ml-2" />
          </button>
        </div>
      </div>
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
    let postsubmitForm;
    if (this.props.campaignAdd.postsubmitType === 'content_display') {
      postsubmitForm = this.renderShowSuccessPageForm();
    } else {
      postsubmitForm = this.renderRedirecUrlForm();
    }

    return (
      <div>
        <div className="form-group text-center mt-5">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="postsubmitType"
              id="content_display"
              value="content_display"
              onChange={this._inputChange}
              checked={
                this.props.campaignAdd.postsubmitType === 'content_display'
              }
            />
            <label className="form-check-label" htmlFor="content_display">
              Show Success Page
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="postsubmitType"
              id="redirect_url"
              value="redirect_url"
              onChange={this._inputChange}
              checked={this.props.campaignAdd.postsubmitType === 'redirect_url'}
            />
            <label className="form-check-label" htmlFor="redirect_url">
              Redirect to URL
            </label>
          </div>
        </div>
        {postsubmitForm}
      </div>
    );
  }
}

PostSubmit.propTypes = {
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
  )(PostSubmit)
);
