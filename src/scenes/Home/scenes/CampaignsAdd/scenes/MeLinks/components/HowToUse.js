import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withRouter } from 'react-router-dom';

import { getCampaignAdd } from '../../../services/selector';
import {
  clearCampaignAddState,
  updateNewCampaignInfo
} from '../../../services/actions';

class HowToUse extends React.Component {
  state = {
    copied: false,
    customRef: this.props.campaignAdd.customRef || '',
    link: this.props.campaignAdd.mMeUrl,
    useCustomerRef: !!this.props.campaignAdd.customRef
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.campaignAdd.mMeUrl !== this.props.campaignAdd.mMeUrl) {
      this.setState({
        link: nextProps.campaignAdd.mMeUrl,
        customRef: nextProps.campaignAdd.customRef
      });
    }
  }

  _submit = () => {
    this.props.history.push(`/page/${this.props.pageId}/campaigns`);
    this.props.actions.clearCampaignAddState();
  };

  _changeLink = () => {
    const { customRef, useCustomerRef } = this.state;

    if (useCustomerRef) {
      if (!customRef) {
        toastr.warning(
          'Custom Ref Missing!',
          'You must provide your custom ref.'
        );
      } else {
        const replaceIndex = this.state.link.indexOf('ref=');
        const newLink = this.state.link.replace(
          this.state.link.substring(replaceIndex),
          'ref=' + customRef
        );

        this.props.actions.updateNewCampaignInfo(
          this.props.pageId,
          {
            ...this.props.campaignAdd,
            customRef: customRef
          },
          true
        );
        this.setState({ link: newLink, copied: false });
      }
    }
  };

  _copyUrl = () => {
    this.setState({ copied: true });
    toastr.success('Success!', 'Copied');
  };

  _useCustomRefChanged = event => {
    this.setState({ useCustomerRef: event.target.checked }, () => {
      const replaceIndex = this.state.link.indexOf('?ref=');

      if (!this.state.useCustomerRef && replaceIndex >= 0) {
        const newLink = this.state.link.replace(
          this.state.link.substring(replaceIndex),
          ''
        );

        this.props.actions.updateNewCampaignInfo(
          this.props.pageId,
          {
            ...this.props.campaignAdd,
            mMeUrl: newLink,
            customRef: null
          },
          true
        );
        this.setState({ link: newLink, copied: false, customRef: '' });
      }
    });
  };
  render() {
    const { customRef, useCustomerRef } = this.state;

    if (this.props.loading) {
      Swal({
        title: 'Please wait...',
        text: this.props.campaignAdd.uid
          ? 'We are updating a existing campaign...'
          : 'We are creating a new campaign...',
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

      if (this.props.error || !this.props.campaignAdd.mMeUrl) {
        Swal({
          title: this.props.campaignAdd.uid
            ? 'Campaign Update Error'
            : 'Campaign Creation Error',
          text: this.props.error,
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });

        this.props.onBack();
      }
    }

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
        <div className="w-100 mt-5 link-container">
          <p>Your m.me link.</p>
          <div className="input-group">
            <input
              type="text"
              ref={ref => (this.linkRef = ref)}
              className="form-control"
              disabled
              value={this.state.link}
            />
            <div className="input-group-append">
              <CopyToClipboard
                text={this.state.link}
                onCopy={() => this._copyUrl()}
              >
                <i className="fa fa-clipboard input-group-text" />
              </CopyToClipboard>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-5 mb-1">
            <div>
              <div>
                <label className="d-flex ">
                  <input
                    type="checkbox"
                    style={{ width: 15, height: 15 }}
                    checked={useCustomerRef}
                    onChange={this._useCustomRefChanged}
                  />
                  <span className="pl-2">Use Customer Ref Url</span>
                </label>
              </div>
              {useCustomerRef && (
                <div>
                  <span>
                    Enter custom ref below and then click "Save" on the right
                  </span>
                </div>
              )}
            </div>
            {useCustomerRef && (
              <div>
                <button
                  className="btn btn-primary px-5 py-2 btn-next"
                  onClick={this._changeLink}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <input
            className="form-control"
            onChange={e => {
              this.setState({ customRef: e.target.value });
            }}
            value={customRef}
            disabled={!useCustomerRef}
            placeholder="Enter custom ref"
          />
        </div>
        <div className="d-flex justify-content-between mt-4 w-100 step-nav-actions">
          <button
            className="btn btn-light px-5 py-2 btn-back"
            onClick={this.props.onBack}
          >
            <i className="fa fa-arrow-left mr-2" />
            Back
          </button>
          <div className="d-flex">
            <button
              className="btn btn-primary px-5 py-2 btn-next"
              onClick={this._submit}
            >
              Finish
            </button>
          </div>
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
      clearCampaignAddState,
      updateNewCampaignInfo
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
