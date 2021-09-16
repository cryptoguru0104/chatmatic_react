import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class PageMenuItem extends React.Component {
  render() {
    const { fbId, fbName, activePageId, uid } = this.props;
    const logoUrl = `//graph.facebook.com/${fbId}/picture?type=small`;
    return (
      <div
        className={classnames('list-group-item list-group-item-action', {
          active: activePageId === uid
        })}
        onClick={() => this.props.handleClick(this.props.uid)}
      >
        <div style={{ fontSize: 18 }}>
          <img src={logoUrl} alt="" className="mr-1 rounded-circle" /> {fbName}
        </div>
      </div>
    );
  }
}

PageMenuItem.propTypes = {
  fbId: PropTypes.string.isRequired,
  fbName: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  activePageId: PropTypes.number.isRequired,
  uid: PropTypes.number.isRequired
};

export default PageMenuItem;
