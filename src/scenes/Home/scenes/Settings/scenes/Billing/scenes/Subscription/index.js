import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Swal from 'sweetalert2';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button } from '@material-ui/core';
import { Svg } from '../../../../../../Layout';
import { getBillingInfo, cancelPlan } from "../../services/actions";
import {
  getSubscribersState
} from 'services/subscribers/selector';
import {
  clearPageSubscribers,
  getPageSubscribers,
} from 'services/subscribers/subscribersActions';
import './styles.scss';
import SubscriptionPlanForm from '../SubscriptionPlanForm';
import StripeWrapper from '../../../../../../../../components/StripeWrapper';

const PER_PAGE = 100;
class Subscription extends React.Component {
    constructor(props) {
        super(props);

        const { billingInfo } = props;
        this.state = {
            isShowingSubscriptionModal: false,
            plan: billingInfo && billingInfo.subscription ? billingInfo.subscription.plan : null,
            isSubscriptionPlanFormVisible: null,
        };
    }

    componentDidMount() {
        const { actions, loading } = this.props;
        const pageId = this.props.match.params.id;
        actions.clearPageSubscribers();
        
        actions.getPageSubscribers(pageId, false, null, 1, PER_PAGE);
    }

    componentWillUnmount() {
        this.props.actions.clearPageSubscribers();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { billingInfo } = nextProps;
        if(billingInfo && billingInfo.subscription) {
            this.setState({ plan: billingInfo.subscription.plan});
        }
    }

    activatePlan = (plan_id) => {
        this.setState({plan: plan_id});
    }

    cancelPlan = event => {
        event.preventDefault();

        Swal({
            title:
            'Are you sure you want to cancel the subscription?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, please.',
            cancelButtonText: 'No, Don’t Do This',
            confirmButtonColor: '#f02727',
            cancelButtonColor: '#274BF0'
        }).then(result => {
            if (result.value) {
                const { actions } = this.props;
                const page_id = this.props.match.params.id;
                actions.cancelPlan(page_id);
            }
        });
    }

    renderPlan = (planList, planName) => {
        const { billingInfo } = this.props;
        const subscription_plan = billingInfo.subscription ? billingInfo.subscription.plan : '';
        const plan = planList[planName];
        const plan_id = plan.stripePlanId;
        const subscriberCount = this.props.subscribersStats ? this.props.subscribersStats.total : 0;
        let features = [];
        try { features = JSON.parse(plan.features); }
        catch(e) { features= []; }
        let meterWidth = -1;
        if(plan.minSubscribers != -1 && plan.maxSubscribers != -1) {
            meterWidth = (subscriberCount - plan.minSubscribers) / (plan.maxSubscribers - plan.minSubscribers) * 100;
        }
        if(meterWidth > 100) meterWidth = 100;
        return <div key={plan_id} className={"plan-container " + ((plan_id == this.state.plan || (this.state.plan == null && plan.title == 'Pay As You Grow Plans'))? "active" : "")} onClick={() => this.activatePlan(plan_id)}>
            <div className="plan-title">
                <h2>{plan.title}</h2>
                <label></label>
            </div>
            <div className="plan-desc">
                {plan.descriptionHtml}
            </div>
            <div className="plan-limits">
                Current Subscription
                {plan.maxSubscribers != -1 && <label>Up to {plan.maxSubscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} subscribers</label>}
            </div>
            <div className="plan-price-container">
                <div className="plan-current-subscribers">
                    <div className="value">{subscriberCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    Subscribers
                </div>
                <div className="plan-dots"></div>
                <div className="plan-price">
                    <div className="value">${plan.price}</div>
                    {plan.period == 'PER_MONTH' && 'Per/Month'}
                    {plan.period == 'PER_YEAR' && 'Per/Year'}
                </div>
            </div>
            <hr />
            <ul className="plan-features">
                {features.map((feature, i) => <li key={i}><CheckCircleIcon /> {feature}</li>)}
            </ul>
            {meterWidth != -1 && <div className="plan-subscribers-meter-container">
                <div className="plan-subscribers-meter">
                    <div className="plan-subscribers-meter-axis-bk"></div>
                    <div className="plan-subscribers-meter-axis" style={{width: meterWidth + '%'}}></div>
                    <div className="plan-subscribers-meter-key" style={{left: meterWidth + '%'}}>
                        <Svg name="subscribers-plan-meter-key" />
                    </div>
                </div>
                <div className="plan-subscribers-meter-label">
                    <div>{plan.minSubscribers}</div>
                    <div>{plan.maxSubscribers}</div>
                </div>
            </div>}
            <div className="sms-plan-desc">
                <b>Note:</b> SMS messages are billed separate at a rate of ${plan.smsPlanPrice}.
            </div>
            <div className="plan-activate-btn-container">
                <div className="plan-name">{plan.name}</div>
                {(billingInfo == null || billingInfo.subscription == null || billingInfo.subscription.plan != plan_id) && <Button variant="contained" className="btn-plan-activate" onClick={() => this.setState({ isSubscriptionPlanFormVisible: plan })}>Activate account</Button> }
            </div>
        </div>;
    }

    render() {
        const { billingInfo } = this.props;
        const { isSubscriptionPlanFormVisible, plan } = this.state;
        const subscriberCount = this.props.subscribersStats ? this.props.subscribersStats.total : 0;
        const planList = billingInfo.allPlans.reduce((all, p) => {
            if(!(p.name in all)) {
                all[p.name] = p;
            }
            else if(p.minSubscribers <= subscriberCount && subscriberCount <= p.maxSubscribers) {
                all[p.name] = p;
            }
            else if((!(p.name in all) || subscriberCount > all[p.name].maxSubscribers) && p.maxSubscribers == -1) {
                all[p.name] = p;
            }
            return all;
        }, {});
        return (<div className="subscription-wrapper">
            <div className="subscription-container">
                { isSubscriptionPlanFormVisible && <SubscriptionPlanForm plan={isSubscriptionPlanFormVisible} plan_type={plan} onSuccess={() => {}} close={() => this.setState({isSubscriptionPlanFormVisible: null})} /> }
                <h1>Subscribers Plans</h1>
                <div className="desc">Chatmatic gives you everything you need to build  your world!</div>
                <div className="subscriptions-plans-list">
                    {Object.keys(planList).map(planName => this.renderPlan(planList, planName))}
                </div>
            </div>
            {(billingInfo && billingInfo.subscription) && <div className="cancel-subscription-container">
                <button className="cancel-subscription-button" onClick={this.cancelPlan}><Svg name="cancelcircle" /> Cancel Subscription</button>
            </div>}
        </div>);
    }
}

Subscription.propTypes = {
    billingInfo: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    billingInfo: state.default.settings.billing.billingInfo,
    loading: state.default.settings.billing.loading,
    error: state.default.settings.billing.error,
    subscribersStats: getSubscribersState(state).paging,
    plan: state.default.settings.billing.plan
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            clearPageSubscribers,
            getPageSubscribers,
            getBillingInfo,
            cancelPlan
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Subscription)
);
