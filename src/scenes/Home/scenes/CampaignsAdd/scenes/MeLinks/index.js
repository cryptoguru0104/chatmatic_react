import React from 'react';

import ActionSubmit from './components/ActionSubmit';
import HowToUse from './components/HowToUse';

import './styles.css';

export default class MeLinks extends React.Component {
  state = {
    step: 'submit-action'
  };

  render() {
    return (
      <div className="d-flex flex-column p-4 me-links-container">
        {this.state.step === 'submit-action' ? (
          <ActionSubmit
            nextStep={() => this.setState({ step: 'how-to-use' })}
            pageId={this.props.match.params.id}
          />
        ) : (
          <HowToUse
            onBack={() => this.setState({ step: 'submit-action' })}
            pageId={this.props.match.params.id}
          />
        )}
      </div>
    );
  }
}
