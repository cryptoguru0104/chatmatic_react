import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutomationHome from './scenes/Home';
import AutomationEdit from './scenes/Edit';

class Automations extends Component {
  state = {
    scene: 'home',
    automation: {}
  };

  render() {
    return this.state.scene === 'home' ? (
      <AutomationHome
        onEdit={automation => this.setState({ scene: 'edit', automation })}
      />
    ) : (
      <AutomationEdit
        goBack={() => this.setState({ scene: 'home', automation: {} })}
        automation={this.state.automation}
      />
    );
  }
}

export default Automations;
