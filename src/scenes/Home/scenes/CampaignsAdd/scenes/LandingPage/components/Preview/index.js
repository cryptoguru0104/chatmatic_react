import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCampaignAdd } from '../../../../services/selector';

import subscriberImg from 'assets/images/subscriber.png';
import facebookMessengerImg from 'assets/images/icon-facebook-messenger.png';
import './styles.css';

class Preview extends React.Component {
  render() {
    const { currentStep, campaignAdd } = this.props;
    const image =
      currentStep === 'presubmit'
        ? campaignAdd.presubmitImage
        : campaignAdd.postsubmitContentImage;
    const headline =
      currentStep === 'presubmit'
        ? campaignAdd.presubmitTitle
        : campaignAdd.postsubmitContentTitle;
    const description =
      currentStep === 'presubmit'
        ? campaignAdd.presubmitBody
        : campaignAdd.postsubmitContentBody;

    if (currentStep !== 'presubmit' && currentStep !== 'postsubmit') {
      return <div />;
    }
    return (
      <div className="card w-100 preview-container">
        <div className="card-header text-center">Preview</div>

        <div className={`card-body transition`}>
          <div
            className="card text-center border-0"
            data-aos="fade"
            data-aos-delay="300"
          >
            <div className="card-body p-0">
              <img className="card-img-top mb-4" src={image} alt="" />
              <h4 className="font-weight-light">
                {headline || 'Test Headline'}
              </h4>
              <p className="text-muted font-weight-light w-75 m-auto">
                {description ||
                  'This is just a test description if this were a non test description' +
                    'you would find the non test description here'}
              </p>
              {currentStep === 'presubmit' && (
                <div className="bg-primary text-white px-3 py-2 my-4 d-inline-block presubmit-send-messenger">
                  <img
                    src={facebookMessengerImg}
                    alt=""
                    className="mr-2"
                    width={20}
                    height={20}
                  />
                  Send to Messenger
                </div>
              )}
              {currentStep === 'presubmit' && (
                <div>
                  <img
                    src={
                      this.props.currentUser.facebookProfileImage ||
                      subscriberImg
                    }
                    alt=""
                    className="mr-2 presubmit-profile-img"
                  />
                  <small>
                    <span>{this.props.currentUser.facebookName || ''}</span>
                    {/*<a href="#" className="ml-2 text-underline text-default">*/}
                    {/*Not You?*/}
                    {/*</a>*/}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  currentStep: PropTypes.string.isRequired,

  campaignAdd: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    facebookName: PropTypes.string.isRequired,
    facebookProfileImage: PropTypes.any
  }).isRequired
};

const mapStateToProps = state => ({
  campaignAdd: getCampaignAdd(state),
  currentUser: state.default.auth.currentUser
});

export default connect(
  mapStateToProps,
  null
)(Preview);
