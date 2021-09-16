import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { CSVLink } from 'react-csv';
import { Grid, Button, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Popover  } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Swal from 'sweetalert2';

import { Svg, Block } from 'scenes/Home/Layout';
import { updateNewBroadcastConditionTriggers, clearNewBroadcastCondition } from 'services/broadcasts/broadcastsActions';
import {  getSubscribers } from 'services/subscribers/selector';
import { getPageSubscribers } from 'services/subscribers/subscribersActions';
import NewBroadcastModal from 'scenes/Home/broadcasts/NewBroadcastModal';


import './styles.scss';
import AutomationPopover from '../AutomationPopover';

class SubscribersPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: [],
      checkedSubscribers: [],

      isAutomationPopupVisible: false,
      isNewBroadcastModal: false
    };

    const { actions, match, workflowTrigger } = this.props;

    actions.getPageSubscribers(match.params.id, true, {
      params: { campaigns: [{
        value: workflowTrigger.uid
      }]}
    }, 1, 100000000000);
  }

  componentWillMount() {
  }

  onCloseBroadcastModal = () => {
    this.setState({
      isNewBroadcastModal: false
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
    this.props.actions.updateNewBroadcastConditionTriggers([this.props.workflowTrigger.uid]);
    const self = this;
    setTimeout(() => {
      self.props.history.push(
        `/page/${self.props.match.params.id}/workflows/add?type=${type}`
      );
      Swal.close();
    }, 1000);
  };

  isCheckedAll = () => {
    const { checkedItems } = this.state;
    const { workflowTrigger } = this.props;

    return _.every(workflowTrigger.subscribers, t => checkedItems.indexOf(t.uid) !== -1);
  };
  isChecked = (t) => {
    const { checkedItems } = this.state;
    return checkedItems.indexOf(t.uid) !== -1;
  };
  checkAll = (e) => {
    const { workflowTrigger } = this.props;
    let newState = e.target.checked ? workflowTrigger.subscribers.map(t => t.uid) : [];
    this.setState({
      checkedItems: newState
    });
    this.updateExportCSV(newState);
  };
  check = (t) => e => {
    const { checkedItems } = this.state;
    let newState = [...checkedItems];
    if(e.target.checked && newState.indexOf(t.uid) === -1) newState.push(t.uid);
    else if(!e.target.checked) {
      const index = newState.indexOf(t.uid);
      if(index !== -1) {
        newState.splice(index, 1);
      }
    }
    this.setState({
      checkedItems: newState
    });

    this.updateExportCSV(newState);
  };
  updateExportCSV = (items) => {
    const checked = items;
    console.log(this.props.subscribers);
    console.log(items);
    const list = this.props.subscribers.filter(s => checked.indexOf(s.uid) !== -1).map((s,i) => [
      i+1, s.firstName, s.lastName, s.phone, s.email, s.location, s.psid, s.url, s.facebookUrl, s.youtubeUrl, s.instagramUrl, 
      (s.customFields.map(cf => '<' + cf.customField.fieldName + '>-' + cf.response)).join(','),
      ...(s.tags.map(t => t.value))
    ]);
    const meta = ['Index', 'First Name', 'Last Name', 'Phone', 'Email', 'Location', 'PSID', 'URL', 'Facebook', 'Youtube', 'Instagram', 'Attributes', 'Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    this.setState({
      checkedSubscribers : [meta, ...list]
    });
  };

  render() {
    const { checkedItems, isAutomationPopupVisible, isNewBroadcastModal } = this.state;
    const { workflowTrigger, close } = this.props;
    
    if(!workflowTrigger) return (<></>);

    return (
    <Dialog open={true} onClose={close} maxWidth="md">
    <DialogContent className="trigger-subscribers-popup-container">
      {isNewBroadcastModal && <NewBroadcastModal onClose={this.onCloseBroadcastModal} onSelect={this.onAddNewBroadcast} />}
      <Grid container justify="space-between" alignItems="stretch" className="trigger-subscribers-popup-header">
        <h3>Subscribers: {workflowTrigger.subscribers.length}</h3>
        <Block>
          <Button
            variant="outlined"
            startIcon={<Svg name="export" />}
            disabled={checkedItems.length == 0}
          >
            <CSVLink
              ref="csv"
              data={this.state.checkedSubscribers}
              filename={'subscribers.csv'}
            >
              Export
            </CSVLink>
          </Button>
          <Button
            variant="outlined"
            startIcon={<Svg name="broadcast1" />}
            onClick={() => this.setState({isNewBroadcastModal: true})}
            disabled={workflowTrigger.subscribers.length == 0}
          >
            Broadcast
          </Button>
          <Button
            variant="outlined"
            startIcon={<Svg name="thunderbolt" />}
            onClick={(e) => this.setState({isAutomationPopupVisible: e.currentTarget})}
          >
            Automation
          </Button>
          {isAutomationPopupVisible && <Popover open={isAutomationPopupVisible} anchorEl={isAutomationPopupVisible} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => this.setState({isAutomationPopupVisible: null})}>
            <AutomationPopover workflowTrigger={workflowTrigger} subscribers={checkedItems}  onClose={() => this.setState({isAutomationPopupVisible: null})}/>
          </Popover>}
        </Block>
      </Grid>

      <Block className="trigger-subscribers-popup-table-container">
        <Table stickyHeader>
          <TableHead >
            <TableRow>
              <TableCell><Checkbox checked={this.isCheckedAll()} onChange={this.checkAll} /></TableCell>
              <TableCell>Select All</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflowTrigger.subscribers.map((field, index) => (
              <TableRow key={index}>
                <TableCell><Checkbox checked={this.isChecked(field)} onChange={this.check(field)} /></TableCell>
                <TableCell>
                  <img src={field.profilePicUrl} className="subscriber-avatar" />
                  <span className="subscriber-name">{`${field.firstName?field.firstName:""} ${field.lastName?field.lastName:""}`}</span>
                  {/* <span className="subscriber-name">{`${field.firstName??""} ${field.lastName??""}`}</span> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Block>
    </DialogContent></Dialog>);
  }
}

SubscribersPopup.propTypes = {
  workflowTrigger: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  subscribers: getSubscribers(state),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          getPageSubscribers,
          updateNewBroadcastConditionTriggers,
          clearNewBroadcastCondition
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SubscribersPopup)
);
