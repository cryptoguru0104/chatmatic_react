import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { Grid, FormControl, Select, MenuItem, Button } from '@material-ui/core';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Block, Pagination, Svg } from '../Layout';
import { MuiSwitch, MuiFilter, MuiPagination, MuiWidget } from "../../../components/Mui";
import MuiTypography from "../../../components/MuiTypography";
import VideoCard from "../../../components/VideoCard";
import NewBroadcastModal from './NewBroadcastModal';
import moment from 'moment';
import { getIntegrations, getIntegrationTypes } from 'scenes/Home/scenes/Settings/scenes/Integrations/services/actions';
import {
  getPageBroadcasts,
  deleteBroadcast
} from 'services/broadcasts/broadcastsActions';
import { getPages } from "services/pages/pagesActions";
import { getPageFromUrl } from "services/pages/selector";

import trainingVideoCover from 'assets/images/cover-broadcasts.png';
import './ListBroadcasts.scss';

const PAGE_ITEM_COUNT = 10;
class ListBroadcast extends Component {
  state = {
    page: 1,
    filterDays: 7,
    filterBy: 'ALL', //NAME, TYPE,
    filterQuery: '',
    showAddNewModal: false,
  };

  componentDidMount = () => {
    this.props.actions.getPageBroadcasts(this.props.match.params.id);
    this.props.actions.getIntegrations(this.props.match.params.id);
  };


