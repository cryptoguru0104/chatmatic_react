import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

import { getTagsState } from 'services/tags/selector';
import { getActiveSubscriber } from 'services/subscribers/selector';
import { updateSubscriberInfo } from 'services/subscribers/subscribersActions';
import { addTag } from 'services/tags/actions';
import calendarImg from 'assets/images/icon-calendar.png';
import Constants from 'config/Constants';
import mini_welcome_msg_icon from 'assets/images/mini_welcome_msg_icon.svg';
import './styles.scss';
class SubscribedCampaigns extends Component {

  
    render() {
        const countOfLast30DaysCampaigns =
        (this.props.subscriber.campaigns &&
          this.props.subscriber.campaigns.filter(campaign => {
            return moment().diff(moment(campaign.createdAtUtc), 'days') <= 30;
          }).length) ||
        0;

        return (
          <div className="card w-100 campaigns-container">
              <div className="d-flex justify-content-between align-items-center campaigns-header">
                <h2>Campaigns Subscribed</h2>
              </div>
              <hr/>
              <div className="d-flex justify-content-between align-items-end campaigns-info">
                <div className="d-flex flex-column campaigns-count">
                  <label>Total Subscribed</label>
                  <span>{this.props.subscriber.campaigns?this.props.subscriber.campaigns.length:0}</span>
                </div>
                <div className="d-flex align-items-center recent-campaigns">
                  {/* <span className="d-flex justify-content-center align-items-center">
                    <i className="fa fa-arrow-up" />
                    {countOfLast30DaysCampaigns}
                  </span> */}
                  <label>Last 30 Days</label>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.82422 15.0615L14.41 3.47579" stroke="#3ABC0D" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9.41406 2.82422H15.0621V8.47227" stroke="#3ABC0D" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>

                </div>
              </div>
              <div className="campaigns-wrapper">
                {this.props.subscriber.campaigns && this.props.subscriber.campaigns.map((campaign, index) => (
                  <div
                    className="d-flex justify-content-between align-items-center campaign"
                    key={index}
                  >
                    <span>{campaign.campaignName}</span>
                    <img
                      src={
                        Constants.workflowIcons[campaign.workflowType] ||
                        mini_welcome_msg_icon
                      }
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    subscriber: getActiveSubscriber(state),
    pageTags: getTagsState(state).tags,
    loading: state.default.subscribers.loading,
    error: state.default.subscribers.error,
    addingTag: state.default.settings.tags.loading,
    addingTagError: state.default.settings.tags.error
});

const mapDispatchToProps = dispatch => ({
actions: bindActionCreators(
    {
    updateSubscriberInfo,
    addTag
    },
    dispatch
)
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SubscribedCampaigns)
);