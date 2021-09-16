import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
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

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import Grid from '@material-ui/core/Grid';
import { getSubscribersHistory } from 'services/subscribers/subscribersActions';

class Subscribers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentDays: 7
    };
  }

  componentWillMount() {
    this.props.getSubscribersHistory(
      this.props.match.params.id,
      this.state.recentDays
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.recentDays !== this.state.recentDays ||
      nextProps.match.params.id !== this.props.match.params.id
    ) {
      this.props.getSubscribersHistory(
        nextProps.match.params.id,
        nextState.recentDays
      );
    }
  }

  render() {
    if (this.props.loading || this.props.loading === undefined) {
      Swal({
        title: 'Please wait...',
        text: 'We are fetching a history of subscribers...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      return <div />;
    } else {
      Swal.close();

      if (this.props.error) {
        Swal({
          title: 'Subscribers History Loading Error',
          text: this.props.error,
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });
      }
    }

    const maxSubscribers =
      this.props.subscribersHistory.length > 0
        ? _.maxBy(this.props.subscribersHistory, 'total').total
        : 0;

    return (
      <div className="card w-100 h-100">
        <div className="d-flex flex-column card-body">
          <Grid container>
            <Grid item xs={6}><h2>Subscribers Graphs</h2></Grid>
            <Grid item xs={6}>
              <UncontrolledDropdown
                style={{ width: 150, height: 40, borderRadius: 20, float: 'right' }}
              >
                <DropdownToggle
                  className="py-0 font-weight-normal d-flex justify-content-between align-items-center h-100 w-100"
                  style={{
                    borderWidth: 0,
                    borderRadius: 20,
                    backgroundColor: '#F3F5F9',
                    border: '1px solid #F8F9FC',
                    boxShadow: 'none',
                    marginTop: '30px',
                    zIndex: 999
                  }}
                  caret
                >
                  {this.state.recentDays + ' Days'}
                </DropdownToggle>

                <DropdownMenu
                  style={{
                    width: '100%',
                    marginLeft: -5,
                    marginTop: 0,
                    padding: 0,
                    boxShadow: 'none',
                    border: '1px solid #ebebeb'
                  }}
                >
                  <DropdownItem onClick={() => this.setState({ recentDays: 7 })}>
                    7 Days
                  </DropdownItem>
                  <DropdownItem onClick={() => this.setState({ recentDays: 14 })}>
                    14 Days
                  </DropdownItem>
                  <DropdownItem onClick={() => this.setState({ recentDays: 30 })}>
                    30 Days
                  </DropdownItem>
                  {/*<DropdownItem onClick={() => this.setState({ recentDays: -1 })}>*/}
                  {/*All Time*/}
                  {/*</DropdownItem>*/}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Grid>
          </Grid>
          <ResponsiveContainer width="100%" height={255}>
            <AreaChart
              data={this.props.subscribersHistory}
              margin={{ right: 0 }}
            >
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
              <Tooltip content={this.renderTooltip}/>
              <Area
                type="monotone"
                dot={true}
                dataKey="total"
                stroke="#3350EE"
                fill="transparent"
                strokeWidth="3"
                dot={false}
                activeDot={this.renderActiveDot}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  renderActiveDot(props) {
    return <circle r="5" fill="#3350EB" strokeWidth="4" stroke="#fefefe" cx={props.cx} cy={props.cy}></circle> 
  }

  renderTooltip({ active, payload, label }) {
    if(active && payload && payload.length) {
      return <div className="subscriber-chart-tooltip-container">
        {payload[0].value}
      </div>;
    }
    return null;
  }
}

Subscribers.propType = {
  subscribersHistory: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  getSubscribersHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  subscribersHistory: state.default.subscribers.subscribersHistory,
  loading: state.default.subscribers.loading,
  error: state.default.subscribers.error
});

const mapDispatchToProps = dispatch => ({
  getSubscribersHistory: bindActionCreators(getSubscribersHistory, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subscribers)
);
