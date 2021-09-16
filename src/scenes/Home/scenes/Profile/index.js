import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.css';

class Profile extends React.Component {
  render() {
    const { currentUser, extApiToken } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xl-4 col-12" />
          <div className="col-xl-8 col-12">
            <div className="card card-body">
              <h3 className="mb-5">
                <span className="mr-2">
                  {currentUser && currentUser.facebookName}
                </span>
                <small className="text-muted">
                  {currentUser && currentUser.facebookEmail}
                </small>
              </h3>
              <div />
              <h6 className="font-weight-bold">Api Key:</h6>
              <div>
                <input
                  className="form-control"
                  type="text"
                  value={extApiToken}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  currentUser: PropTypes.object,
  extApiToken: PropTypes.string
};

export default connect(
  (state, props) => ({
    currentUser: state.default.auth.currentUser,
    extApiToken: state.default.pages.extApiToken
  }),
  null
)(Profile);
