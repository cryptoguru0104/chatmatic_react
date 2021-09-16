import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

/** Import actions */
import { toggleConnect } from 'services/pages/pagesActions';

/** Import assets */
import './styles.css';

class PageItem extends React.Component {
  onClick = () => {
    this.props.pagesActions.toggleConnect(this.props.uid);
  };

  render() {
    const {
      uid,
      isConnected,
      fbName,
      fbId,
      licensed,
      subscribers
    } = this.props;
    const logoUrl = `//graph.facebook.com/${fbId}/picture?type=small`;

    const renderActionButton = () => {
      if (!isConnected) {
        return (
          <button
            className="btn btn-primary btn-connect"
            onClick={this.onClick}
          >
            Connect
          </button>
        );
      } else if (licensed) {
        return (
          <div className="d-flex flex-column align-items-center action-container">
            <div className="badge badge-success badge-confirmed">Licensed</div>
            {/*<span className="action-limit">Enterprise License</span>*/}
            {/*<span className="action-status">Unlimited Usage Unlocked</span>*/}
          </div>
        );
      } else {
        return (
          <div className="d-flex flex-column align-items-center action-container">
            <Link
              to={`/page/${uid}/settings/billing`}
              className="btn btn-upgrade"
            >
              Upgrade
            </Link>
            <span className="action-limit">Free Up to 500 Subscribers</span>
            <span className="action-status">
              {subscribers}
              /500
            </span>
          </div>
        );
      }
    };

    return (
      <div className="d-flex flex-column align-items-center page-connect-item">
        <p className="page-name">{fbName}</p>
        <img className="page-logo" src={logoUrl} alt="" />
        {renderActionButton()}
      </div>
    );
  }
}

PageItem.propTypes = {
  uid: PropTypes.number.isRequired,
  fbName: PropTypes.string.isRequired,
  fbId: PropTypes.string.isRequired,
  isConnected: PropTypes.number.isRequired,
  subscribers: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  pageLikes: PropTypes.number.isRequired,
  activeTriggers: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};
export default connect(
  null,
  dispatch => ({
    pagesActions: bindActionCreators({ toggleConnect }, dispatch)
  })
)(PageItem);
