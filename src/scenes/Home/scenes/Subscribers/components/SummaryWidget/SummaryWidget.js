import React from 'react';
import { bindActionCreators } from 'redux';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import { getTagsState } from 'services/tags/selector';
import { getActiveSubscriber } from 'services/subscribers/selector';
import { updateSubscriberInfo, updateCustomFieldResponse } from 'services/subscribers/subscribersActions';
import { addTag } from 'services/tags/actions';

import './styles.scss';
class SummaryWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.subscriber.tags || [],
      email: this.props.subscriber.email || '',
      phone: this.props.subscriber.phone || '',
      location: this.props.subscriber.location || '',
      url: this.props.subscriber.url || '',
      facebook_url: this.props.subscriber.facebookUrl || '',
      youtube_url: this.props.subscriber.youtubeUrl || '',
      instagram_url: this.props.subscriber.instagramUrl || '',
      debounceTimer: null
    };
    this.props.subscriber.customFields.forEach(cf => this.state["cf-" + cf.customField.fieldName] = cf.response);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.subscriber) != JSON.stringify(this.props.subscriber)) {
      let newState = {
        email: nextProps.subscriber.email || '',
        phone: nextProps.subscriber.phone || '',
        location: nextProps.subscriber.location || '',
        url: nextProps.subscriber.url || '',
        facebook_url: nextProps.subscriber.facebookUrl || '',
        youtube_url: nextProps.subscriber.youtubeUrl || '',
        instagram_url: nextProps.subscriber.instagramUrl || ''
      };
      nextProps.subscriber.customFields.forEach(cf => newState["cf-" + cf.customField.fieldName] = cf.response);
      this.setState(newState);
    }
  }

  _changeCustomData = event => {
    this.props.actions.updateSubscriberInfo(
      this.props.match.params.id,
      this.props.subscriber.uid,
      {
        [event.target.name]: event.target.value
      }
    );
  };

  _changeCustomFieldData = (cf, event) => {
    this.props.actions.updateCustomFieldResponse(
      this.props.match.params.id,
      this.props.subscriber.uid,
      cf.customFieldUid,
      event.target.value
    );
  };

  countDebounce = e => {
    e.persist();
    let { debounceTimer } = this.state;

    clearTimeout(debounceTimer);
    this.setState({ [e.target.name]: e.target.value });

    debounceTimer = setTimeout(() => {
      this._changeCustomData(e);
    }, 500);
    this.setState({ debounceTimer });
  };

  countDebounceCustomField = cf => e => {
    e.persist();
    let { debounceTimer } = this.state;

    clearTimeout(debounceTimer);
    this.setState({ [e.target.name]: e.target.value });

    debounceTimer = setTimeout(() => {
      this._changeCustomFieldData(cf, e);
    }, 500);
    this.setState({ debounceTimer });
  }

  render() {
    const countOfLast30DaysCampaigns =
      (this.props.subscriber.campaigns &&
        this.props.subscriber.campaigns.filter(campaign => {
          return moment().diff(moment(campaign.createdAtUtc), 'days') <= 30;
        }).length) ||
      0;

    return (
      <div className="card w-100 summary-container">
        <h2>User Attribute</h2>
        <hr/>
        <div className="d-flex flex-column summary-content">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.3359 7.67871C16.7027 7.67871 17 7.38141 17 7.01465V2.66504C17 1.20038 15.8084 0.00878906 14.3438 0.00878906H2.65625C1.19159 0.00878906 0 1.20038 0 2.66504V10.335C0 11.7996 1.19159 12.9912 2.65625 12.9912H14.3438C15.8084 12.9912 17 11.7996 17 10.335C17 9.9682 16.7027 9.6709 16.3359 9.6709C15.9692 9.6709 15.6719 9.9682 15.6719 10.335C15.6719 11.0673 15.0761 11.6631 14.3438 11.6631H2.65625C1.92392 11.6631 1.32812 11.0673 1.32812 10.335V2.80575L7.09733 6.39319C7.52994 6.66216 8.01497 6.79667 8.5 6.79667C8.98503 6.79667 9.47006 6.66216 9.90267 6.39319L15.6719 2.80575V7.01465C15.6719 7.38141 15.9692 7.67871 16.3359 7.67871ZM9.20132 5.26531C8.76875 5.53429 8.23125 5.53432 7.79868 5.26531L1.88225 1.58634C2.10033 1.42942 2.36768 1.33691 2.65625 1.33691H14.3438C14.6323 1.33691 14.8997 1.42945 15.1177 1.58637L9.20132 5.26531Z" fill="#878DAE"/>
                </svg>
                &nbsp;Email:
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="email"
              value={this.state.email}
              onChange={this.countDebounce}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              
              <span className="input-group-text">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.89838 2.02839C8.90957 2.02839 8.92046 2.02832 8.93158 2.02832C10.5499 2.02832 12.0664 2.65401 13.2044 3.79201C14.3518 4.93942 14.9794 6.46879 14.9716 8.09838C14.9699 8.46511 15.2658 8.76383 15.6325 8.76559C15.6336 8.76559 15.6347 8.76559 15.6357 8.76559C16.001 8.76559 16.298 8.47035 16.2997 8.10468C16.3092 6.1179 15.5434 4.25281 14.1435 2.85286C12.7545 1.4638 10.9049 0.700195 8.93178 0.700195C8.91966 0.700195 8.90745 0.700228 8.89529 0.700262C8.52853 0.702021 8.23266 1.00075 8.23438 1.36748C8.23614 1.73315 8.53311 2.02839 8.89838 2.02839Z" fill="#878DAE"/>
                <path d="M16.9984 13.6981C16.9747 13.0405 16.7007 12.4268 16.2271 11.9701C15.2997 11.0758 14.5227 10.5596 13.7818 10.3455C12.7608 10.0504 11.8153 10.3188 10.9714 11.1429C10.9702 11.1441 10.9689 11.1454 10.9676 11.1467L10.0689 12.0387C9.51076 11.7251 8.42568 11.035 7.2389 9.84822L7.15151 9.7609C5.97253 8.58195 5.27808 7.49069 4.96212 6.93022L5.85326 6.03237C5.85452 6.03111 5.85575 6.02985 5.85701 6.02855C6.68115 5.18473 6.94946 4.23917 6.65442 3.21823C6.44033 2.47737 5.92412 1.70035 5.02982 0.772947C4.57311 0.299302 3.95945 0.0253757 3.30192 0.00166854C2.64453 -0.0220054 2.01257 0.206898 1.52286 0.646509L1.5038 0.663642C1.49494 0.671577 1.4863 0.679778 1.4779 0.688179C0.503056 1.66296 -0.00794186 3.02768 9.33205e-05 4.63475C0.0137066 7.36472 1.51413 10.4868 4.01367 12.9863C4.01576 12.9884 4.01782 12.9904 4.01991 12.9925C4.4898 13.4617 5.02331 13.926 5.60576 14.3726C5.89679 14.5958 6.31362 14.5407 6.53681 14.2497C6.75997 13.9586 6.70496 13.5418 6.4139 13.3187C5.87481 12.9053 5.38323 12.4775 4.95282 12.0471C4.95076 12.045 4.9487 12.043 4.94661 12.041C2.69261 9.7844 1.34011 7.01379 1.32819 4.62807C1.32201 3.39039 1.69432 2.35734 2.405 1.63932L2.41008 1.63474C2.89279 1.2015 3.6236 1.22786 4.07383 1.69477C5.79313 3.47772 5.66862 4.31945 4.90893 5.09846L3.67795 6.33871C3.48491 6.53321 3.43115 6.82633 3.54265 7.07668C3.57389 7.14687 4.32986 8.81743 6.21265 10.7002L6.30004 10.7875C8.1826 12.6701 9.85315 13.426 9.92335 13.4573C10.1737 13.5688 10.4668 13.5151 10.6613 13.322L11.9013 12.0912C12.6805 11.3314 13.5222 11.2068 15.3053 12.9261C15.7722 13.3764 15.7985 14.1072 15.3654 14.5898L15.3607 14.595C14.6485 15.2999 13.6264 15.6719 12.4022 15.6719C12.3921 15.6719 12.382 15.6719 12.3719 15.6718C11.3934 15.6669 10.2603 15.3987 9.09512 14.8961C8.75838 14.7508 8.36761 14.9061 8.22234 15.2429C8.07708 15.5796 8.23234 15.9704 8.56909 16.1156C9.91587 16.6966 11.1931 16.9941 12.3653 16.9999C12.3777 17 12.3901 17 12.4025 17C13.9934 17 15.3446 16.4894 16.3118 15.5221C16.3202 15.5137 16.3284 15.5051 16.3364 15.4962L16.3536 15.4771C16.7931 14.9874 17.0221 14.3556 16.9984 13.6981Z" fill="#878DAE"/>
                <path d="M12.265 4.73227C11.5527 4.01993 10.869 3.8309 10.5404 3.74002C10.1869 3.64224 9.82116 3.84956 9.72341 4.20307C9.62566 4.55656 9.83295 4.92236 10.1865 5.02011C10.4551 5.09441 10.8611 5.20671 11.3259 5.67139C11.7732 6.11873 11.892 6.52258 11.9707 6.78984L11.9803 6.82234C12.0658 7.11111 12.3302 7.29811 12.6168 7.29811C12.6792 7.29814 12.7427 7.28924 12.8056 7.27062C13.1572 7.16653 13.3579 6.79704 13.2538 6.44539L13.2448 6.4149C13.1424 6.06687 12.9517 5.41901 12.265 4.73227Z" fill="#878DAE"/>
              </svg>

                &nbsp;Phone:
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={this.state.phone}
              onChange={this.countDebounce}
            />
          </div>
          {this.props.subscriber.customFields.map((cf, i) => 
            <div className="input-group" key={i}>
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.3359 7.67871C16.7027 7.67871 17 7.38141 17 7.01465V2.66504C17 1.20038 15.8084 0.00878906 14.3438 0.00878906H2.65625C1.19159 0.00878906 0 1.20038 0 2.66504V10.335C0 11.7996 1.19159 12.9912 2.65625 12.9912H14.3438C15.8084 12.9912 17 11.7996 17 10.335C17 9.9682 16.7027 9.6709 16.3359 9.6709C15.9692 9.6709 15.6719 9.9682 15.6719 10.335C15.6719 11.0673 15.0761 11.6631 14.3438 11.6631H2.65625C1.92392 11.6631 1.32812 11.0673 1.32812 10.335V2.80575L7.09733 6.39319C7.52994 6.66216 8.01497 6.79667 8.5 6.79667C8.98503 6.79667 9.47006 6.66216 9.90267 6.39319L15.6719 2.80575V7.01465C15.6719 7.38141 15.9692 7.67871 16.3359 7.67871ZM9.20132 5.26531C8.76875 5.53429 8.23125 5.53432 7.79868 5.26531L1.88225 1.58634C2.10033 1.42942 2.36768 1.33691 2.65625 1.33691H14.3438C14.6323 1.33691 14.8997 1.42945 15.1177 1.58637L9.20132 5.26531Z" fill="#878DAE"/>
                  </svg>
                  &nbsp;{cf.customField.fieldName}:
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                name={"cf-" + cf.customField.fieldName}
                value={this.state["cf-" + cf.customField.fieldName]}
                onChange={this.countDebounceCustomField(cf)}
              />
            </div>
          )}
          {/* <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
              <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.20703 2.8125C4.78389 2.8125 2.8125 4.78389 2.8125 7.20703C2.8125 9.63018 4.78389 11.6016 7.20703 11.6016C7.61629 11.6016 8.02178 11.5452 8.41226 11.434C8.78576 11.3278 9.00232 10.9388 8.89604 10.5653C8.7897 10.1918 8.4008 9.9752 8.02726 10.0815C7.76204 10.157 7.48607 10.1953 7.20703 10.1953C5.55929 10.1953 4.21875 8.85477 4.21875 7.20703C4.21875 5.55929 5.55929 4.21875 7.20703 4.21875C8.85477 4.21875 10.1953 5.55929 10.1953 7.20703C10.1953 7.5002 10.1531 7.78957 10.0699 8.06706C9.95836 8.43901 10.1695 8.83097 10.5414 8.94252C10.9134 9.054 11.3053 8.84299 11.4169 8.471C11.5394 8.06238 11.6016 7.63713 11.6016 7.20703C11.6016 4.78389 9.63018 2.8125 7.20703 2.8125Z" fill="#878DAE"/>
                <path d="M12.3003 2.10811C10.9394 0.748688 9.1305 0 7.20693 0C5.28332 0 3.47449 0.748688 2.11359 2.10814C0.752836 3.4675 0.00221484 5.2753 0 7.20011C0.00137109 8.60126 0.390551 9.91582 1.18972 11.219C1.88177 12.3474 2.78082 13.332 3.73264 14.3744C4.66594 15.3964 5.63094 16.4533 6.40164 17.6726C6.53048 17.8764 6.75485 18 6.99599 18H7.41786C7.659 18 7.88337 17.8764 8.01222 17.6725C8.78291 16.4532 9.74791 15.3964 10.6812 14.3743C11.633 13.332 12.5321 12.3474 13.2241 11.219C14.0233 9.91578 14.4125 8.60119 14.4139 7.19856C14.4117 5.27527 13.661 3.46746 12.3003 2.10811ZM9.64276 13.4261C8.81293 14.3349 7.95909 15.27 7.20693 16.3454C6.45479 15.27 5.60092 14.3349 4.77109 13.4261C2.96691 11.4503 1.40871 9.74391 1.40625 7.20021C1.40991 4.00542 4.0121 1.40625 7.20693 1.40625C10.4018 1.40625 13.0039 4.00542 13.0076 7.1987C13.0051 9.74391 11.4469 11.4503 9.64276 13.4261Z" fill="#878DAE"/>
              </svg>

                &nbsp;Location:</span>
            </div>
            <input
              type="text"
              className="form-control"
              name="location"
              value={this.state.location}
              onChange={this.countDebounce}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.6614 2.35516C12.1533 0.847133 10.1483 0.0166016 8.01559 0.0166016C8.01213 0.0166016 8.00869 0.0166328 8.00528 0.0166953C7.99831 0.0166328 7.99138 0.0166016 7.98441 0.0166016C5.85169 0.0166016 3.84666 0.847133 2.33856 2.35516C0.830531 3.86326 0 5.86829 0 8.00101C0 10.1337 0.830531 12.1388 2.33856 13.6469C3.84666 15.1549 5.85169 15.9854 7.98441 15.9854C7.99138 15.9854 7.99831 15.9854 8.00528 15.9853C8.00872 15.9854 8.01219 15.9854 8.01559 15.9854C9.37841 15.9854 10.7239 15.6359 11.9067 14.9746C12.2074 14.8065 12.3149 14.4264 12.1468 14.1257C11.9787 13.825 11.5986 13.7175 11.2979 13.8857C11.1249 13.9824 10.9477 14.0712 10.767 14.152C10.8993 13.9458 11.0255 13.7231 11.1447 13.4847C11.8074 12.1593 12.2026 10.4526 12.276 8.62479H14.7238C14.6263 9.68148 14.2819 10.6985 13.7133 11.5974C13.5292 11.8885 13.6158 12.2738 13.907 12.458C14.0105 12.5235 14.1258 12.5547 14.2399 12.5547C14.4466 12.5547 14.6489 12.452 14.7676 12.2643C15.5739 10.9899 16 9.51566 16 8.00101C16 5.86829 15.1695 3.86326 13.6614 2.35516ZM5.18747 1.87254C5.06034 2.07241 4.939 2.28751 4.82412 2.51732C4.69259 2.78041 4.57162 3.05848 4.46159 3.34954C4.07659 3.27538 3.71256 3.18904 3.37566 3.09163C3.90631 2.59313 4.51756 2.17951 5.18747 1.87254ZM5.32322 4.7507C5.97278 4.83307 6.65703 4.88526 7.36059 4.9047V7.3772H4.94131C4.98159 6.44754 5.11175 5.5582 5.32322 4.7507ZM2.48316 4.11641C2.96628 4.28613 3.506 4.4312 4.08819 4.5492C3.86738 5.42845 3.73266 6.38501 3.69281 7.37723H1.27619C1.38747 6.17057 1.81834 5.05507 2.48316 4.11641ZM1.27616 8.62479H3.69278C3.73222 9.60626 3.86441 10.5528 4.081 11.4242C3.49428 11.5433 2.95059 11.6896 2.46563 11.8608C1.81078 10.9273 1.38647 9.82082 1.27616 8.62479ZM3.34947 12.8857C3.69122 12.7852 4.05978 12.6968 4.44975 12.6211C4.56291 12.9236 4.68784 13.2122 4.82412 13.4847C4.93903 13.7145 5.06034 13.9296 5.18747 14.1295C4.5065 13.8175 3.88619 13.3952 3.34947 12.8857ZM7.36062 14.5788C6.84697 14.3186 6.35031 13.7475 5.93997 12.9268C5.86028 12.7674 5.78497 12.6014 5.71413 12.4293C6.24216 12.3696 6.79437 12.3307 7.36062 12.3142V14.5788ZM7.36062 11.0662C6.65609 11.0859 5.96881 11.1388 5.31566 11.2221C5.10866 10.4224 4.98112 9.54326 4.94131 8.62476H7.36062V11.0662ZM7.36062 3.65638C6.80134 3.6396 6.25297 3.60045 5.72731 3.54091C5.79428 3.3802 5.86519 3.22482 5.94 3.07526C6.35031 2.25451 6.84697 1.68341 7.36062 1.42323V3.65638ZM8.60819 1.42323C9.12184 1.68341 9.6185 2.25454 10.0288 3.07526C10.1036 3.22488 10.1746 3.38032 10.2416 3.54113C9.71612 3.6006 9.16781 3.6397 8.60819 3.65645V1.42323ZM10.0288 12.9268C9.6185 13.7475 9.12184 14.3186 8.60819 14.5788V12.3141C9.17203 12.3304 9.72231 12.3691 10.2545 12.4298C10.1838 12.6016 10.1085 12.7675 10.0288 12.9268ZM10.6533 11.2213C9.99522 11.1373 9.31087 11.0853 8.60819 11.066V8.62482H11.0275C10.9877 9.54298 10.8603 10.4219 10.6533 11.2213ZM8.60819 7.37723V4.90473C9.31216 4.88532 9.99628 4.8332 10.6456 4.75091C10.8571 5.55835 10.9873 6.44763 11.0275 7.37726H8.60819V7.37723ZM11.1447 2.51732C11.0259 2.27988 10.9004 2.05813 10.7686 1.85263C11.4527 2.16013 12.0765 2.57857 12.6171 3.08485C12.2735 3.1852 11.9014 3.27385 11.5073 3.34979C11.3973 3.0586 11.2763 2.78041 11.1447 2.51732ZM12.276 7.37723C12.2362 6.38507 12.1015 5.4286 11.8807 4.54941C12.4729 4.42938 13.0211 4.28129 13.5107 4.10766C14.179 5.04816 14.6122 6.16682 14.7238 7.37726H12.276V7.37723Z" fill="#878DAE"/>
              </svg>

                &nbsp;
                URL
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="url"
              value={this.state.url}
              onChange={this.countDebounce}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.24091 16V8.70218H11.6895L12.0569 5.85725H9.24091V4.04118C9.24091 3.21776 9.46863 2.65661 10.6507 2.65661L12.156 2.65599V0.111384C11.8957 0.0775563 11.0021 0 9.96212 0C7.79044 0 6.30367 1.32557 6.30367 3.75942V5.85725H3.84766V8.70218H6.30367V16H9.24091Z" fill="#878DAE"/>
                </svg>
                &nbsp;
                Facebook</span>
            </div>
            <input
              type="text"
              className="form-control"
              name="facebook_url"
              value={this.state.facebook_url}
              onChange={this.countDebounce}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0)">
                  <path d="M16.6543 4.29465C16.4122 3.44947 15.7033 2.78312 14.8069 2.55628C13.5314 2.22822 9.01118 2.21875 8.49995 2.21875C7.98909 2.21875 3.47194 2.22784 2.1993 2.54256C2.19701 2.54316 2.19476 2.54372 2.1925 2.54431C1.30993 2.772 0.585005 3.45909 0.345611 4.29465C0.345312 4.29581 0.34498 4.29693 0.344648 4.29809C0.00391796 5.51496 0 7.89908 0 7.99999C0 8.1014 0.00391796 10.4978 0.345644 11.7053C0.587761 12.5505 1.29665 13.2169 2.19472 13.4441C3.48201 13.7718 7.99015 13.7812 8.49995 13.7812C9.01085 13.7812 13.528 13.7721 14.8006 13.4574C14.8018 13.4571 14.803 13.4568 14.8042 13.4565C15.7033 13.229 16.4122 12.5626 16.6543 11.7175C16.7497 11.3842 16.5401 11.0412 16.186 10.9513C15.8319 10.8615 15.4674 11.0588 15.372 11.392C15.2528 11.8081 14.9039 12.1363 14.4611 12.2489C13.5205 12.4804 9.83973 12.5312 8.49995 12.5312C7.16366 12.5312 3.48821 12.4785 2.5405 12.2372C2.09694 12.125 1.74731 11.7965 1.62848 11.3818C1.33197 10.334 1.32812 8.02315 1.32812 7.99999C1.32812 7.35821 1.38208 5.50084 1.62841 4.61871C1.74764 4.2045 2.10527 3.86418 2.54043 3.75065C3.4839 3.51953 7.16104 3.46878 8.50002 3.46875C9.83966 3.46875 13.5213 3.52143 14.4595 3.76275C14.903 3.87497 15.2527 4.2035 15.3727 4.62256C15.6279 5.49893 15.6752 7.36427 15.6718 8.01208C15.6718 8.01361 15.6717 8.16689 15.6665 8.40924C15.6591 8.75433 15.9504 9.03974 16.317 9.04674C16.3216 9.04683 16.3261 9.04686 16.3307 9.04686C16.6912 9.04686 16.987 8.77527 16.9944 8.43449C16.9996 8.1903 16.9999 8.03393 16.9999 8.01405C17.0005 7.89586 17.0078 5.50881 16.6543 4.29465Z" fill="#878DAE"/>
                  <path d="M8.15843 5.36885C7.75286 5.14729 7.26819 5.14657 6.86185 5.36679C6.45428 5.58766 6.21094 5.98425 6.21094 6.42757V9.54128C6.21094 9.98462 6.45428 10.3812 6.86185 10.6021C7.06436 10.7118 7.28635 10.7667 7.50828 10.7667C7.73167 10.7667 7.95503 10.7111 8.15843 10.6001L11.009 9.04322C11.4143 8.82187 11.6562 8.42606 11.6562 7.98444C11.6562 7.54281 11.4143 7.14697 11.009 6.92563L8.15843 5.36885ZM7.53906 9.49309V6.47575L10.3015 7.98444L7.53906 9.49309Z" fill="#878DAE"/>
                  </g>
                  <defs>
                  <clipPath id="clip0">
                  <rect width="17" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
                &nbsp;
                Youtube</span>
            </div>
            <input
              type="text"
              className="form-control"
              name="youtube_url"
              value={this.state.youtube_url}
              onChange={this.countDebounce}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.3523 0H4.64775C2.08497 0 0 2.08497 0 4.64775V11.3523C0 13.915 2.08497 16 4.64775 16H11.3523C12.0917 16 12.7988 15.8313 13.4541 15.4985C14.0785 15.1814 14.6328 14.7182 15.057 14.159C15.2656 13.884 15.2118 13.4919 14.9368 13.2833C14.6619 13.0747 14.2698 13.1284 14.0612 13.4035C13.412 14.2592 12.4246 14.75 11.3523 14.75H4.64775C2.77422 14.75 1.25 13.2258 1.25 11.3523V4.64775C1.25 2.77422 2.77422 1.25 4.64775 1.25H11.3523C13.2258 1.25 14.75 2.77422 14.75 4.64775V10.7188C14.75 11.0639 15.0298 11.3438 15.375 11.3438C15.7202 11.3438 16 11.0639 16 10.7188V4.64775C16 2.08497 13.915 0 11.3523 0Z" fill="#878DAE"/>
                  <path d="M8 3.6875C5.62206 3.6875 3.6875 5.62206 3.6875 8C3.6875 10.3779 5.62206 12.3125 8 12.3125C10.3779 12.3125 12.3125 10.3779 12.3125 8C12.3125 5.62206 10.3779 3.6875 8 3.6875ZM8 11.0625C6.31134 11.0625 4.9375 9.68866 4.9375 8C4.9375 6.31134 6.31134 4.9375 8 4.9375C9.68866 4.9375 11.0625 6.31134 11.0625 8C11.0625 9.68866 9.68866 11.0625 8 11.0625Z" fill="#878DAE"/>
                  <path d="M12.375 4.25C12.7202 4.25 13 3.97018 13 3.625C13 3.27982 12.7202 3 12.375 3C12.0298 3 11.75 3.27982 11.75 3.625C11.75 3.97018 12.0298 4.25 12.375 4.25Z" fill="#878DAE"/>
                </svg>
                &nbsp;
                Instagram
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="instagram_url"
              value={this.state.instagram_url}
              onChange={this.countDebounce}
            />
          </div> */}
        </div>
      </div>
    );
  }
}

SummaryWidget.propTypes = {
  subscriber: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  pageTags: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  addingTag: PropTypes.bool.isRequired,
  addingTagError: PropTypes.any
};

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
      addTag,
      updateCustomFieldResponse
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SummaryWidget)
);
