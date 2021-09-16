import React, { Component } from 'react';
import protoTypes from 'prop-types';
import ReactSlider from 'react-slider';

const TransparencyBar = props => {
    const { handleChange, value, defaultValue = 50, disabled = false } = props;
    const renderThumb = (props, state) => {
        return <div {...props}>{state.valueNow}</div>;
    };
    return (
        <ReactSlider
            defaultValue={defaultValue}
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            orientation="horizontal"
            //renderThumb={renderThumb}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            value={value}
            disabled={disabled}
        />
    );
};

TransparencyBar.prototype = {
    handleChange: protoTypes.func,
    value: protoTypes.number,
    disabled: protoTypes.bool
};

export default TransparencyBar;
