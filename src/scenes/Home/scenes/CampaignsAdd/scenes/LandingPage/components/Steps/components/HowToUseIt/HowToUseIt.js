import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getCampaignAdd } from '../../../../../../services/selector';
import { clearCampaignAddState } from '../../../../../../services/actions';

class HowToUseIt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };
  }

  _submit = () => {
    this.props.history.push(`/page/${this.props.match.params.id}/campaigns`);
    this.props.actions.clearCampaignAddState();
  };

  _copyUrl = () => {
    this.setState({ copied: true });
    toastr.success('Success!', 'Copied');
  };

  render() {
    if (!process.env.REACT_APP_PUBLIC_URL) {
      toastr.error('You must add PUBLIC_URL value to env file.');
      this.props.onSelectStep('submitAction');
    }

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

        this.props.onSelectStep('submitAction');
      }
    }

    return (
      <div>
        <div className="form-group my-5">
          <label className="m-auto">Your Landing Page URL</label>
          <div className="input-group">
            <input
              type="text"
              ref={ref => (this.urlRef = ref)}
              className="form-control"
              value={`${process.env.REACT_APP_PUBLIC_URL}c/?id=${
                this.props.campaignAdd.publicId
              }`}
              disabled
            />
            <div className="input-group-append">
              <CopyToClipboard
                text={`${process.env.REACT_APP_PUBLIC_URL}c/?id=${
                  this.props.campaignAdd.publicId
                }`}
                onCopy={() => this._copyUrl()}
              >
                <i className="fa fa-clipboard input-group-text" />
              </CopyToClipboard>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between ">
          <button
            className="btn btn-white border px-5 rounded-0"
            onClick={() => this.props.onSelectStep('submitAction')}
          >
            <i className="fa fa-arrow-left mr-2" /> Back
          </button>
          <button
            className="btn btn-primary px-5 ml-auto rounded-0"
            onClick={this._submit}
          >
            Finish
          </button>
        </div>
      </div>
    );
  }
}

HowToUseIt.propTypes = {
  onSelectStep: PropTypes.func.isRequired,
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
  )(HowToUseIt)
);
