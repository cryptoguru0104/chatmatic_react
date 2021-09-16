import React from 'react';

const ProgressCircle = ({progress}) => {
  const percentage = progress ? `${progress}` : '20';
  return (
    <div className="progress-circle" data-percentage={percentage}>
      <span className="progress-left">
        <span className="progress-bar"></span>
      </span>
      <span className="progress-right">
        <span className="progress-bar"></span>
      </span>
    </div>
  )
}

export default ProgressCircle;