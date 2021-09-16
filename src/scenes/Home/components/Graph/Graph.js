import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

/*
const chartData = {
  labels: ['27 Oct','','29 Oct', '' , '31 Oct', '', '02 Nov', '', '04 Nov'],
  datasets: [
    {
      label: 'Subscribers',
      fill: true,
			backgroundColor: 'rgba(227,236,253,.2)',
      borderColor: 'rgba(39,75,240,1)',
			lineTension: 0,
      borderCapStyle: 'round',
      borderDash: [],
			borderWidth: 2,
      borderDashOffset: 0.0,
      borderJoinStyle: 'join',
      pointBorderColor: 'rgba(39,75,240,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: 'rgba(39,75,240,1)',
      pointHoverBorderColor: 'rgba(39,75,240,1)',
      pointHoverBorderWidth: 1,
      pointRadius: 4,
      pointHitRadius: 15,
      data: [1400, 1200, 1500, 1350, 1200, 1400, 1500, 1250, 1050]
    }
  ],
	options: {
		responsive: true
	}
};
*/
class Graph extends React.Component {

  render() {
    const {label, period, data} = this.props;

    const labels = [];
    const graphData = [];
    /** Loop the period one by one and prepare the data for chart */
    for (let index = period; index > 0; index--) {
      let indexDate = moment().subtract(index, 'days');

      // Get graph labels
      labels.push(indexDate.format('DD MMM'));

      // find graph data for certain date
      let find = data.find(function(element) {
        return element.date_utc === indexDate.utc().format('YYYY-MM-DD')
      });

      // If graph data for certain date is not defined then assume the subscriber count 0
      if (find) {
        graphData.push(find.maximum)
      } else {
        graphData.push(0);
      }
    }
    
    const chartData = {
      labels,
      datasets: [
        {
          label,
          fill: true,
          backgroundColor: 'rgba(227,236,253,.2)',
          borderColor: 'rgba(39,75,240,1)',
          lineTension: 0,
          borderCapStyle: 'round',
          borderDash: [],
          borderWidth: 2,
          borderDashOffset: 0.0,
          borderJoinStyle: 'join',
          pointBorderColor: 'rgba(39,75,240,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: 'rgba(39,75,240,1)',
          pointHoverBorderColor: 'rgba(39,75,240,1)',
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          pointHitRadius: 15,
          data: graphData
        }
      ]
    };

    const options = {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
            }
          }]
        }
      };

    return (
			<div className="d-flex justify-content-center align-items-center" data-aos='fade' data-aos-delay='300'>
				{/*<h1 className="text-muted font-weight-light mt-5 py-5">Graph Goes Here</h1>*/}
				<Line data={chartData} height={120} options={options}/>
			</div>
		);
  }
}

Graph.propTypes = {
  label : PropTypes.string,
  period: PropTypes.number,
  data:   PropTypes.array.isRequired
}

Graph.defaultProps = {
  label: 'Subscribers',
  period: 7,
  data: []
}
export default Graph;