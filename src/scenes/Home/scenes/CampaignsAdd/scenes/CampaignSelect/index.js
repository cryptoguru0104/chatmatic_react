import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { createCampaign } from '../../services/actions';
import { getCampaignAdd } from '../../services/selector';

/** Import Components */
import { Button } from 'components';

/** import assets */
import activeLandingIcon from 'assets/images/icon-active-landing.png';
import activeScanIcon from 'assets/images/icon-active-scan.png';
import activeRefurlIcon from 'assets/images/icon-active-refurl.png';
import modalIcon from 'assets/images/icon-active-engage.png';
import sidebarIcon from 'assets/images/icon-sidebar.png';
import buttonIcon from 'assets/images/icon-button.png';
import checkboxIcon from 'assets/images/icon-checkbox.png';
import chatwidgetIcon from 'assets/images/icon-chatwidget.png';
import './styles.css';

class CampaignSelect extends React.Component {
    state = {
        selectedCampaign: 'landing_page'
    };

    handleCampaignSelect = event => {
        this.setState({
            selectedCampaign: event.currentTarget.name
        });
    };

    handleNextBtnClick = () => {
        const { url } = this.props.match;

        if (this.props.campaignAdd.type) {
            Swal({
                title: 'Unsaved Campaign Detected',
                text:
                    'It looks like you were working on a campaign but never saved it. ' +
                    'Would you like to delete your unsaved changes or continue where you left off?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete all my unsaved changes',
                cancelButtonText: 'Continue where I left off',
                confirmButtonColor: '#f02727'
            }).then(result => {
                if (result.value) {
                    this.props.history.push(
                        `${url}/${this.state.selectedCampaign}`
                    );
                    this.props.actions.createCampaign(
                        this.state.selectedCampaign,
                        this.props.match.params.id
                    );
                } else {
                    const currentCampaignType = this.props.campaignAdd.type;

                    this.props.history.push(`${url}/${currentCampaignType}`);
                }
            });
        } else {
            this.props.history.push(`${url}/${this.state.selectedCampaign}`);
            this.props.actions.createCampaign(
                this.state.selectedCampaign,
                this.props.match.params.id
            );
        }
    };

    render() {
        const { selectedCampaign } = this.state;

        return (
            <div>
                <div
                    className="d-flex flex-column justify-content-between bg-white campaign-select-container"
                    data-aos="fade"
                    data-aos-delay=""
                >
                    <div>
                        <p>Select A Type Of Campaign</p>
                        <div className="d-flex flex-wrap campaign-creator-list">
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                name="landing_page"
                                active={selectedCampaign === 'landing_page'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={activeLandingIcon} alt="" />
                                </div>
                                <small className="mt-2">LANDING PAGE</small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                name="followup_message"
                                active={selectedCampaign === 'followup_message'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={modalIcon} alt="" />
                                </div>
                                <small className="mt-2">
                                    FOLLOW UP MESSAGES
                                </small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                disabled
                                name="site-bar"
                                active={selectedCampaign === 'site-bar'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={sidebarIcon} alt="" />
                                </div>
                                <small className="mt-2">SITE BAR</small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                name="buttons"
                                active={selectedCampaign === 'buttons'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={buttonIcon} alt="" />
                                </div>
                                <small className="mt-2">BUTTON</small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                name="checkbox"
                                active={selectedCampaign === 'checkbox'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={checkboxIcon} alt="" />
                                </div>
                                <small className="mt-2">CHECKBOX</small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                name="m_dot_me"
                                active={selectedCampaign === 'm_dot_me'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={activeRefurlIcon} alt="" />
                                </div>
                                <small className="mt-2">M.me LINKS</small>
                            </Button>
                            <Button
                                className="btn btn-link btn-campaign-creator d-flex flex-column justify-content-center align-items-center"
                                onClick={this.handleCampaignSelect}
                                disabled
                                name="checkbox"
                                active={selectedCampaign === 'checkbox'}
                            >
                                <div className="d-flex justify-content-center align-items-center mt-0 image-container">
                                    <img src={chatwidgetIcon} alt="" />
                                </div>
                                <small className="mt-2">CHAT WIDGET</small>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Button
                            className="float-right mt-3 px-5 btn-next"
                            color="primary"
                            onClick={this.handleNextBtnClick}
                        >
                            Next
                            <i className="fa fa-arrow-right ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

CampaignSelect.propTypes = {
    actions: PropTypes.object.isRequired,
    campaignAdd: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    campaignAdd: getCampaignAdd(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            createCampaign
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(CampaignSelect);
