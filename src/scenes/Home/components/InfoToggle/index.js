import React, { useState, useEffect, useRef } from "react";
/** Import components */
import { Button } from '@material-ui/core';

import "./styles.scss";

const InfoToggle = function(props) {
  const { text } = props;
  const btnRef = useRef(null);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const onClickOutside = (event) => {
    if(btnRef && !btnRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className={'info-toggle-container ' + props.className}>
      <Button ref={btnRef} className="info-toggle-button" onClick={onClick}>i</Button>
      {visible && <div className="info-toggle-text">{text}</div>}
    </div>
  );
  
};
export default InfoToggle;
