import React from 'react';
import { LineChart } from 'react-chartkick';
import 'chart.js';

export default function({ data, ...props }) {
    return <LineChart data={data} {...props}/>;
}
