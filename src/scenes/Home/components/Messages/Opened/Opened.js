import React from 'react';

const Opened = ({ sent = 0, opened = 0 }) => {
  const openedRate =
    sent === 0 ? 0 : parseFloat((opened / sent) * 100).toFixed(2);

  return (
    <div>
      <h4 className="m-0">{opened}</h4>
      <small className="text-muted">MESSAGES READ</small>
      <div className="d-flex justify-content-start align-items-center">
        <div className="col-auto px-0 mr-2">
          <small className="font-weight-bold">{openedRate}%</small>
        </div>
        <div className="w-100">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${openedRate}%` }}
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opened;
