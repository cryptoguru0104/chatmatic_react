import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCampaignAdd } from '../../services/selector';

/** Import Components */
import Steps from './components/Steps';
import Preview from './components/Preview';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: this.props.campaignAdd.workflowUid
        ? 'submitAction'
        : 'presubmit'
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-8">
            <Steps
              onStepChange={currentStep => this.setState({ currentStep })}
              initialStep={this.state.currentStep}
            />
          </div>
          <div className="col-sm-4">
            <Preview currentStep={this.state.currentStep} />
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  campaignAdd: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  campaignAdd: getCampaignAdd(state)
});

export default connect(
  mapStateToProps,
  null
)(LandingPage);
