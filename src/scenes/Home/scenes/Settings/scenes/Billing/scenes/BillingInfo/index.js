import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toastr } from 'react-redux-toastr';
import moment from "moment";
import { TextField, Button, Radio, Popover, Grid } from '@material-ui/core';
import { Modal } from "components";
import CheckoutModal from "../../components/CheckoutModal";

import { updateBillingInfo, updatePaymentInfo, updatePrimaryCard } from "../../services/actions";
import {
    deleteBillingCard
  } from '../../services/actions';
import visaIcon from "assets/images/icon-visa.png";
import { Svg } from "../../../../../../Layout";

import './styles.scss';
import CardForm from "../CardForm";
import StripeWrapper from '../../../../../../../../components/StripeWrapper';
import InfoToggle from "../../../../../../components/InfoToggle";

class BillingInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingBillingEmail: null,
            cardSettingsPopOver: null,
            cardSettingsPopOverAnchorRef: null,
            activeCardId: null,
            isCardFormVisible: false,
            updatingCardToken: null,
        };
    }

    componentDidUpdate(prevProps) {
        const { billingInfo } = this.props;
    }

    onRemoveCard = (card) => {

        const { actions } = this.props;

        Swal({
            title:
                'Are you sure you want to remove this card?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, please.',
            cancelButtonText: 'No, Don’t Do This',
            confirmButtonColor: '#f02727',
            cancelButtonColor: '#274BF0'
        }).then(result => {
            if (result.value) {
                actions.deleteBillingCard(
                    this.props.match.params.id,
                    card.uid
                );
            }
        });
    }


    onUpdateBillingInfo = () => {
        const { editingBillingEmail } = this.state;
        if(editingBillingEmail.trim() == "") {
            toastr.warning('Please enter your billing email address.');
            return;
        }
        else if( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(editingBillingEmail.trim()) == false) {
            toastr.warning('Please enter a valid billing email address.');
            return;
        }
        this.props.actions.updateBillingInfo(this.props.match.params.id, { email: editingBillingEmail });
        this.setState({ editingBillingEmail: null });
    }

    onUpdatePrimaryCard = (pageCardUid) => {
        const { activeCardId } = this.state;
        
        if(pageCardUid == null || activeCardId == pageCardUid) return;

        this.props.actions.updatePrimaryCard(this.props.match.params.id, pageCardUid);

        this.setState({activeCardId: pageCardUid})
    }


    renderCard = (c, i) => {
        const card = c.card;
        const { cardSettingsPopOver, activeCardId, cardSettingsPopOverAnchorRef } = this.state;
        const isActive = activeCardId == c.uid || (activeCardId == null && c.status == 'active');
        const cardBrand = "card-brand-" + card.brand.toLowerCase().replace(' ', '');
        
        return (<div className="stripecard-container" key={i}>
            <Radio disabled={c.card.status != 'active'} checked={isActive} value={c.uid} name="card" onChange={() => this.onUpdatePrimaryCard(c.uid)} />
            <div className={"stripecard " + (isActive ? "active" : "") }>
                <Grid container justify="space-between" alignItems="stretch">
                    <Svg name={cardBrand} />
                    <button className="settings" onClick={(e) => this.setState({ cardSettingsPopOverAnchorRef: e.currentTarget, cardSettingsPopOver: card})}><Svg name="settings" /></button>
                    { cardSettingsPopOver == card && <Popover className="card-settings-popover" open={cardSettingsPopOverAnchorRef} anchorEl={cardSettingsPopOverAnchorRef} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => this.setState({cardSettingsPopOver: null})}>
                        <div className="card-settings-popover-item" onClick={() => this.setState({ cardSettingsPopOver: null, isCardFormVisible: true, updatingCardToken: card.uid })}><Svg name="general-edit" /> Edit Card</div>
                        <div className="card-settings-popover-item" onClick={() => { this.setState({cardSettingsPopOver: null}); this.onRemoveCard(card); }}><Svg name="general-trash" /> Remove Card</div>
                    </Popover>}
                </Grid>
                <div className="card-no">**** **** **** {card.last4}</div>
                <div className="card-exp">Exp: {card.expMonth < 10 ? '0' + card.expMonth : card.expMonth}/{card.expYear%1000}</div>
                <hr />
                <div className="stripecard-footer">
                    <div className="btn-update-payment-info"></div>
                    {c.card.status == 'active' && <div className="card-status"><div className="icon"></div>Active Card</div> }
                </div>
            </div>
        </div>);
    }

    render() {
        const { billingInfo } = this.props;
        const { editingBillingEmail, isCardFormVisible, updatingCardToken } = this.state;

        return (
            <div className="billing-info-container">
                {isCardFormVisible && <StripeWrapper><CardForm cardToken={updatingCardToken} onSuccess={() => {}} close={() => this.setState({
                    isCardFormVisible: false,
                    updatingCardToken: null})}/></StripeWrapper>}
                <div className="billing-email-container">
                    <h5>Billing Email</h5>
                    { editingBillingEmail == null && 
                        <div className="billing-email">
                            {billingInfo.email}
                            <button onClick={() => this.setState({ editingBillingEmail: billingInfo.email })}><Svg name="general-edit" /></button>
                        </div>}
                    { editingBillingEmail != null &&
                        <div className="edit-billing-email">
                            <input type="email" value={editingBillingEmail || ""} onChange={e => this.setState({ editingBillingEmail: e.target.value })} variant="outlined" />
                            <button onClick={this.onUpdateBillingInfo}><Svg name="general-save" /></button>
                        </div>}
                </div>
                <hr />
                <div className="billing-cards-list-container">

                    <Grid container direction="row" justify="flex-start" alignItems="center" className="billing-cards-title">
                        <h5>Billing Info</h5>
                        <InfoToggle text='You can add a card here and use it to switch future billing or purchase templates. This works like a wallet for future needs' />
                    </Grid>
                    <div className="billing-cards-list">
                        {billingInfo.cards.map((c, i) => this.renderCard(c, i))}
                        <div className="stripecard-container">
                            <div className="stripecard empty" onClick={() => this.setState({ isCardFormVisible: true, updatingCardToken: null })}>
                            <div className="plus-icon"><i className="fa fa-plus" /></div>
                            Add a new Card
                        </div></div>
                    </div>
                </div>
            </div>
        );
    }
}

BillingInfo.propTypes = {
    billingInfo: PropTypes.any.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    billingInfo: state.default.settings.billing.billingInfo
    
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateBillingInfo,
            updatePaymentInfo,
            deleteBillingCard,
            updatePrimaryCard
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BillingInfo)
);
