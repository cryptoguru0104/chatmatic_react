import React from 'react';
import './style.scss';

class AbandonCart extends React.Component {
  render() {
    return (
      <div className="position-relative d-flex flex-column abandoncart-container">
        <div style={{
          padding: '15px'
        }}>
          This item will automatically be filled at the time of messaging.
        </div>
        <div
          className="d-flex justify-content-center align-items-center position-absolute backward-carousel-icon"
        >
          <i className="fa fa-arrow-left" />
        </div>
        <div
          className="d-flex justify-content-center align-items-center position-absolute forward-carousel-icon"
        >
          <i className="fa fa-arrow-right" />
        </div>
      </div>
    );
  }
}

export default AbandonCart;