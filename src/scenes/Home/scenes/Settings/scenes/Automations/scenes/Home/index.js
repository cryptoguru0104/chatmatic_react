import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { updateAutomation, getAutomations } from '../../services/actions';
import { getAutomationsState } from '../../services/selector';

import './styles.css';

class AutomationHome extends React.Component {
  componentDidMount() {
    this.props.actions.getAutomations(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Loading Automations...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loading) {
      Swal.close();

      if (nextProps.error) {
        toastr.error(nextProps.error);
      }
    }
  }

  render() {
    const renderAutomation = automation => (
      <div
        className="d-flex flex-column bg-white automation-container"
        key={automation.uid}
      >
        <div className="d-flex justify-content-between align-items-center automation-header">
          <div className="d-flex align-items-end">
            <span className="mr-2 header-title">{automation.name}</span>
            <button
              className="btn btn-link p-0"
              onClick={() => this.props.onEdit(automation)}
            >
              EDIT
            </button>
          </div>
          <Switch
            checked={automation.active}
            onChange={active =>
              this.props.actions.updateAutomation(
                this.props.match.params.id,
                automation.uid,
                {
                  active
                }
              )
            }
            checkedIcon={false}
            uncheckedIcon={false}
            offColor="#fff"
            onColor="#fff"
            offHandleColor="#b1b9cd"
            onHandleColor="#274bf0"
            width={41}
            height={24}
            handleDiameter={16}
          />
        </div>
        <div className="d-flex automation-item-container">
          <div className="d-flex flex-column justify-content-center align-items-center automation-field border-right">
            <small>LAST 24 HOURS</small>
            <p>{automation.withinDay || 0}</p>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center automation-field">
            <small>TOTAL NUMBER</small>
            <p>{automation.total || 0}</p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="d-flex flex-column bg-white automations-container">
        <div className="d-flex flex-wrap automations-list">
          {this.props.automations.map(automation =>
            renderAutomation(automation)
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center automations-footer">
          <button
            onClick={() => this.props.onEdit({})}
            className="btn btn-primary text-white font-weight-normal text-center btn-add-automation"
          >
            Add New Automation
          </button>
        </div>
      </div>
    );
  }
}

AutomationHome.propTypes = {
  onEdit: PropTypes.func.isRequired,
  automations: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.any.isRequired,
      pageUid: PropTypes.number,
      active: PropTypes.bool.isRequired,
      withinDay: PropTypes.number,
      total: PropTypes.number,
      name: PropTypes.string,
      tags: PropTypes.array,
      userUnsubscribe: PropTypes.bool,
      triggerIntegrations: PropTypes.array,
      notifyAdmins: PropTypes.array
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  automations: getAutomationsState(state).automations,
  loading: getAutomationsState(state).loading,
  error: getAutomationsState(state).error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateAutomation,
      getAutomations
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AutomationHome)
);
