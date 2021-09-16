import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';

import { Block } from '../../../../Layout';
import { Image } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';
import { getPage } from 'services/pages/pagesActions';

import Grid from '@material-ui/core/Grid';

import subscriberImg from 'assets/images/subscriber.png';
import iconLiveChat from 'assets/images/icon-live-chat.png';

class NewDetails extends Component {
  componentDidMount = () => {
    this.props.actions.getPage(this.props.match.params.id);
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.match.params.id != this.props.match.params.id) {
      this.props.actions.getPage(this.props.match.params.id);
    }
  }

  _handleLiveChat = subscriberId => () => {
    // console.log('subscriberId', subscriberId);
    this.props.history.push(`/page/${this.props.match.params.id}/subscribers?subscriberUid=${subscriberId}&openChat=1`)
  }

  render() {
    const { subscribers, workflows, automations } = this.props;
    return (
      <>
        <Grid item xs={12} sm={12} md={5} className="home-main-outer ">
          <Block className="custom-table homePtable">
            <h2 className="title-head mb-4"> Recent subscribers </h2>
            <table>
              <thead>
                <tr>
                  <th colSpan="2"> Subscribers Name </th>
                  <th> Action </th>
                </tr>
              </thead>
            </table>
            <Block className="home-tbl-scroll home-tbl-scroll3">
              <table>
                <tbody>
                  {subscribers && subscribers.map((s, i) => (
                    <tr key={i} >
                      <td>
                        <Block className="d-inline-align">
                          <LazyLoad height={35} width={51} offset={700}>
                            <Image
                              src={s.profilePicUrl || subscriberImg}
                              alt=""
                              className="mr-3 subscriber-photo"
                              circular
                            />
                          </LazyLoad>
                        </Block>
                        <Block className="d-inline-align">
                          {s.firstName} {s.lastName}
                        </Block>
                      </td>
                      <td className="text-center"> <Button variant="contained" color="primary" onClick={this._handleLiveChat(s.uid)} startIcon={<img src={iconLiveChat} style={{width: '14px', height: '14px'}} />}>Live Chat</Button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Block>
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={7} className="home-main-outer1 ">
          <Grid container spacing={2} className="h-100">
            <Grid item xs={12} sm={12} md={6} className="h-100">
              <Block className="custom-table homePtable homePcpadd">
                <h2 className="title-head mb-4"> Recent workflows </h2>
                <table>
                  <thead>
                    <tr>
                      <th> Workflow Name </th>
                      <th className="text-center"> Total Subscribers </th>
                    </tr>
                  </thead>
                </table>
                <Block className="home-tbl-scroll">
                  <table>
                    <tbody>
                      {workflows && workflows.map((w, index) => (
                        <tr key={index}>
                          <td> {w.name} </td>
                          <td className="text-center"> {w.totalSubscribers} </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Block>
              </Block>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className="h-100">
              <Block className="custom-table homePtable homePcpadd">
                <h2 className="title-head mb-4">Recent Automations</h2>
                <table>
                  <thead>
                    <tr>
                      <th> Automation Name </th>
                      <th className="text-center"> Total Subscribers </th>
                    </tr>
                  </thead>
                </table>
                <Block className="home-tbl-scroll">
                  <table>
                    <tbody>
                    {automations && automations.map((a, index) => (
                      <tr key={index}>
                        <td> {a.name} </td>
                        <td className="text-center"> {a.totalFired} </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </Block>
              </Block>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }
}

const mapStateToProps = state => ({
  subscribers: state.default.pages.subscribers,
  workflows: state.default.pages.workflows,
  automations: state.default.pages.automations
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPage
    },
    dispatch
  )
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewDetails)
);