import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import { Container, Grid } from '@material-ui/core';

/** import components */
import SubscriberList from './components/SubscriberList';
import ChatWidget from './components/ChatWidget';
import SummaryWidget from './components/SummaryWidget/SummaryWidget';

/** Import Actions */
import { getTags } from 'services/tags/actions';

/** Import Css */
import './styles.css';
import ChatLog from './components/ChatLog';
import LifetimeValue from './components/LifetimeValue';
import UserTags from './components/UserTags';
import SubscribedCampaigns from './components/SubscribedCampaigns';

class Subscribers extends React.Component {
  componentDidMount() {
    this.props.actions.getTags(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loadingTags) {
      Swal({
        title: 'Please wait...',
        text: 'Fetching a list of subscribers in this fan page...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loading || this.props.loadingTags) {
      Swal.close();

      if (nextProps.error) {
        toastr.error(nextProps.error);
      }

      if (nextProps.errorTags) {
        toastr.error(nextProps.errorTags);
      }
    }
  }

  render() {
    return (
      <Container maxWidth={false} className="subscribers-wrapper">
        <Grid container justify="flex-start" alignItems="stretch" className="subscribers-container" spacing={1}>
          <Grid item xs={12} sm={6} md={6} lg={3} data-aos="fade" data-aos-delay="200" style={{paddingBottom: '20px'}}>
            <SubscriberList />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={9}>
            <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={1} className="subscribers-right-panel-wrapper">
              <Grid item style={{flex: 1}}>
                <Grid container justify="flex-start" alignItems="stretch" spacing={1} style={{height: '100%'}}>
                  <Grid item xs={12} lg={4} className="d-flex">
                    {!!this.props.activeSubscriberId && <SummaryWidget data-aos="fade" data-aos-delay="200"/>}
                  </Grid>
                  <Grid item xs={12} lg={8} className="d-flex">
                      {!!this.props.activeSubscriberId && <ChatWidget data-aos="fade" data-aos-delay="200"/>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item style={{flex: 1}}>
                <Grid container justify="flex-start" alignItems="stretch" spacing={1} style={{height: '100%'}}>
                  <Grid item xs={12} lg={4} className="d-flex">
                    <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={1}>
                      <Grid item style={{flex: 1}}>
                        {!!this.props.activeSubscriberId && <LifetimeValue data-aos="fade" data-aos-delay="200"/>}
                      </Grid>
                      <Grid item style={{flex: 1}}>
                        {!!this.props.activeSubscriberId && <ChatLog data-aos="fade" data-aos-delay="200"/>}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={4} className="d-flex">
                      {!!this.props.activeSubscriberId && <UserTags data-aos="fade" data-aos-delay="200"/>}
                  </Grid>
                  <Grid item xs={12} lg={4} className="d-flex">
                      {!!this.props.activeSubscriberId && <SubscribedCampaigns data-aos="fade" data-aos-delay="200"/>}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Subscribers.propTypes = {
  error: PropTypes.string,
  loadingTags: PropTypes.bool.isRequired,
  errorTags: PropTypes.string,
  activeSubscriberId: PropTypes.number,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  error: state.default.subscribers.error,
  loadingTags: state.default.settings.tags.loading,
  errorTags: state.default.settings.tags.error,
  activeSubscriberId: state.default.subscribers.activeSubscriberId
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getTags
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscribers);