  //#region delete trigger
  handleDeleteBroadcast = triggerId => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete this broadcast',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this broadcast',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteBroadcast(
          this.props.match.params.id,
          triggerId
        );
      }
    });
};

  handleSearch = (query) => {
    this.setState({
      filterQuery: query
    });
  };

  onAddNewModal = () => {
    this.setState({ showAddNewModal: true});
  };

  onCloseAddNewModal = () => {
    this.setState({ showAddNewModal: false});
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

    const self = this;
    setTimeout(() => {
      self.props.history.push(
        `/page/${self.props.match.params.id}/workflows/add?type=${type}`
      );
      Swal.close();
    }, 100);
  };

  renderBroadcasts = b => {
    let broadcastType = 'Messenger';
    if(b.options.broadcastType == 'sms') broadcastType = 'SMS';
    else if(b.options.broadcastType == 'email') broadcastType = 'Email';
    return (<>
      <Table.Cell>
        <Dropdown icon="ellipsis horizontal">
          <Dropdown.Menu>
            <Dropdown.Item
              icon="trash"
              text="Delete"
              as="button"
              onClick={() =>
                  this.handleDeleteBroadcast(b.uid)
              }
            />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
      <Table.Cell>{b.broadcastName}</Table.Cell>
      <Table.Cell>{broadcastType}</Table.Cell>
      <Table.Cell>{b.messagesDelivered}</Table.Cell>
      <Table.Cell>
          {b.messagesRead}
      </Table.Cell>
      <Table.Cell>
          {b.messagesClicked}
      </Table.Cell>
      <Table.Cell>
          <span className="label-revenue">---</span>
      </Table.Cell>
      </>
    );
  };

  render() {
    const { showAddNewModal, page, filterDays, filterBy, filterQuery } = this.state;

    const { broadcasts, loading } = this.props;
    if (loading && (!broadcasts || (broadcasts && broadcasts.length === 0))) {
      Swal({
        title: 'Please wait...',
        text: 'We are fetching broadcasts...',
        onOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    let pageBroadcasts = broadcasts.filter(b => {
      if(b.createdAtUtc == null) return false;
      if(moment(b.createdAtUtc).isBefore(moment().subtract(filterDays, 'days'))) return false;
      if(filterQuery.trim() == "") return true;
      if((filterBy == 'ALL' || filterBy == 'NAME') && b.broadcastName.toLowerCase().includes(filterQuery.trim().toLowerCase())) return true;
      if(filterBy == 'ALL' || filterBy == 'TYPE') {
        if(b.options.broadcastType == 'sms' || b.options.broadcastType == 'email') {
          if(b.options.broadcastType.includes(filterQuery.trim().toLowerCase())) return true;
        }
        else if('messenger'.includes(filterQuery.trim().toLowerCase())) return true;
      }
      return false;
    });
    pageBroadcasts = pageBroadcasts.slice((page - 1) * PAGE_ITEM_COUNT, page * PAGE_ITEM_COUNT);

    return (<Block className="main-container broadcast-container">
      {showAddNewModal && <NewBroadcastModal onClose={this.onCloseAddNewModal} onSelect={this.onAddNewBroadcast} />}
      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <Grid container direction="column" justify="space-between" alignItems="stretch" className="broadcast-list-container">
            <Grid item container justify="space-between" alignItems="stretch" className="list-head">
              <h2>Broadcasts</h2>
              <Grid item>
                <Grid container justify="flex-end" alignItems="stretch">
                  <FormControl variant="outlined">
                  <Select value={filterDays} onChange={e => this.setState({filterDays: e.target.value})} className="select-filter-days">
                    <MenuItem value={7}>7 Days</MenuItem>
                    <MenuItem value={14}>14 Days</MenuItem>
                    <MenuItem value={30}>30 Days</MenuItem>
                  </Select></FormControl>
                  <MuiFilter
                    onChangeType = {(type) => this.setState({filterBy: type})}
                    onChange = {this.handleSearch}
                    selecteField = {filterBy}
                    fieldOptions = {[{ value: 'ALL', label: 'All' }, { value: 'NAME', label: 'Name' }, { value: 'TYPE', label: 'Type' }]}
                  ></MuiFilter>
                  <Button className="btn-add-broadcast" variant="contained" color="primary" onClick={this.onAddNewModal} startIcon={<AddCircleOutlineIcon />}>
                    Add New Broadcast
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className="list-content">
              <Table celled className="float-left w-100">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                    <Table.HeaderCell>Broadcast Name</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Recipients</Table.HeaderCell>
                    <Table.HeaderCell>
                        Opens
                    </Table.HeaderCell>
                    <Table.HeaderCell>Clicked</Table.HeaderCell>
                    <Table.HeaderCell>Revenue</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {pageBroadcasts.map((broadcast, i) => 
                    <Table.Row key={i}>{this.renderBroadcasts(broadcast)}</Table.Row>
                  )}
                </Table.Body>
              </Table>

              {(!pageBroadcasts || pageBroadcasts.length === 0) && (
                <div className="empty-section">
                  <div><Svg name="list-empty" /></div>
                  <h4>Broadcast list is empty</h4>
                  <label>Create one-off flows to promote flash sales, events or product launches.</label>
                  <Button
                    onClick={this.onAddNewModal}
                    variant="contained"
                    color="secondary"
                    size="medium"
                    className="btn plusBtn text-capitalize"
                  >
                    <AddCircleOutlineIcon />
                    <span className="font-size-2">Add New Broadcast</span>
                  </Button>
                </div>
            )}
            </Grid>
            <Grid item className="list-footer">
              {broadcasts.length > PAGE_ITEM_COUNT && <MuiPagination 
                count={Math.ceil(broadcasts.length / PAGE_ITEM_COUNT)} 
                shape="rounded"
                onChange={(event, page) => this.setState({ page })}/>}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Block className="broadcast-sidebar-container">
            <Block className="text-block-container">
              <h2>
              Sending Broadcasts Tips
              </h2>
              <div>
                <ul style={{paddingLeft: '15px'}}>
                  <li>Broadcasts are sent via SMS/ Email/ or Direct Message but it's important to note that direct Message broadcasts will only be sent to those inside of the 24 hours window.</li>
                  <li>When sending a broadcast your goal should be to get your audience to as small a size as possible through our filtering and conditions. The reason for this is that you will get much better engagement and that is CRUCIAL for email performance when using SMTP mailing.</li>
                  <li>This also helps the performance of your broadcast because you will be "speaking" directly to a well outlined audience instead of trying to appeal to a large audience. Thus increasing the connection between you and your audience and increasing engagement with your message.</li>
                </ul>
              </div>
            </Block>
            <Block className="training-video-container">
              <div>
                  <h2>
                      Main Walkthrough
                  </h2>
              </div>
              <VideoCard src="https://youtu.be/jANom36p3aE" coverImage={trainingVideoCover} videoId="jANom36p3aE"></VideoCard>
            </Block>
          </Block>
        </Grid>
      </Grid>
    </Block>);
  }
}

const mapStateToProps = (state, props) => ({
  broadcasts: state.default.broadcasts.broadcasts,
  loading: state.default.broadcasts.loading,
  error: state.default.broadcasts.error,
  page: getPageFromUrl(state, props),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPages,
      getPageBroadcasts,
      deleteBroadcast,
      getIntegrations,
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ListBroadcast);
