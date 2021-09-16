import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LazyLoad from 'react-lazy-load';

import { getSubscriberById } from 'services/subscribers/selector';
import {
  updateActiveSubscriber,
  getSubscriberInfo
} from 'services/subscribers/subscribersActions';

import { getSubscriberName } from 'services/utils';

import defaultAvatar from 'assets/images/default-avatar.svg';
import subscribedIcon from 'assets/images/icon-subscribed.svg';
import unsubscribedIcon from 'assets/images/icon-unsubscribed.png';
import subscriberInfoImg from 'assets/images/icon-info.svg';
import subscriberInfoBlueImg from 'assets/images/icon-info-blue.svg';
import './styles.css';

class Subscriber extends React.Component {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.state = {
      isLiveChat: urlParams.get('openChat'),
      subscriberUid: urlParams.get('subscriberUid')
    };
  }

  componentDidMount = () => {
    // console.log('state', );
    const { subscriberUid, isLiveChat } = this.state;
    // console.log('subscriberId, isLiveChat', subscriberUid, isLiveChat);
    if (Number(isLiveChat) === 1 && Number(subscriberUid) === Number(this.props.subscriberId)) {
      console.log('_updateActiveSubscriber');
      this._updateActiveSubscriber();
    }
  }
  
  _updateActiveSubscriber = () => {
    this.props.actions.getSubscriberInfo(
      this.props.match.params.id,
      this.props.subscriberId
    );
    this.props.actions.updateActiveSubscriber(
      this.props.match.params.id,
      this.props.subscriberId,
      true
    );
  };

  render() {
    const { subscriber, activeSubscriberId } = this.props;

    const subscribeIcon = subscriber.isSubscribed
      ? subscribedIcon
      : unsubscribedIcon;

    const gender = subscriber.gender
      ? subscriber.gender.toUpperCase()
      : 'No Data Provided';

    
    return (
      <div
        className={classnames(
          'd-flex justify-content-between align-items-center subscriber-container',
          {
            active: subscriber.uid === activeSubscriberId
          }
        )}
      >
        <div className="position-relative">
          <div className="d-flex align-items-center">
            <div className="subscriber-photo-wrapper">
              <LazyLoad  offset={700} >
                <img
                  src={subscriber.profilePicUrl || defaultAvatar}
                  alt=""
                  className="mr-3 subscriber-photo"
                  width={62}
                  height={62}
                />
                
              </LazyLoad>
              <img
                  alt=""
                  src={subscriber.uid === activeSubscriberId?subscriberInfoBlueImg:subscriberInfoImg}
                  className="position-absolute subscriber-info"
                  onClick={this._updateActiveSubscriber}
              />
            </div>
            <div className="d-flex flex-column">
              <span className="mr-auto subscriber-name">
                {getSubscriberName(subscriber.firstName, subscriber.lastName)}
              </span>
              <span className="subscriber-sex">
                Subscriber
                <span>{gender}</span>
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-link p-0"
          onClick={this._updateActiveSubscriber}
        >
          <img src={subscribeIcon} alt="" />
        </button>
      </div>
    );
  }
}

Subscriber.propTypes = {
  subscriberId: PropTypes.number.isRequired,

  subscriber: PropTypes.shape({
    uid: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    isSubscribed: PropTypes.any,
    profilePicUrl: PropTypes.string
  }).isRequired,
  activeSubscriberId: PropTypes.number,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  activeSubscriberId: state.default.subscribers.activeSubscriberId,
  subscriber: getSubscriberById(state, props)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateActiveSubscriber,
      getSubscriberInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subscriber)
);
