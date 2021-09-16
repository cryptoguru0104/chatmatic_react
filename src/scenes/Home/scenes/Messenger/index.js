import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import MessengerPlugin from 'react-messenger-plugin';

import { getCampaignInfo } from 'services/campaigns/campaignsActions';

import './styles.css';

class Messenger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 'presubmit'
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'We are fetching Campaign Info...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      return <div />;
    } else if (this.props.loading) {
      Swal.close();

      if (nextProps.error) {
        toastr.error('Error', nextProps.error);
      }
    }
  }

  componentDidMount() {
    const campaignPublicId = new URLSearchParams(
      this.props.location.search
    ).get('id');
    if (campaignPublicId) {
      this.props.actions.getCampaignInfo(campaignPublicId);
    }

    const script = document.createElement('script');

    script.src = 'https://connect.facebook.net/en_US/sdk.js#version=v3.2';
    script.async = true;
    document.body.appendChild(script);

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.2'
      });
      window.FB.Event.subscribe('send_to_messenger', e => {
        if (e.event === 'opt_in') {
          this.setState({ currentStep: 'postsubmit' });
        }
      });
    };
  }

  render() {
    const { currentStep } = this.state;
    const { campaignInfo } = this.props;

    if (!campaignInfo || Object.keys(campaignInfo).length < 1) {
      return <div />;
    }

    const image =
      currentStep === 'presubmit'
        ? campaignInfo.presubmitImage
        : campaignInfo.postsubmitContentImage;
    const headline =
      currentStep === 'presubmit'
        ? campaignInfo.presubmitTitle
        : campaignInfo.postsubmitContentTitle;
    const description =
      currentStep === 'presubmit'
        ? campaignInfo.presubmitBody
        : campaignInfo.postsubmitContentBody;

    if (
      currentStep === 'postsubmit' &&
      campaignInfo.postsubmitType === 'redirect_url'
    ) {
      window.location.replace(campaignInfo.postsubmitRedirectUrl);
    }

    return (
      <div className="d-flex flex-column align-items-center mt-5 messenger-container">
        <div className="transition">
          <div
            className="text-center border-0"
            data-aos="fade"
            data-aos-delay="300"
          >
            <div className="p-0">
              <img className="card-img-top mb-4" src={image} alt="" />
              <h4 className="font-weight-light">{headline || ''}</h4>
              <p className="text-muted font-weight-light w-75 m-auto">
                {description || ''}
              </p>
              {currentStep === 'presubmit' && (
                <MessengerPlugin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  pageId={campaignInfo.fbId}
                  passthroughParams={`campaign::${campaignInfo.publicId}`}
                  size="xlarge"
                />
              )}
              {currentStep === 'postsubmit' &&
                campaignInfo.postsubmitRedirectUrlButtonText &&
                campaignInfo.postsubmitRedirectUrl && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      window.location.replace(
                        campaignInfo.postsubmitRedirectUrl
                      )
                    }
                  >
                    {campaignInfo.postsubmitRedirectUrlButtonText}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Messenger.propTypes = {
  campaignInfo: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  currentUser: PropTypes.shape({
    facebookName: PropTypes.string.isRequired,
    facebookProfileImage: PropTypes.any
  }).isRequired
};

const mapStateToProps = state => ({
  campaignInfo: state.default.campaigns.campaignFromPublicId,
  loading: state.default.campaigns.loading,
  error: state.default.campaigns.error,
  currentUser: state.default.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getCampaignInfo
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messenger);
