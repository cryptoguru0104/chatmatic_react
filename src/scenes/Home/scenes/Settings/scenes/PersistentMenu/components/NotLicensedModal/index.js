import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './styles.scss';

class NotLicensedModal extends PureComponent {
  render() {
    return (
      <div
        className="d-flex flex-column action-modal-container"
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div className="d-flex justify-content-between align-items-center action-modal-header">
          <span>Select a Plan to Remove</span>
        </div>
        <div className="my-3">
          To edit this persistent menu you will need to license this page.
          Please click below to license
        </div>
        <button
          className="btn btn-primary btn-save"
          onClick={() => {
            this.props.history.push(
              `/page/${this.props.pageId}/settings/billing`
            );
          }}
        >
          Select Plan
        </button>
      </div>
    );
  }
}
NotLicensedModal.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired
};
export default withRouter(NotLicensedModal);
