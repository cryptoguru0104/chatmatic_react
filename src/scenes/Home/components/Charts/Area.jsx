import React from 'react';
import { AreaChart } from 'react-chartkick';
import 'chart.js';

export default function({ data }) {
    return <AreaChart data={data} />;
}
