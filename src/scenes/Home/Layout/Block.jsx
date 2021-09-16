import React from 'react';
import classNames from 'classnames';

const Block = ({ className, withRef, indention, ...props }) => (
    <div ref={withRef} className={classNames(className)} {...props} />
);

export default Block;
