import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/lib/Creatable';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import { getTagsState } from 'services/tags/selector';
import { getAutomationsState } from '../../services/selector';
import { addTag, getTags } from 'services/tags/actions';
import {
    updateAutomation,
    deleteAutomation,
    addAutomation
} from '../../services/actions';
import { getIntegrations } from '../../../Integrations/services/actions';

import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';

import couponIcon from 'assets/images/icon-coupon.png';
// import inboxMailIcon from 'assets/images/icon-inbox-email.png';
import marketingIcon from 'assets/images/icon-marketing.png';
import namecardIcon from 'assets/images/icon-namecard.png';
import timelineIcon from 'assets/images/icon-timeline.png';
import './styles.css';

class AutomationEdit extends React.Component {
    state = {
        name: this.props.automation.name || '',
        active: this.props.automation.active || false,
        tags: (this.props.automation && this.props.automation.tags) || [],
        userUnsubscribe:
            (this.props.automation && this.props.automation.userUnsubscribe) ||
            false,
        triggerIntegrations:
            (this.props.automation &&
                this.props.automation.triggerIntegrations) ||
            [],
        notifyAdmins:
            (this.props.automation && this.props.automation.notifyAdmins) || [],
        notifyAdmin: {
            adminId: null,
            message: ''
        },
        triggerIntegration: {
            uid: ''
            // leadTo: ''
        },
        nameEditing: false,
        activeAutomationType: ''
    };

