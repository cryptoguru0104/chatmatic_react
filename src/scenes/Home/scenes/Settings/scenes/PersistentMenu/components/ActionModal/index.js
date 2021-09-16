import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { deletePersistentMenu } from '../../services/actions';

import linkIcon from 'assets/images/settings/icon-link.png';
import activeLinkIcon from 'assets/images/settings/icon-active-link.png';
import messageIcon from 'assets/images/settings/icon-message.png';
import activeMessageIcon from 'assets/images/settings/icon-active-message.png';
import submenuIcon from 'assets/images/settings/icon-submenu.png';
import activeSubmenuIcon from 'assets/images/settings/icon-active-submenu.png';
import './styles.css';

const actions = [
  {
    value: 'link',
    label: 'LINK',
    icon: {
      active: activeLinkIcon,
      default: linkIcon
    }
  },
  {
    value: 'message',
    label: 'MESSAGE',
    icon: {
      active: activeMessageIcon,
      default: messageIcon
    }
  },
  {
    value: 'submenu',
    label: 'SUBMENU',
    icon: {
      active: activeSubmenuIcon,
      default: submenuIcon
    }
  }
];

class ActionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionType: this.props.actionType
    };
  }

  _deleteMenu = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete the menu',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this menu',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.deletePersistentMenu(this.props.pageId, this.props.menuId);
      }
    });
  };

  _changeActionType = () => {
    if (this.props.actionType !== this.state.actionType) {
      this.props.changeActionType(this.state.actionType);
    }
  };

  render() {
    const _renderActionButtons = () => {
      return actions.map((action, index) => (
        <button
          key={index}
          className={classnames('btn btn-link btn-action', {
            active: this.state.actionType === action.value
          })}
          onClick={() => this.setState({ actionType: action.value })}
        >
          <span>{action.label}</span>
          <img
            src={
              this.state.actionType === action.value
                ? action.icon['active']
                : action.icon['default']
            }
            alt=""
          />
        </button>
      ));
    };

    return (
      <div
        className="d-flex flex-column action-modal-container"
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div className="d-flex justify-content-between align-items-center action-modal-header">
          <span>Select a Action</span>
          <button
            className="btn btn-link p-0 btn-delete-item"
            onClick={this._deleteMenu}
          >
            <i className="fa fa-trash mr-3" />
            Delete Item
          </button>
        </div>
        {_renderActionButtons()}
        <button
          className="btn btn-primary btn-save"
          onClick={this._changeActionType}
        >
          Save Changes
        </button>
      </div>
    );
  }
}

ActionModal.propTypes = {
  menuId: PropTypes.number,
  pageId: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  deletePersistentMenu: PropTypes.func.isRequired,
  changeActionType: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  deletePersistentMenu: bindActionCreators(deletePersistentMenu, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(ActionModal);
