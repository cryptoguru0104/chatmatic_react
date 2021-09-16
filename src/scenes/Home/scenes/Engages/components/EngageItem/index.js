import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
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
import {
    Button,
    Collapse,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';
import { createTemplate } from '../../../Settings/scenes/Templates/services/actions';
import { getPageWorkflowStats } from 'services/workflows/workflowsApi';
import './styles.css';
import ReactToPdf from 'react-to-pdf';
// Import Assets
import Constants from 'config/Constants';
import CopyJsonModal from '../CopyJsonModal';
const ENGAGE_STATS = [
    {
        field: 'total_messages_sent',
        isPercent: false,
        title: 'Total Msgs Sent'
    },
    {
        field: 'total_subscribers',
        isPercent: false,
        title: 'Total # Subscribers'
    },
    {
        field: 'percent_subscribers_completed_all_steps',
        isPercent: true,
        title: 'Completed Sequences'
    },
    {
        field: 'average_number_of_messages_per_subscriber',
        isPercent: false,
        title: 'Avg Msgs Per User'
    },
    {
        field: 'total_emails_collected',
        isPercent: false,
        title: 'Emails Collected'
    },
    {
        field: 'percent_opt_in',
        isPercent: true,
        title: '% Opt in Rate'
    }
];
class EngageItem extends React.Component {
    state = {
        isCollapseOpen: false,
        isCopyModalJsonOpen: false,
        navigateToEngageBuilder: false,
        statsData: null
    };

    _deleteEngagement = () => {
        // if (this.props.workflow.workflowType === 'broadcast') {
        //   Swal({
        //     title: 'Feature not yet ready',
        //     text: 'You are not yet able to delete an engagement because the feature is not complete yet. Please check back later!',
        //     type: 'warning',
        //     showCancelButton: false,
        //     confirmButtonText: 'Delete this engagement',
        //     confirmButtonColor: '#274BF0'
        //   })
        // } else {
        Swal({
            title: 'Are you sure?',
            text: `Please verify that you want to delete the following engagement: ${this.props.workflow.name}`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this engagement',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.deleteWorkflow();
            }
        });
        // }
    };
    _copyJson = () => {
        this.setState({ isCopyModalJsonOpen: true });
    };
    _createTemplate = () => {
        this.props.actions.createTemplate(
            this.props.match.params.id,
            this.props.workflow.uid
        );
    };

    _collapseToggle = () => {
        const { match, workflow } = this.props;
        const { isCollapseOpen } = this.state;
        this.setState({ isCollapseOpen: !isCollapseOpen });
        if (!isCollapseOpen) {
            getPageWorkflowStats(match.params.id, workflow.uid)
                .then(res => {
                    const stepsData = Object.keys(res.data.data.steps_data).map(
                        (d, i) => {
                            return {
                                ...res.data.data.steps_data[d],
                                name:
                                    res.data.data.steps_data[d].name ||
                                    `step ${i + 1}`
                            };
                        }
                    );

                    this.setState({
                        statsData: { ...res.data.data, steps_data: stepsData }
                    });
                })
                .catch(e => {
                    console.log('error', e);
                });
        }
    };

    render() {
        const {
            name,
            messagesDelivered,
            messagesReadCount,
            messagesReadRatio,
            messagesClickedCount,
            messagesClickedRatio,
            workflowType,
            uid
        } = this.props.workflow;
        const { isCollapseOpen, isCopyModalJsonOpen, statsData } = this.state;
        const { workflow } = this.props;

        let broadcast = {};

        if (this.props.workflow.workflowType === 'broadcast') {
            broadcast =
                this.props.broadcasts.find(
                    broadcast =>
                        broadcast.workflowUid === this.props.workflow.uid
                ) || {};
        }

        if (this.state.navigateToEngageBuilder) {
            return (
                <Redirect
                    to={{
                        pathname: `/page/${this.props.workflow.pageUid}/engages/${uid}/builder`
                    }}
                />
            );
        }

        const statusLabel = () => {
            switch (broadcast.status) {
                case 0:
                    return 'Not Scheduled';
                case 1:
                    return 'Scheduled';
                case 2:
                    return 'In progress';
                case 3:
                    return 'Complete';
            }
        };
        console.log('type', workflowType);
        return (
            <div
                className="list-group-item list-group-item-action border-top-0"
                ref={ref => (this.containerRef = ref)}
                key={uid}
            >
                <div className="row">
                    <div className="col action">
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav>
                                <i className="fa fa-ellipsis-h mr-2" />
                            </DropdownToggle>

                            <DropdownMenu>
                                {!broadcast.status && (
                                    <DropdownItem
                                        onClick={() => {
                                            this.props.editWorkflow();
                                            this.setState({
                                                navigateToEngageBuilder: true
                                            });
                                        }}
                                    >
                                        Edit
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={this._deleteEngagement}>
                                    Delete
                                </DropdownItem>
                                <DropdownItem onClick={this._createTemplate}>
                                    Create Template
                                </DropdownItem>
                                {workflowType == 'json' &&
                                    workflow &&
                                    workflow.steps && (
                                        <DropdownItem onClick={this._copyJson}>
                                            Copy JSON
                                        </DropdownItem>
                                    )}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    <div onClick={this._collapseToggle} className="col-5">
                        <img
                            src={Constants.workflowIcons[workflowType]}
                            alt=""
                            width="11"
                            height="11"
                            className="mr-2"
                        />
                        <small>{name}</small>
                        {broadcast.uid && (
                            <span
                                className={classnames('badge badge-pill ml-3', {
                                    'badge-primary': broadcast.status,
                                    'badge-dark': !broadcast.status
                                })}
                            >
                                {statusLabel()}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={this._collapseToggle}
                        className="col-2 thin-border-left"
                    >
                        <div className="d-flex justify-content-between align-items-center h-100">
                            <small className="align-middle">
                                {messagesDelivered}
                            </small>
                        </div>
                    </div>
                    <div
                        onClick={this._collapseToggle}
                        className="col-2 thin-border-left"
                    >
                        <div className="d-flex justify-content-between align-items-center h-100">
                            <small>{messagesReadCount}</small>
                            <small>{parseInt(messagesReadRatio)}%</small>
                        </div>
                    </div>
                    <div
                        onClick={this._collapseToggle}
                        className="col-2 thin-border-left"
                    >
                        <div className="d-flex justify-content-between align-items-center h-100">
                            <small>{messagesClickedCount}</small>
                            <small>{parseInt(messagesClickedRatio)}%</small>
                        </div>
                    </div>
                </div>
                <Collapse isOpen={isCollapseOpen}>
                    <div className="card">
                        <div className="card-body ">
                            <div className="d-block mb-3">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4>Open % Per Message In Sequence</h4>
                                    </div>
                                    <div>
                                        <ReactToPdf
                                            targetRef={this.containerRef}
                                            filename={`${name}.pdf`}
                                            options={{
                                                orientation: 'landscape',
                                                size: '11',
                                                unit: 'in'
                                            }}
                                        >
                                            {({ toPdf }) => (
                                                <Button
                                                    className="btn-sm hide-print"
                                                    color="primary"
                                                    onClick={toPdf}
                                                >
                                                    <i className="fa fa-print" />{' '}
                                                    Print
                                                </Button>
                                            )}
                                        </ReactToPdf>
                                    </div>
                                </div>
                                <ResponsiveContainer width="95%" height={350}>
                                    <AreaChart
                                        data={statsData && statsData.steps_data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 10
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="areaColor"
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#274bf0"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#9ebbff"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickSize={0}
                                            tickMargin={25}
                                        />
                                        <YAxis
                                            tickSize={0}
                                            tickMargin={10}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dot={true}
                                            dataKey="percent_reached"
                                            stroke="#274bf0"
                                            fill="url(#areaColor)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="d-flex stats justify-content-center">
                                {ENGAGE_STATS.map(t => (
                                    <div key={t.title} className="text-center">
                                        <h4>
                                            {!!statsData
                                                ? parseInt(
                                                      statsData[`${t.field}`]
                                                  )
                                                : 0}
                                            {t.isPercent && '%'}
                                        </h4>
                                        <small className="text-muted">
                                            {t.title}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Collapse>
                {isCopyModalJsonOpen && (
                    <CopyJsonModal
                        isOpen={isCopyModalJsonOpen}
                        pageId={this.props.match.params.id}
                        toggle={() => {
                            this.setState({
                                isCopyModalJsonOpen: !isCopyModalJsonOpen
                            });
                        }}
                        workflowRootStepUid={workflow.steps[0].stepUid}
                    />
                )}
            </div>
        );
    }
}

EngageItem.propTypes = {
    workflow: PropTypes.object.isRequired,
    deleteWorkflow: PropTypes.func.isRequired,
    editWorkflow: PropTypes.func.isRequired,
    broadcasts: PropTypes.array,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    broadcasts: state.default.workflows.broadcasts
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            createTemplate
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(EngageItem)
);
