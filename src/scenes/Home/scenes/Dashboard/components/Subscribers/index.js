import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import _ from 'lodash';

class Subscribers extends React.Component {
  render() {
    const {
      pageId,
      recentSubscribers,
      subscribers,
      history,
      onChangeActive
    } = this.props;

    const maxSubscribers =
      history.length > 0 ? _.maxBy(history, 'total').total : 0;

    return (
      <React.Fragment>
        <small className="text-muted pl-sm-4">SUBSCRIBERS</small>{' '}
        <span className="badge badge-success text-white">
          <i className="fa fa-arrow-up" /> {recentSubscribers}
        </span>
        <div className="d-flex justify-content-between align-items-start pl-sm-4 subscribers-number-container">
          <span className="display-4 font-weight-bold">{subscribers}</span>
          <div className="d-flex flex-column align-items-center">
            <Link to={'/page/' + pageId} className="btn btn-primary px-5">
              Manage Page
            </Link>
            <div className="d-flex justify-content-center align-items-center mt-2 w-100 action-btns">
              <Link to={`/page/${pageId}`}>
                <i className="fa fa-edit" />
              </Link>
              <Link to={`/page/${pageId}/settings`}>
                <i className="fa fa-cog" />
              </Link>
              <Link to={`/page/${pageId}/settings/admins`}>
                <i className="fa fa-remove" />
              </Link>
            </div>
          </div>
        </div>
        <div className="row subscribers-chart-header">
          <span className="col small">Subscribers</span>
          <div className="col">
            <ul className="nav nav-tabs">
              <li className="nav-item ml-auto">
                <a
                  className={classnames('nav-link', {
                    active: this.props.activePeriod === 7
                  })}
                  role="button"
                  onClick={() => {
                    onChangeActive(7);
                  }}
                >
                  7 Days
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={classnames('nav-link', {
                    active: this.props.activePeriod === 30
                  })}
                  role="button"
                  onClick={() => {
                    onChangeActive(30);
                  }}
                >
                  30 Days
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={history} margin={{ right: 50 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#274bf0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9ebbff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickSize={0} tickMargin={10} />
                <YAxis
                  tickSize={0}
                  tickMargin={10}
                  domain={[0, maxSubscribers * 2]}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dot={true}
                  dataKey="total"
                  stroke="#274bf0"
                  fill="url(#areaColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
Subscribers.propType = {
  pageId: PropTypes.number.isRequired,
  recentSubscribers: PropTypes.number.isRequired,
  subscribers: PropTypes.number.isRequired,
  activePeriod: PropTypes.number.isRequired,
  history: PropTypes.array,
  onChangeActive: PropTypes.func.isRequired
};
export default Subscribers;
