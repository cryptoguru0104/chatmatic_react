import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'semantic-ui-react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Button } from '@material-ui/core';
import { Block, Svg } from '../../Home/Layout';
import { getPages } from 'services/pages/pagesActions';

import './PageSelector.scss';

class PageSelector extends React.Component {
  componentDidMount() {
    this.props.actions.getPages();
  }

  render() {
    const { open, closeModal, selectPage, source } = this.props;
    const pages = this.props.pages.filter(p => p.isConnected);

    return (
      <Dialog 
        maxWidth="xs"
        fullWidth={true}
        open={open} closeIcon onClose={closeModal}>
        <DialogContent className="page-selector-modal-container">

          <Grid container justify="space-between">
              <h2>
              Select a page to purchase for
              </h2>
              <Button onClick={closeModal} className="btn-close">
              <Svg name="modal-close" />
          </Button>
          </Grid>
          <hr />
          <Block className="pages-list">
          {pages &&
          pages.length > 0 &&
          pages.map(p => p.source != source ? null : (
              <Block
                  onClick={() => selectPage(p.uid)}
                  key={p.uid}
                  className="side-listing"
              >
                  <Block className="img-circle">
                      <img
                          src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                          alt="user"
                      />
                  </Block>
                  <Block className="list-text">
                      <h3>{p.fbName}</h3>
                      <Block className="list-bottom">
                          <Block className="username">
                              <Icon name="users" />{' '}
                              {p.subscribers}
                              <span>
                                  {' '}
                                  +
                                  {
                                      p.recentSubscribers
                                  }
                              </span>
                          </Block>
                          <Block className="calander">
                              <Icon name="calendar alternate" />{' '}
                              {p.sequences}{' '}
                              {/* <span>+17</span> */}
                          </Block>
                      </Block>
                  </Block>
              </Block>
          ))}
          </Block>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  pages: state.default.pages.pages
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPages
      // updateEngageInfo,
      // updateItemInfo,
      // addStepInfo,
      // updateStepInfo,
      // addEngage,
      // getTags,
      // getPageWorkflowTriggers
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(PageSelector);