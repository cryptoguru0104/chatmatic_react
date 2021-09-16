import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Download from 'downloadjs';

import { getCampaignAdd } from '../../../services/selector';
import { clearCampaignAddState } from '../../../services/actions';

class HowToUse extends Component {
  _submit = () => {
    this.props.history.push(`/page/${this.props.pageId}/campaigns`);
    this.props.actions.clearCampaignAddState();
  };

  _download500ScanCode = imgURL => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', imgURL, true);
    httpRequest.setRequestHeader(
      'Access-Control-Allow-Origin',
      process.env.REACT_APP_MEDIA_SERVER
    );
    httpRequest.setRequestHeader(
      'Access-Control-Allow-Headers',
      'X-Custom-Header'
    );
    httpRequest.responseType = 'blob';
    httpRequest.onload = function() {
      Download(httpRequest.response, 'medium.png', 'image/png');
    };
    httpRequest.send();
  };

  render() {
    if (this.props.loading) {
      Swal({
        title: 'Please wait...',
        text: 'We are creating a new campaign...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      return <div />;
    } else {
      Swal.close();

      if (this.props.error || !this.props.campaignAdd.publicId) {
        Swal({
          title: 'Campaign Creation Error',
          text: this.props.error,
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });

        this.props.onBack();
      }
    }

    const scanCodeIcon = `${
      process.env.REACT_APP_MEDIA_SERVER
    }/public/messenger_codes/${this.props.campaignAdd.publicId}/medium.png`;
    const allCodesDownloadUrl = `${
      process.env.REACT_APP_MEDIA_SERVER
    }/public/messenger_codes/${
      this.props.campaignAdd.publicId
    }/messenger-codes.zip`;

    return (
      <div className="d-flex flex-column align-items-center w-100 mt-3 how-to-use-container">
        <div className="d-flex justify-content-center action-step-bar">
          <div className="d-flex flex-column align-items-center bg-primary px-3 py-2 text-white action-submit">
            <span>SUBMIT ACTION</span>
            <i className="fa fa-check" />
          </div>
          <div className="d-flex flex-column align-items-center bg-primary px-3 py-2 text-white how-to-use">
            <span>HOW TO USE IT</span>
            <i className="fa fa-ellipsis-h" />
          </div>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center w-100 mt-4 link-container">
          <img src={scanCodeIcon} alt="" width="200" height="200" />
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn p-2 mx-3"
              onClick={() => this._download500ScanCode(scanCodeIcon)}
            >
              <i className="fa fa-download mr-2" />
              500 X 500 png
            </button>
            <a href={allCodesDownloadUrl} className="btn p-2 mx-3" download>
              <i className="fa fa-download mr-2" />
              All Sizes zip
            </a>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4 w-100 step-nav-actions">
          <button
            className="btn btn-light px-5 py-2 btn-back"
            onClick={this.props.onBack}
          >
            <i className="fa fa-arrow-left mr-2" />
            Back
          </button>
          <button
            className="btn btn-primary px-5 py-2 btn-next"
            onClick={this._submit}
          >
            Finish
          </button>
        </div>
      </div>
    );
  }
}

HowToUse.propTypes = {
  pageId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,

  campaignAdd: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  history: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  campaignAdd: getCampaignAdd(state),
  loading: state.default.scenes.campaignAdd.loading,
  error: state.default.scenes.campaignAdd.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      clearCampaignAddState
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HowToUse)
);
