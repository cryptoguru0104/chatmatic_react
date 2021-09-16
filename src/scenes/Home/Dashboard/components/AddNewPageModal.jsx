import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Image, Table } from 'semantic-ui-react';
import { Grid, Dialog, DialogContent, DialogTitle, Button, IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import 'hayer-react-image-crop/style.css';

// import { pageFileUpload, updateEngage } from '../../scenes/EngageAdd/services/actions';
import { getAllPages, toggleConnect, connectAll } from 'services/pages/pagesActions';
// import { Block } from '../../Layout';
import Swal from 'sweetalert2';
import { Block } from '../../Layout';

import './AddNewPageModal.scss';

class AddNewPageModal extends Component {
  //#region lifecycle
  state = {
    connectStatus: null,
    isAllConnecting: false
  }

  componentDidMount = () => {
    this.setState({ loadPages: true }, () => {
      this.props.actions.getAllPages();
    });
  }

  UNSAFE_componentWillReceiveProps = ({ loading, error, close }) => {
    const { connectStatus, isAllConnecting } = this.state;
    if (error) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: error || 'Something went wrong! Please try again.'
      });
    }

    if (loading && connectStatus === 'connecting') {
      // this.setState({ connectStatus: 'done' });
      Swal({
        title: 'Please wait...',
        text: `we are connecting${isAllConnecting ? ' all pages' : ''}...`,
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (!loading && connectStatus === 'connecting') {
      this.setState({ connectStatus: null, isAllConnecting: false });
      Swal.close();
      Swal.fire({
        type: 'success',
        title: 'Success!',
        text: `${isAllConnecting ? 'All pages are' : 'Page is'} successfully connected.`,
        showConfirmButton: true
      });
      if (isAllConnecting) {
        close();
      }
      // this.props.actions.getAllPages();
    }

    if (loading && connectStatus === null) {
      Swal({
        title: 'Please wait...',
        text: 'we are loading...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (!loading && connectStatus === null) {
      Swal.close()
      this.setState({ loadPages: false });
    }
  }
  //#endregion

  close = () => this.props.close();

  onToggleConnect = pageId => {
    this.setState({ connectStatus: 'connecting' }, () => {
      this.props.actions.toggleConnect(pageId);
    });
  }

  handleConnectAll = () => {
    this.setState({ connectStatus: 'connecting', isAllConnecting: true }, () => {
      this.props.actions.connectAll();
    });
  }

  render() {
    const { open, allPages, pageType } = this.props;

    const { loadPages } = this.state;
    const pages = allPages.filter(p=> p.source == pageType);//.filter(p => !p.isConnected)
    return (
      <Dialog
        // size="fullscreen"
        className="custom-popup imgCropPopUp addPnewPop"
        open={open}
        onClose={() => false}
      >
        <DialogTitle>
          <Grid container direction="row" justify ="space-between" alignItems="center">
            <div className="add-page-dialog-title">
              <AddCircleOutlineIcon />
              {this.props.pageType == 'fb' ? 'Add New Facebook Page' : 'Add New Instagram Page'}
            </div>
            <IconButton onClick={this.close}><CloseIcon /></IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent className="add-page-dialog-content">
          <p>
            Connecting all pages costs you nothing. You only need to license a page when it reaches 500 subscribers so our suggestion is to connect ALL of your pages so they start collecting data. One day you may find that one of your pages has 500 subscribers and you'd like to license it, at which time you'll see that option below and on the page dashboard
          </p>
          {!loadPages && (!pages || (pages && pages.length === 0)) && <h4 className="text-center">No page found to connect</h4>}
          {pages && pages.length > 0 &&
            <Block className="add-page-dialog-list">
              {pages.map((p, ind) => (
                <Grid container className="add-page-list-item" justify="space-between" alignItems="center">
                  <Image
                    circular
                    size="small"
                    src={`https://graph.facebook.com/${p.fbId}/picture?type=large`}
                  />
                  <a target="_blank" href={p.fbLink}>{p.fbName}</a>
                  <Button variant="contained" color="secondary" onClick={() => this.onToggleConnect(p.uid)} startIcon={<AddIcon />}>Connect</Button>
                </Grid>
              ))
              }
            </Block>
          }

          {pages && pages.length > 0 &&
            <Block>
              <Button variant="contained" color="primary" className="add-pg-btn add-pg-all-btn" onClick={this.handleConnectAll}>Connect All</Button>
            </Block>
          }
          {/*<Block className="add-pg-footer">
            <Button className="add-pg-btn" onClick={() => this.props.close()}>Close</Button>
        </Block>*/}
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => ({
  allPages: state.default.pages.allPages,
  error: state.default.pages.error,
  loading: state.default.pages.loading
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAllPages,
      toggleConnect,
      connectAll
    },
    dispatch
  )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddNewPageModal));
