import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Button } from '@material-ui/core';
import Swal from 'sweetalert2';

import { Svg, Block } from 'scenes/Home/Layout';
import { getAutomations } from '../../scenes/Settings/scenes/Automations/services/actions';
import { getAutomationsState } from '../../scenes/Settings/scenes/Automations/services/selector';
import './styles.scss';

class AutomationPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAutomation: null
    };
  }

  componentDidMount() {
    this.props.actions.getAutomations(this.props.match.params.id);
  }

  execute = () => {
    this.props.onClose();
  }

  render() {
    const { selectedAutomation } = this.state;
    const { automations, workflowTrigger } = this.props;
    
    if(!workflowTrigger) return (<></>);

    return (<Block className="trigger-automation-popup-container">
      <Block className="trigger-automation-popup-table-container">
        {automations.map((field, index) => (
          <Block key={index} className={"automation-item " + (field.uid == selectedAutomation ? 'selected' : '')} onClick={() => this.setState({
            selectedAutomation: field.uid
          })}>
            {field.name}
          </Block>
        ))}
      </Block>
      <Grid container justify="center" alignItems="stretch" className="trigger-automation-popup-header">
        <Button
          variant="outlined"
          startIcon={<Svg name="thunderbolt" />}
          disabled={true || selectedAutomation == null}
          onClick={() => this.execute()}
        >
          Coming Soon
        </Button>
      </Grid>
    </Block>);
  }
}

AutomationPopover.propTypes = {
  workflowTrigger: PropTypes.object.isRequired,
  subscribers: PropTypes.array,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  automations: getAutomationsState(state).automations,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          getAutomations
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AutomationPopover)
);