    componentDidMount() {
        this.props.actions.getTags(this.props.match.params.id);
        this.props.actions.getIntegrations(this.props.match.params.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.loadingTags || nextProps.loadingIntegrations) {
            Swal({
                title: 'Please wait...',
                text: 'Loading...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTags || this.props.loadingIntegrations) {
            Swal.close();

            if (nextProps.errorTags) {
                toastr.error(nextProps.errorTags);
            }
            if (nextProps.errorIntegrations) {
                toastr.error(nextProps.errorIntegrations);
            }
        }
        if (nextProps.addingTag) {
            Swal({
                title: 'Please wait...',
                text: 'We are adding a new tag to the page...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.addingTag) {
            Swal.close();
            if (nextProps.addingTagError) {
                Swal(nextProps.addingTagError);
            }
        }

        if (nextProps.savingAutomation) {
            Swal({
                title: 'Please wait...',
                text: 'We are processing the automation...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.savingAutomation) {
            Swal.close();

            if (nextProps.savingError) {
                toastr.error(nextProps.savingError);
            } else {
                this.props.goBack();
            }
        }
    }

    _removeAutomation = () => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this automation.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete the automation',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteAutomation(
                    this.props.match.params.id,
                    this.props.automation.uid
                );
            }
        });
    };

    _addToAutomation = () => {
        if (this.state.activeAutomationType === 'triggerIntegration') {
            if (!this.state.triggerIntegration.uid) {
                toastr.warning('Please select an integration');
                return;
            }
            if (
                this.state.triggerIntegration.uid
                // && this.state.triggerIntegration.leadTo
            ) {
                this.setState({
                    triggerIntegrations: this.state.triggerIntegrations.concat([
                        this.state.triggerIntegration
                    ]),
                    triggerIntegration: {
                        uid: ''
                        // leadTo: ''
                    }
                });
            }
        } else if (this.state.activeAutomationType === 'notifyAdmin') {
            if (
                !!this.state.notifyAdmin.adminId &&
                this.state.notifyAdmin.message
            ) {
                this.setState({
                    notifyAdmins: this.state.notifyAdmins.concat([
                        this.state.notifyAdmin
                    ]),
                    notifyAdmin: {
                        adminId: null,
                        message: ''
                    }
                });
            }
        }
    };

    _saveAutomation = () => {
        const automation = this.props.automation;

        if (!this.state.name.trim()) {
            toastr.warning('Please type the Automation name.');
            return;
        }

        const tags = this.state.tags.map(tag => {
            const pageTag = this.props.pageTags.find(
                pageTag => pageTag.value === tag.value
            );

            if (!pageTag) {
                Swal(`The tag ${tag.value} was not added to this page.`);
                return tag;
            } else {
                return pageTag;
            }
        });

        const reqParams = {
            userUnsubscribe: this.state.userUnsubscribe,
            triggerIntegrations: this.state.triggerIntegrations,
            notifyAdmins: this.state.notifyAdmins,
            name: this.state.name,
            active: this.state.active
        };

        if (automation.uid) {
            this.props.actions.updateAutomation(
                this.props.match.params.id,
                automation.uid,
                {
                    ...reqParams,
                    tags
                }
            );
        } else {
            this.props.actions.addAutomation(this.props.match.params.id, {
                ...reqParams,
                tags
            });
        }
    };

    _getIntegrationName = integrationUid => {
        const integration = this.props.integrations.find(
            element => element.uid === integrationUid
        );

        return integration ? integration.name : '';
    };

    render() {
        const renderAutomationPanel = () => {
            switch (this.state.activeAutomationType) {
                case 'addTag':
                    return (
                        <div className="add-tag-container">
                            <p>Add New Tag</p>
                            <CreatableSelect
                                isMulti
                                onChange={tags =>
                                    tags.length > this.state.tags.length &&
                                    this.setState({ tags })
                                }
                                options={this.props.pageTags}
                                placeholder="Search for a existing tag or create a new one"
                                isClearable={false}
                                getOptionLabel={option =>
                                    'uid' in option
                                        ? option.value
                                        : option.label
                                }
                                getOptionValue={option =>
                                    (option.uid && option.uid.toString()) ||
                                    option.value
                                }
                                onCreateOption={value => {
                                    this.props.actions.addTag(
                                        this.props.match.params.id,
                                        value
                                    );
                                    this.setState({
                                        tags: this.state.tags.concat([
                                            { value, uid: value }
                                        ])
                                    });
                                }}
                                value={this.state.tags}
                                isValidNewOption={label => {
                                    if (!label) return false;

                                    let returnValue = true;

                                    this.props.pageTags.forEach(option => {
                                        if (
                                            label.toLowerCase() ===
                                            option.value.toLowerCase()
                                        )
                                            returnValue = false;
                                    });

                                    return returnValue;
                                }}
                            />
                        </div>
                    );
                case 'notifyAdmin':
                    const admin = this.props.admins.find(
                        admin => admin.uid === this.state.notifyAdmin.adminId
                    );
                    return (
                        <div className="notify-admin-container">
                            <p>Notify Admin</p>
                            <div className="form-group">
                                <label className="mb-0">Admin:</label>
                                <UncontrolledDropdown
                                    style={{ width: '100%', borderRadius: 20 }}
                                >
                                    <DropdownToggle
                                        className="py-0 pl-0 m-0 w-100"
                                        style={{
                                            borderWidth: 0,
                                            borderRadius: 20,
                                            backgroundColor: 'white',
                                            border: '1px solid #ebebeb'
                                        }}
                                        caret
                                    >
                                        <input
                                            type="text"
                                            value={admin ? admin.email : ''}
                                            style={{
                                                borderWidth: 0,
                                                backgroundColor: 'white',
                                                borderRadius: 20
                                            }}
                                            disabled
                                        />
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
                                        {this.props.admins.map(
                                            (admin, index) => (
                                                <DropdownItem key={index}>
                                                    <div
                                                        onClick={() =>
                                                            this.setState({
                                                                notifyAdmin: {
                                                                    adminId:
                                                                        admin.uid,
                                                                    message: ''
                                                                }
                                                            })
                                                        }
                                                    >
                                                        {admin.email}
                                                    </div>
                                                </DropdownItem>
                                            )
                                        )}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            <div className="form-group">
                                <label className="mb-0">Notification</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.notifyAdmin.message}
                                    onChange={event =>
                                        this.setState({
                                            notifyAdmin: {
                                                ...this.state.notifyAdmin,
                                                message: event.target.value
                                            }
                                        })
                                    }
                                />
                            </div>
                            <div className="mt-3 d-flex justify-content-end">
                                <button
                                    className="btn btn-primary text-white font-weight-normal text-center btn-add-automation"
                                    onClick={this._addToAutomation}
                                >
                                    Add To Automation
                                </button>
                            </div>
                        </div>
                    );
                case 'triggerIntegration':
                    const integration = this.props.integrations.find(
                        integration =>
                            integration.uid ===
                            this.state.triggerIntegration.uid
                    );
                    const integrationName = integration ? integration.name : '';
                    const filteredIntegrations = this.props.integrations.filter(
                        element =>
                            !this.state.triggerIntegrations.find(
                                integration => integration.uid === element.uid
                            )
                    );

                    return (
                        <div className="trigger-integration-container">
                            <p>Trigger Integration</p>
                            <div className="form-group">
                                <label className="mb-0">Integration:</label>
                                <UncontrolledDropdown
                                    style={{ width: '100%', borderRadius: 20 }}
                                >
                                    <DropdownToggle
                                        className="py-0 pl-0 m-0 w-100"
                                        style={{
                                            borderWidth: 0,
                                            borderRadius: 20,
                                            backgroundColor: 'white',
                                            border: '1px solid #ebebeb'
                                        }}
                                        caret
                                    >
                                        <input
                                            type="text"
                                            value={integrationName}
                                            style={{
                                                borderWidth: 0,
                                                backgroundColor: 'white',
                                                borderRadius: 20
                                            }}
                                            disabled
                                        />
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
                                        {filteredIntegrations.map(
                                            (element, index) => {
                                                const integration = this.props.integrations.find(
                                                    item =>
                                                        item.uid === element.uid
                                                );
                                                const integrationName = integration
                                                    ? integration.name
                                                    : '';

                                                return (
                                                    <DropdownItem key={index}>
                                                        <div
                                                            onClick={() =>
                                                                this.setState({
                                                                    triggerIntegration: {
                                                                        ...this
                                                                            .state
                                                                            .triggerIntegration,
                                                                        uid:
                                                                            element.uid
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            {integrationName}
                                                        </div>
                                                    </DropdownItem>
                                                );
                                            }
                                        )}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-primary text-white font-weight-normal text-center btn-add-automation"
                                    onClick={this._addToAutomation}
                                >
                                    Add To Automation
                                </button>
                            </div>
                        </div>
                    );
                default:
                    return <div />;
            }
        };

        const renderAutomationHeader = () => {
            if (this.state.nameEditing) {
                return (
                    <div className="d-flex justify-content-between align-items-center automation-header">
                        <input
                            type="text"
                            defaultValue={this.state.name}
                            ref={ref => (this.nameInputRef = ref)}
                            className="form-control"
                        />
                        <button
                            className="btn btn-link text-primary p-0 m-0"
                            onClick={() =>
                                this.setState({
                                    name: this.nameInputRef
                                        ? this.nameInputRef.value
                                        : this.state.name,
                                    nameEditing: false
                                })
                            }
                        >
                            SAVE
                        </button>
                        <button
                            className="btn btn-link text-danger ml-2 p-0"
                            onClick={() =>
                                this.setState({ nameEditing: false })
                            }
                        >
                            CANCEL
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="d-flex justify-content-between align-items-center automation-header">
                        <div className="d-flex align-items-end">
                            <span className="mr-2 header-title">
                                {this.state.name}
                            </span>
                            <button
                                className="btn btn-link p-0"
                                onClick={() =>
                                    this.setState({ nameEditing: true })
                                }
                            >
                                EDIT
                            </button>
                        </div>
                        <div className="d-flex align-items-center subscribe-toggle">
                            <span>{this.state.active ? 'ON' : 'OFF'}</span>
                            <Switch
                                checked={this.state.active}
                                onChange={active => this.setState({ active })}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                offColor="#fff"
                                onColor="#fff"
                                offHandleColor="#b1b9cd"
                                onHandleColor="#274bf0"
                                width={41}
                                height={24}
                                handleDiameter={16}
                            />
                        </div>
                    </div>
                );
            }
        };

        return (
            <div className="d-flex flex-column bg-white automation-edit-container">
                <div className="d-flex flex-column">
                    <button
                        className="btn btn-link btn-back"
                        onClick={this.props.goBack}
                    >
                        <i className="fa fa-angle-left mr-2" />
                        Back to Automations
                    </button>
                    <div className="d-flex automation-edit-content">
                        <div className="d-flex flex-column left-content-wrapper">
                            <div className="d-flex flex-column bg-white automation-container">
                                {renderAutomationHeader()}
                                <div className="d-flex automation-item-container">
                                    <div className="d-flex flex-column justify-content-center align-items-center automation-field border-right">
                                        <small>LAST 24 HOURS</small>
                                        <p style={{ color: '#277af0' }}>
                                            {this.props.automation.withinDay ||
                                                0}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center automation-field">
                                        <small>TOTAL NUMBER</small>
                                        <p>
                                            {this.props.automation.total || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center flex-wrap align-items-center actions-container">
                                    <button
                                        className="btn btn-link"
                                        onClick={() =>
                                            this.setState({
                                                activeAutomationType: 'addTag'
                                            })
                                        }
                                    >
                                        ADD TAG
                                        <img
                                            src={couponIcon}
                                            className="ml-2"
                                            alt=""
                                        />
                                    </button>
                                    <button
                                        className="btn btn-link"
                                        onClick={() =>
                                            this.setState({
                                                activeAutomationType:
                                                    'triggerIntegration',
                                                triggerIntegration: {
                                                    uid: ''
                                                    // leadTo: ''
                                                }
                                            })
                                        }
                                    >
                                        TRIGGER INTEGRATION
                                        <img
                                            src={timelineIcon}
                                            className="ml-2"
                                            alt=""
                                        />
                                    </button>
                                    <button
                                        className="btn btn-link"
                                        onClick={() =>
                                            this.setState({
                                                userUnsubscribe: true,
                                                activeAutomationType: ''
                                            })
                                        }
                                    >
                                        UNSUBSCRIBE USER
                                        <img
                                            src={namecardIcon}
                                            className="ml-2"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </div>
                            {renderAutomationPanel()}
                        </div>
                        <div className="d-flex flex-column right-content-wrapper">
                            {this.state.tags.length > 0 && (
                                <div className="action-container">
                                    <p>Tags</p>
                                    <div className="d-flex flex-wrap">
                                        {this.state.tags.map((tag, index) => (
                                            <span
                                                className="tag mr-1 mb-1"
                                                key={index}
                                            >
                                                {tag.value}
                                                <button
                                                    className="btn btn-link p-0 ml-2"
                                                    onClick={() =>
                                                        this.setState({
                                                            tags: this.state.tags.filter(
                                                                item =>
                                                                    item.value !==
                                                                    tag.value
                                                            )
                                                        })
                                                    }
                                                >
                                                    <i className="fa fa-close" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {this.state.triggerIntegrations.length > 0 && (
                                <div className="action-container">
                                    <p>Integration</p>
                                    {this.state.triggerIntegrations.map(
                                        (integration, index) => (
                                            <span
                                                className="mb-2 tag d-flex justify-content-between"
                                                key={index}
                                            >
                                                {this._getIntegrationName(
                                                    integration.uid
                                                )}
                                                <button
                                                    className="btn btn-link p-0 ml-2"
                                                    onClick={() => {
                                                        this.setState({
                                                            triggerIntegrations: this.state.triggerIntegrations.filter(
                                                                x =>
                                                                    x.uid !=
                                                                    integration.uid
                                                            )
                                                        });
                                                    }}
                                                >
                                                    <i className="fa fa-close" />
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                            {this.state.notifyAdmins.length > 0 && (
                                <div className="d-flex flex-column action-container">
                                    <p>Notify Admin</p>
                                    {this.state.notifyAdmins.map(
                                        notifyAdmin => (
                                            <span className="tag mb-2">
                                                {
                                                    this.props.admins.find(
                                                        admin =>
                                                            admin.uid ===
                                                            notifyAdmin.adminId
                                                    ).email
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                            {this.state.userUnsubscribe && (
                                <div className="action-container">
                                    <p>Unsubscribe User</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center automation-edit-footer">
                    <div className="d-flex justify-content-between left-footer">
                        <button
                            onClick={this._saveAutomation}
                            className="btn btn-primary text-white font-weight-normal text-center btn-add-automation"
                        >
                            Save & Complete
                        </button>
                    </div>
                    <div className="d-flex justify-content-end right-footer">
                        <button
                            onClick={this._removeAutomation}
                            className="btn btn-link font-weight-normal btn-delete-automation p-0"
                            disabled={!this.props.automation.uid}
                        >
                            Delete Automation
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

AutomationEdit.propTypes = {
    goBack: PropTypes.func.isRequired,
    pageTags: PropTypes.array.isRequired,
    loadingTags: PropTypes.bool.isRequired,
    errorTags: PropTypes.any,
    actions: PropTypes.object.isRequired,
    automation: PropTypes.shape({
        uid: PropTypes.any,
        pageUid: PropTypes.number,
        active: PropTypes.bool,
        withinDay: PropTypes.number,
        total: PropTypes.number,
        name: PropTypes.string,
        tags: PropTypes.array,
        userUnsubscribe: PropTypes.bool,
        triggerIntegrations: PropTypes.array,
        notifyAdmins: PropTypes.array
    }).isRequired,
    integrations: PropTypes.array.isRequired,
    savingAutomation: PropTypes.bool.isRequired,
    savingError: PropTypes.any,
    admins: PropTypes.array.isRequired,
    addingTag: PropTypes.bool.isRequired,
    addingTagError: PropTypes.any,
    loadingIntegrations: PropTypes.bool.isRequired,
    errorIntegrations: PropTypes.any
};

const mapStateToProps = state => ({
    pageTags: getTagsState(state).tags,
    loadingTags: getTagsState(state).loading,
    errorTags: getTagsState(state).error,
    savingAutomation: getAutomationsState(state).loading,
    savingError: getAutomationsState(state).error,
    admins: state.default.settings.admins.admins,
    addingTag: getTagsState(state).loading,
    addingTagError: getTagsState(state).error,
    integrations: state.default.settings.integrations.integrations,
    loadingIntegrations: state.default.settings.integrations.loading,
    errorIntegrations: state.default.settings.integrations.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateAutomation,
            deleteAutomation,
            addAutomation,
            addTag,
            getTags,
            getIntegrations
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AutomationEdit)
);
