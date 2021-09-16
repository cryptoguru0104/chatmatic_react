import React, { Component } from 'react';
import { Grid, Dialog, DialogContent, DialogTitle, Button as MuiButton, IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Svg } from '../../Layout';

// import { pageFileUpload, updateEngage } from '../../scenes/EngageAdd/services/actions';
import { getAllPages, toggleConnect, connectAll } from 'services/pages/pagesActions';
// import { Block } from '../../Layout';
import Swal from 'sweetalert2';
import { Block } from '../../Layout';

import './SelectFbIgModal.scss';

class SelectFbIgModal extends Component {
  //#region lifecycle
  state = {
    pageType: null,
  }

  close = () => this.props.close();

  handleFacebookBtn = () => {
    this.setState({pageType: "fb"});
    this.props.selectPageType("fb");
    this.close();
  }

  handleInstagramBtn = () => {
    
    this.props.selectPageType("ig");
    this.close();
  }

  render() {
    const { open } = this.props;
    return (
      <Dialog
        // size="fullscreen"
        className="custom-popup select-page-dialog-container"
        open={open}
        onClose={() => false}
      >
        <DialogTitle>
          <Grid container direction="row" justify ="space-between" alignItems="center">
            <div className="select-page-dialog-title">
              <AddCircleOutlineIcon />
              Add New Page
            </div>
            <IconButton onClick={this.close}><CloseIcon /></IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent className="select-page-dialog-modal">
          <p>
            Connecting all pages costs you nothing. You only need to license a page when it reaches 500 subscribers so our suggestion is to connect ALL of your pages so they start collecting data. One day you may find that one of your pages has 500 subscribers and you'd like to license it, at which time you'll see that option below and on the page dashboard
          </p>
          <Block className="d-flex btn-container">
            <MuiButton variant="contained" className="facebook-btn text-capitalize" onClick={this.handleFacebookBtn}><Svg name="facebook" /><span className="font-size-2">Facebook Pages</span></MuiButton>
            <MuiButton variant="contained" className="instagram-btn text-capitalize" onClick={this.handleInstagramBtn}><Svg name="youtube" /><span className ="font-size-2">Instagram Pages</span></MuiButton>
          </Block>
        </DialogContent>
      </Dialog>
    );
  }
}

export default SelectFbIgModal;
