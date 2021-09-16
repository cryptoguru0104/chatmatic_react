import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import { getPageWorkflows } from 'services/workflows/workflowsActions';

/** Import scenes */
import LandingPage from './scenes/LandingPage';
import FollowupMessage from './scenes/FollowupMessage';
import MeLinks from './scenes/MeLinks';
import ScanCode from './scenes/ScanCode';
import CampaignSelect from './scenes/CampaignSelect';
import Buttons from './scenes/Buttons';
import CampaignCheckbox from './scenes/CampaignCheckbox';

class CampaignsAdd extends React.Component {
    componentDidMount() {
        if (this.props.workflows.length < 1) {
            this.props.actions.getPageWorkflows(this.props.match.params.id);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Loading messages...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loading) {
            Swal.close();

            if (nextProps.error) {
                toastr.error('Workflow Loading Error', nextProps.error);
            }
        }
    }

    render() {
        const { path } = this.props.match;
        return (
            <Switch>
                <Route
                    path={`${path}/landing_page`}
                    render={props => <LandingPage {...props} />}
                />
                <Route
                    path={`${path}/followup_message`}
                    render={props => <FollowupMessage {...props} />}
                />
                <Route
                    path={`${path}/scan_refurl`}
                    render={props => <ScanCode {...props} />}
                />
                <Route
                    path={`${path}/m_dot_me`}
                    render={props => <MeLinks {...props} />}
                />
                <Route
                    path={`${path}/buttons`}
                    render={props => <Buttons {...props} />}
                />
                <Route
                    path={`${path}/checkbox`}
                    render={props => <CampaignCheckbox {...props} />}
                />
                <Route
                    exact
                    path={`${path}/`}
                    render={props => <CampaignSelect {...props} />}
                />
                <Redirect to="/404" />
            </Switch>
        );
    }
}

CampaignsAdd.propTypes = {
    workflows: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    workflows: state.default.workflows.workflows,
    loading: state.default.workflows.loading,
    error: state.default.workflows.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflows
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(CampaignsAdd);
