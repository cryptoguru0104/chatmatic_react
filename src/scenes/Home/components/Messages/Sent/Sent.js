import React from 'react';
const Sent = ({ number = 0 }) => {
  return (
    <div>
      <h4 className="m-0">{number}</h4>
      <small className="text-muted">MESSAGES SENT</small>
    </div>
  );
};

export default Sent;
