import React from 'react';
import { LineChat } from '../../components/Charts';
import { Image } from 'semantic-ui-react'
import moneybag from 'assets/images/money-bag.png';

import '../style.scss';

const SalesChart = ({ chartData, totalSales }) => {
  return (
    <div className="sales-chart">
      <div className="total-sales">
        <div className="sales-label">Total sales</div>
        <div className="sales">${totalSales}</div>
      </div>
      <LineChat data={chartData} height={200}/>
    </div>
  );
};

export default SalesChart;