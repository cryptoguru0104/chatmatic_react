import React from 'react';
import PropTypes from 'prop-types';

class Clicked extends React.Component {
  render() {
    const clickedRate =
      this.props.sent === 0
        ? 0
        : parseFloat((this.props.clicked / this.props.sent) * 100).toFixed(2);

    return (
      <div>
        <h4 className="m-0">{this.props.clicked}</h4>
        <small className="text-muted">MESSAGES CLICKED</small>
        <div className="d-flex justify-content-start align-items-center">
          <div className="col-auto px-0 mr-2">
            <small className="font-weight-bold">{clickedRate}%</small>
          </div>
          <div className="w-100">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${clickedRate}%` }}
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Clicked.propTypes = {
  clicked: PropTypes.number,
  sent: PropTypes.number
};

Clicked.defaultProps = {
  clicked: 0,
  sent: 0
};

export default Clicked;
