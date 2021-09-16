import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import {
  deleteCustomField,
  getCustomFields,
  getCustomFieldSubscribers
} from 'services/customfields/actions';
import { Grid, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';
import { CSVLink } from 'react-csv';

import { getIntegrations, getIntegrationTypes } from 'scenes/Home/scenes/Settings/scenes/Integrations/services/actions';
import {  getSubscribers } from 'services/subscribers/selector';
import { getPageSubscribers } from 'services/subscribers/subscribersActions';
import { clearNewBroadcastCondition, updateNewBroadcastConditionCustomFields, updateNewBroadcastConditionTags } from 'services/broadcasts/broadcastsActions';
import { deleteTag, getTags, getTagSubscribers } from 'services/tags/actions';
import { getCustomFieldsState } from 'services/customfields/selector';
import { getTagsState } from 'services/tags/selector';
import { orderBy } from 'lodash';
import './styles.css';
import NewTagModal from './components/NewTagModal';
import NewCustomFieldModal from './components/NewCustomFieldModal';
import SubscribersModal from './components/SubscribersModal'
import InfoToggle from '../../../../components/InfoToggle';
import { Svg } from '../../../../Layout';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import NewBroadcastModal from 'scenes/Home/broadcasts/NewBroadcastModal';
class CustomFieldTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddNewTagOpen: false,
      isAddNewCustomFieldOpen: false,
      newAddErrorMessage: '',
      selectedCustomField: null,
      userInputFormat: 'text',
      subscibersType: null,
      showSubscibersModal: false,
      subscribers: [],
      checkedCustomFields: [],
      checkedTags: [],
      checkedCustomFieldsSubscribers: [],
      checkedTagsSubscribers: [],
      showBroadcastModal: false
    };
  }

  componentWillMount() {
    const { actions, match, pageTags } = this.props;

    actions.getTags(match.params.id);
    actions.getCustomFields(match.params.id);
    actions.getPageSubscribers(match.params.id, true, null, 1, 100000000000);
    this.props.actions.getIntegrations(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subscibersType } = this.state;
    const { loadingTags, errorTags, addingCustomField, addingCustomFieldError, tagsSubscribers, fieldsSubscribers } = nextProps;

    if (subscibersType) {
      if (loadingTags || addingCustomField) {
        Swal({
          title: 'Please wait...',
          text: 'We are loading subscribers data...',
          onOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
      } else {
        Swal.close();
        if (subscibersType === 'CUSTOM_FIELDS' && addingCustomFieldError) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: addingCustomFieldError || 'Something went wrong! Please try again.'
          });
        } else if (subscibersType === 'TAGS' && errorTags) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: errorTags || 'Something went wrong! Please try again.'
          });
        } else {
          this.setState({
            subscribers: subscibersType === 'CUSTOM_FIELDS' ? fieldsSubscribers : tagsSubscribers,
            showSubscibersModal: true
          })
        }
      }
      return true;
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
      this.setState({ isAddNewTagOpen: false });
      if (nextProps.addingTagError) {
        Swal(nextProps.addingTagError);
      }
    }
    if (nextProps.addingCustomField) {
      Swal({
        title: 'Please wait...',
        text: 'We are adding the new custom field...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.addingCustomField) {
      Swal.close();
      this.setState({ isAddNewCustomFieldOpen: false });
      if (nextProps.addingCustomFieldError) {
        Swal(nextProps.addingCustomFieldError);
      }
    }
  }

  _deleteCustomField = uid => {
    const { actions } = this.props;

    Swal({
      title:
        'Are you sure you want to delete this User Attribute field? This will remove it from all subscribers',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, please.',
      cancelButtonText: 'No, Don’t Do This',
      confirmButtonColor: '#f02727',
      cancelButtonColor: '#274BF0'
    }).then(result => {
      if (result.value) {
        actions.deleteCustomField(this.props.match.params.id, uid);
        this.toggleItem('CUSTOMFIELDS', {uid}, false);
      }
    });
  };

  _deleteTag = uid => {
    const { actions } = this.props;

    Swal({
      title: 'Are you sure you want to delete this tag?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, please.',
      cancelButtonText: 'No, Don’t Do This',
      confirmButtonColor: '#f02727',
      cancelButtonColor: '#274BF0'
    }).then(result => {
      if (result.value) {
        actions.deleteTag(this.props.match.params.id, uid);
        this.toggleItem('TAGS', {uid}, false);
      }
    });
  };

  _toggleIsAddNewCustomFieldOpen = () => {
    this.setState({
      isAddNewCustomFieldOpen: !this.state.isAddNewCustomFieldOpen,
      newAddErrorMessage: '',
      selectedCustomField: this.state.isAddNewCustomFieldOpen
        ? null
        : this.state.selectedCustomField
    });
  };

  _toggleIsAddNewTagOpen = () => {
    this.setState({
      isAddNewTagOpen: !this.state.isAddNewTagOpen,
      newAddErrorMessage: ''
    });
  };

  _handleSubscribers = (type, uId) => {
    const pageId = this.props.match.params.id;
    if (type === 'CUSTOM_FIELDS') {
      this.setState({
        subscibersType: type
      }, () => this.props.actions.getCustomFieldSubscribers(pageId, uId))
    } else {
      this.setState({
        subscibersType: type
      }, () => this.props.actions.getTagSubscribers(pageId, uId))
    }

  }

  handleCloseSubscribersModal = () => {
    this.setState({
      subscribers: [],
      showSubscibersModal: false,
      subscibersType: null        
    })
  }

  isCheckedAll = (type) => {
    const { checkedCustomFields, checkedTags } = this.state;
    const { customFields, pageTags } = this.props;

    return _.every(type == 'CUSTOMFIELDS' ? customFields : pageTags, t => (type == 'CUSTOMFIELDS' ? checkedCustomFields : checkedTags).indexOf(t.uid) !== -1);
  };
  isChecked = (type, t) => {
    const { checkedCustomFields, checkedTags } = this.state;
    return (type == 'CUSTOMFIELDS' ? checkedCustomFields : checkedTags).indexOf(t.uid) !== -1;
  };
  checkAll = (type) => e => {
    const { customFields, match, pageTags } = this.props;
    let newState = {};
    newState = e.target.checked ? (type == 'CUSTOMFIELDS' ? customFields : pageTags).map(t => t.uid) : [];

    if(type == 'CUSTOMFIELDS') {
      this.setState({
        checkedCustomFields: newState
      });
    }
    else if(type == 'TAGS') {
      this.setState({
        checkedTags: newState
      });
    }

    this.updateExportCSV(type, newState);
  };
  check = (type, t) => e => {
    this.toggleItem(type, t, e.target.checked);
  };
  
  toggleItem = (type, t, toggle) => {
    const { checkedCustomFields, checkedTags } = this.state;
    let newState = [...(type == 'CUSTOMFIELDS' ? checkedCustomFields : checkedTags)];
    if(toggle && newState.indexOf(t.uid) === -1) newState.push(t.uid);
    else if(!toggle) {
      const index = newState.indexOf(t.uid);
      if(index !== -1) {
        newState.splice(index, 1);
      }
    }
    if(type == 'CUSTOMFIELDS') {
      this.setState({
        checkedCustomFields: newState
      });
    }
    else if(type == 'TAGS') {
      this.setState({
        checkedTags: newState
      });
    }
    this.updateExportCSV(type, newState);
  }

  updateExportCSV = (type, items) => {
    const checked = items;
    const list = this.props.subscribers.filter(s => {
      const list = type == 'CUSTOMFIELDS' ? s.customFields : s.tags;
      for(var i = 0; i < checked.length; i++) {
        if(list.findIndex(k => (type == 'CUSTOMFIELDS' && k.customFieldUid == checked[i]) || (type == 'TAGS' && k.uid == checked[i])) === -1) return false;
      }
      return true;
    }).map((s,i) => [
      i+1, s.firstName, s.lastName, s.phone, s.email, s.location, s.psid, s.url, s.facebookUrl, s.youtubeUrl, s.instagramUrl, 
      (s.customFields.map(cf => '<' + cf.customField.fieldName + '>-' + cf.response)).join(','),
      ...(s.tags.map(t => t.value))
    ]);
    const meta = ['Index', 'First Name', 'Last Name', 'Phone', 'Email', 'Location', 'PSID', 'URL', 'Facebook', 'Youtube', 'Instagram', 'Attributes', 'Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    this.setState({
      [type == 'CUSTOMFIELDS' ? 'checkedCustomFieldsSubscribers' : 'checkedTagsSubscribers'] : [meta, ...list]
    });
  };

  createBroadcast = type => e => {
    this.setState({
      showBroadcastModal: type
    });
  };

  onCloseBroadcastModal = () => {
    this.setState({
      showBroadcastModal: false
    });
  };

  onAddNewBroadcast = (type) => {
    Swal({
      title: 'Please wait...',
      // text: 'We are saving trigger...',
      onOpen: () => {
          Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.props.actions.clearNewBroadcastCondition();
    if(this.state.showBroadcastModal == 'CUSTOMFIELDS') {
      if(this.state.checkedCustomFields.length == 0) return;
      this.props.actions.updateNewBroadcastConditionCustomFields(this.state.checkedCustomFields);
    }
    else if(this.state.showBroadcastModal == 'TAGS') {
      if(this.state.checkedTags.length == 0) return;
      this.props.actions.updateNewBroadcastConditionTags(this.state.checkedTags);
    }
    const self = this;
    setTimeout(() => {
      self.props.history.push(
        `/page/${self.props.match.params.id}/workflows/add?type=${type}`
      );
      Swal.close();
    }, 2000);
  };

  render() {
    const { customFields, match, pageTags } = this.props;
    const {
      isAddNewCustomFieldOpen,
      isAddNewTagOpen,
      selectedCustomField,
      showSubscibersModal,
      subscribers,
      showBroadcastModal
    } = this.state;

    return (
      <>

        {showSubscibersModal &&
          <SubscribersModal
            open={showSubscibersModal}
            subscribers={subscribers}
            close={this.handleCloseSubscribersModal}
          />
        }

        {showBroadcastModal && <NewBroadcastModal onClose={this.onCloseBroadcastModal} onSelect={this.onAddNewBroadcast} />}
        <Grid container className="customfieldtags-page-container" spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <div className="customfields-container">
            <Grid className="title-bar" container direction="row" justify="space-between" alignItems="stretch">
              <Grid item>
                <Grid container direction="row" justify="flex-start">
                  <h2 className="d-inline mr-3">Custom Fields</h2>
                  <InfoToggle text="Custom Fields allow YOU to create any data field you'd like to collect and store it to that subscriber. This could be anything from their birthday to their favorite color. This is also a field you will be able to broadcast off of, and will be data that is included when you send information to a third party platform, such as an autoresponder or Zapier." />
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Svg name="export" />}
                >
                  <CSVLink
                    ref="csv"
                    data={this.state.checkedCustomFieldsSubscribers}
                    filename={'subscribers.csv'}
                  >
                    Export
                  </CSVLink>
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Svg name="broadcast1" />}
                  onClick={this.createBroadcast('CUSTOMFIELDS')}
                  disabled={this.state.checkedCustomFields.length == 0}
                >
                  Broadcast
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ControlPointIcon />}
                  onClick={this._toggleIsAddNewCustomFieldOpen}
                >
                  Add New
                </Button>
                {isAddNewCustomFieldOpen && (
                    <NewCustomFieldModal
                    customField={selectedCustomField}
                    isOpen={isAddNewCustomFieldOpen}
                    pageId={match.params.id}
                    toggle={this._toggleIsAddNewCustomFieldOpen}
                  />
                )}
              </Grid>
            </Grid>
            <div className="table-container">
            <Table stickyHeader>
              <TableHead >
                <TableRow>
                  <TableCell><Checkbox checked={this.isCheckedAll('CUSTOMFIELDS')} onChange={this.checkAll('CUSTOMFIELDS')} /> NAME</TableCell>
                  <TableCell className="cellType">TYPE</TableCell>
                  <TableCell className="cellAction">EDIT / DELETE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(
                  customFields,
                  [field => field.fieldName.toLowerCase()],
                  'asc'
                ).map((field, index) => (
                  <TableRow key={index}>
                    <TableCell><Checkbox checked={this.isChecked('CUSTOMFIELDS', field)} onChange={this.check('CUSTOMFIELDS', field)} /> {field.fieldName}</TableCell>
                    <TableCell>{field.validationType}</TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-center align-items-center">
                        <Button
                          onClick={() => this._handleSubscribers('CUSTOM_FIELDS', field.uid)}
                          startIcon={<i className="fa fa-eye" />}
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => {
                            this.setState(
                              { selectedCustomField: field },
                              () => {
                                this._toggleIsAddNewCustomFieldOpen(field.uid);
                              }
                            );
                          }}
                          startIcon={<i className="fa fa-pencil" />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => this._deleteCustomField(field.uid)}
                          startIcon={<i className="fa fa-trash" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <div className="tags-container">
            <Grid className="title-bar" container direction="row" justify="space-between" alignItems="stretch">
              <Grid item>
                <Grid container direction="row" justify="flex-start">
                  <h2 className="d-inline mr-3">Tags</h2>
                  <InfoToggle text='Tags are more identifiers and help you place labels on subscribers as they go through your sequences. This will let you know that they clicked something important, allowing you to broadcast based on that data in the future as well. Tags are a lot like "buckets" and you can place your subscribers in these buckets allowing you to know more about them over time.' />
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Svg name="export" />}
                >
                  <CSVLink
                    ref="csv"
                    data={this.state.checkedTagsSubscribers}
                    filename={'subscribers.csv'}
                  >
                    Export
                  </CSVLink>
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Svg name="broadcast1" />}
                  onClick={this.createBroadcast('TAGS')}
                  disabled={this.state.checkedTags.length == 0}
                >
                  Broadcast
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ControlPointIcon />}
                  onClick={this._toggleIsAddNewTagOpen}
                >
                  Add New
                </Button>

              {isAddNewTagOpen && (
                <NewTagModal
                  isOpen={isAddNewTagOpen}
                  pageId={match.params.id}
                  toggle={this._toggleIsAddNewTagOpen}
                />
              )}
              </Grid>
            </Grid>
            <div className="table-container">
            <Table stickyHeader >
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox checked={this.isCheckedAll('TAGS')} onChange={this.checkAll('TAGS')} /> NAME</TableCell>
                  <TableCell className="cellAction">DELETE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(pageTags, [tag => tag.value.toLowerCase()], 'asc').map(
                  (tag, index) => (
                    <TableRow key={index}>
                      <TableCell><Checkbox checked={this.isChecked('TAGS', tag)} onChange={this.check('TAGS', tag)} /> {tag.value}</TableCell>
                      <TableCell>
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            className="btn btn-link p-0"
                            onClick={() => this._handleSubscribers('TAGS', tag.uid)}
                            startIcon={<i className="fa fa-eye" />}
                          >
                            View
                          </Button>
                          <Button
                            className="btn btn-link p-0"
                            onClick={() => this._deleteTag(tag.uid)}
                            startIcon={<i className="fa fa-trash" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            </div>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

CustomFieldTags.propTypes = {
  addingCustomField: PropTypes.bool.isRequired,
  addingCustomFieldError: PropTypes.any,
  customFields: PropTypes.array.isRequired,
  pageTags: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  addingCustomField: getCustomFieldsState(state).loading,
  addingCustomFieldError: getCustomFieldsState(state).error,
  addingTag: getTagsState(state).loading,
  addingTagError: getTagsState(state).error,
  customFields: getCustomFieldsState(state).customFields,
  pageTags: getTagsState(state).tags,
  loadingTags: getTagsState(state).loading,
  errorTags: getTagsState(state).error,
  fieldsSubscribers: getCustomFieldsState(state).subscribers,
  tagsSubscribers: getTagsState(state).subscribers,
  subscribers: getSubscribers(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      deleteCustomField,
      deleteTag,
      getCustomFields,
      getTags,
      getCustomFieldSubscribers,
      getTagSubscribers,
      getPageSubscribers,
      getIntegrations,
      clearNewBroadcastCondition,
      updateNewBroadcastConditionCustomFields,
      updateNewBroadcastConditionTags
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomFieldTags);
