import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Switch, Route, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavItem } from 'components';

import { getPageFromUrl } from 'services/pages/selector';
import { getPageWorkflows } from 'services/workflows/workflowsActions';

/** import scenes */
import General from './scenes/General';
import Billing from './scenes/Billing';
import Integrations from './scenes/Integrations';
import Automations from './scenes/Automations';
import PersistentMenu from './scenes/PersistentMenu';
import Templates from './scenes/Templates';
import CustomFieldTags from './scenes/CustomFieldsTags';
import './styles.css';

class Settings extends React.Component {
    componentWillMount() {
        this.props.actions.getPageWorkflows(this.props.match.params.id);
    }

    render() {
        if(!this.props.page) return <></>;
        const { page } = this.props;

        return (
            <div className="d-flex flex-column settings-scene mt-0">
                <nav className="nav nav-tabs justify-content-center">
                    { (this.props.page && this.props.page.source == 'fb') && <><NavItem>
                        <NavLink
                            to={`${this.props.match.url}/persistent-menus`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Persistent Menu
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem></>}
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/fields-tags`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Custom Fields and Tags
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem>
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/templates`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Templates
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem>
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/integrations`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Integrations
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem>
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/automations`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Automations
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem>
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/admins`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Admins
                        </NavLink>
                    </NavItem>
                    <NavItem><div className="separator"/></NavItem>
                    <NavItem>
                        <NavLink
                            to={`${this.props.match.url}/billing`}
                            activeClassName={'active'}
                            className={'nav-item nav-link mx-3 '}
                        >
                            Billing
                        </NavLink>
                    </NavItem>
                </nav>

                <div className="tab-content">
                    <div className="tab-pane active">
                        <Switch>
                            { (this.props.page && this.props.page.source == 'fb') && <Redirect
                                exact
                                path={`${this.props.match.path}`}
                                to={`${this.props.location.pathname}/persistent-menus`}
                            />}
                            { (this.props.page && this.props.page.source != 'fb') && <Redirect
                                exact
                                path={`${this.props.match.path}`}
                                to={`${this.props.location.pathname}/fields-tags`}
                            />}
                            <Route
                                path={`${this.props.match.path}/persistent-menus`}
                                exact
                                render={props => <PersistentMenu {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/fields-tags`}
                                exact
                                render={props => <CustomFieldTags {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/templates`}
                                render={props => <Templates {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/admins`}
                                render={props => <General {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/billing`}
                                render={props => <Billing {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/automations`}
                                render={props => <Automations {...props} />}
                            />
                            <Route
                                path={`${this.props.match.path}/integrations`}
                                render={props => <Integrations {...props} />}
                            />
                            <Redirect to={'/404'} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    page: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
    page: getPageFromUrl(state, props)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflows
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
