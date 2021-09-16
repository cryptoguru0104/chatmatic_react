import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Svg } from 'scenes/Home/Layout';
import './styles.scss'

class LifetimeValue extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // }

    render() {
        return (
            <div className="card lifetimevalue-container w-100">
                <div className="d-flex justify-content-between message-info-header ">
                    <h2>Lifetime Value</h2>
                    <div className="d-flex justify-content-end align-items-center">
                        <Svg name="subscribers-history" />
                        <div className="d-flex flex-column">
                            <span>
                              Subscribers History
                            </span>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="d-flex justify-content-between value-info">
                    <div className="d-flex flex-column">
                    <label>Value</label>
                    <span>-</span>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                      <label>Last 30 Days</label>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.82422 15.0615L14.41 3.47579" stroke="#3ABC0D" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M9.41406 2.82422H15.0621V8.47227" stroke="#3ABC0D" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
actions: bindActionCreators(
    {
    },
    dispatch
)
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LifetimeValue)
);
  
