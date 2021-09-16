import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

/** Import selectors */
import { getPageFromUrl } from 'services/pages/selector';

/**import assets */
import viceImg from 'assets/images/page-cover.png';

class Overview extends React.Component {
  render() {
    if (this.props.page) {
      const {
        fbName,
        comments,
        subscribers,
        pageLikes,
        fbCoverPhoto,
        fbPageToken,
        fbId,
        activeTriggers
      } = this.props.page;
      const fbPageCoverPhoto =
        fbCoverPhoto &&
        fbCoverPhoto !== 'not-connected' &&
        fbCoverPhoto !== 'no-token'
          ? fbCoverPhoto
          : viceImg;

      return (
        <div className="card w-100">
          <div className="card-image-container">
            <img
              src={fbPageCoverPhoto}
              alt=""
              className="card-img-top"
              data-aos="fade"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center card-header">
            <h4 className="m-0">{fbName}</h4>
            {this.props.page.source != 'ig' && <span>
              https://m.me/
              {fbId}
            </span>}
          </div>
          <div className="card-body d-flex justify-content-around align-items-center">
            <div className="d-flex flex-column text-center">
              <small className="text-muted">Total Subscribers</small>
              <strong>{subscribers}</strong>
            </div>
            <div className="d-flex flex-column text-center">
              <small className="text-muted">Active Triggers</small>
              <strong>{activeTriggers}</strong>
            </div>
            <div className="d-flex flex-column text-center">
              <small className="text-muted">Page Comments</small>
              <strong>{comments}</strong>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default withRouter(
  connect(
    (state, props) => ({
      page: getPageFromUrl(state, props)
    }),
    null
  )(Overview)
);
