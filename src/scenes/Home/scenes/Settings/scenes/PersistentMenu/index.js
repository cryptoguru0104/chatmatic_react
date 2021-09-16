import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import classnames from 'classnames';
import { Button } from '@material-ui/core';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import {
  getPersistentMenuState,
  getActivePersistentMenu
} from './services/selector';
import { getActiveWorkflows } from 'services/workflows/selector';
import {
  getPersistentMenus,
  addPersistentMenu,
  deletePersistentMenu,
  savePersistentMenu,
  updatePersistentMenu,
  updateActiveMenuAndOption
} from './services/actions';
import { updateEngageInfo } from '../../../EngageAdd/services/actions';
import { toggleMenus } from 'services/pages/pagesActions';
import { getPageFromUrl } from 'services/pages/selector';

import EditableMenu from './components/EditableMenu';
import EditableOption from './components/EditableOption';
import Preview from './components/Preview';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import './styles.css';

class PersistentMenu extends React.Component {
  componentWillMount() {
    this.props.actions.getPersistentMenus(this.props.match.params.id);
  }

  _addMenuItem = () => {
    if (this.props.currentMenu) {
      Swal('You can not add a new menu item without saving current item.');
    } else {
      this.props.actions.addPersistentMenu();
    }
  };

  _isValidOptionValue = () => {
    const { type, value } = this.props.activePersistentMenu;
    if (type === 'submenu') {
      if (!Array.isArray(value) || !value.length) return false;

      for (let index = 0; index < value.length; index++) {
        const option = value[index];

        if (!option.name || !option.type || !option.value) return false;
      }
    }

    return true;
  };

  _saveMenu = () => {
    const { value, name } = this.props.activePersistentMenu;

    if (!name || !value || !this._isValidOptionValue()) {
      Swal('Please fill in all the fields.');
    } else {
      this.props.actions.savePersistentMenu(this.props.match.params.id);
    }
  };

  _clearActionType = () => {
    this.props.actions.updatePersistentMenu({
      type: '',
      value: null
    });
  };

  _saveOptionChange = option => {
    const options = this.props.activePersistentMenu.value.map((item, index) => {
      if (index !== this.props.activeOptionIndex) return item;
      return {
        ...item,
        ...option
      };
    });

    this.props.actions.updatePersistentMenu({
      value: options
    });
  };

  _goToEngageBuilder = () => {
    this.props.actions.updateEngageInfo({
      workflowType: 'general',
      name: '',
      steps: [],
      activeStep: '',
      uid: null,
      broadcast: {}
    });

    this.props.history.push({
      pathname: `/page/${this.props.match.params.id}/workflows/add`,
      state: {
        redirectTo: this.props.location.pathname,
        currentMenu: this.props.currentMenu,
        activeOptionIndex: this.props.activeOptionIndex
      }
    });
  };

  render() {
    const { pageInfo } = this.props;

    if (this.props.loading || this.props.adminsLoading) {
      Swal({
        title: 'Please wait...',
        text: 'We are fetching settings data...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.persistentMenus.isProcessing) {
      Swal({
        title: 'Please wait...',
        text: 'We are saving current persistent menu...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    const menuItems = this.props.currentMenu
      ? this.props.persistentMenus.menus.concat([this.props.currentMenu])
      : this.props.persistentMenus.menus;

    const _renderMenuItems = () => {
      return menuItems.map((menu, index) => {
        return (
          <EditableMenu
            key={index}
            menuId={menu.uid}
            pageId={this.props.match.params.id}
            name={menu.name}
            actionType={menu.type}
            firstMenu={index === 0}
            isEditable={!menu.branded}
            needsLicense={!pageInfo.licensed}
            updateMenuName={menuName =>
              this.props.actions.updatePersistentMenu({ name: menuName })
            }
            changeActionType={actionType =>
              this.props.actions.updatePersistentMenu({
                type: actionType,
                value: actionType === 'submenu' ? [] : null
              })
            }
            changeActiveMenu={() =>
              this.props.actions.updateActiveMenuAndOption({
                activeMenuId: menu.branded ? null : menu.uid,
                activeOptionIndex: null
              })
            }
          />
        );
      });
    };

    const _renderSubMenuItems = () => {
      return (
        Array.isArray(this.props.activePersistentMenu.value) &&
        this.props.activePersistentMenu.value.map((option, index) => {
          return (
            <EditableOption
              key={index}
              option={option}
              firstOption={index === 0}
              editing={this.props.activeOptionIndex === index}
              updateOption={this._saveOptionChange}
              changeActiveOption={() =>
                this.props.activeOptionIndex !== index &&
                this.props.actions.updateActiveMenuAndOption({
                  activeOptionIndex: index
                })
              }
              deleteOption={() =>
                this.props.actions.updatePersistentMenu({
                  value: this.props.activePersistentMenu.value.filter(
                    (option, index) => index !== this.props.activeOptionIndex
                  )
                })
              }
            />
          );
        })
      );
    };

    const _renderMenuContent = () => {
      if (this.props.activePersistentMenu) {
        switch (this.props.activePersistentMenu.type) {
          case 'link':
            return (
              <div className="d-flex flex-column menu-link-container">
                <div className="d-flex justify-content-between input-title-container">
                  <p>Add A Link</p>
                  <button
                    className="btn btn-link btn-delete"
                    onClick={this._clearActionType}
                  >
                    <i className="fa fa-trash" />
                    Delete Item
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control link-input"
                  value={this.props.activePersistentMenu.value || ''}
                  onChange={event =>
                    this.props.actions.updatePersistentMenu({
                      value: event.target.value
                    })
                  }
                />
              </div>
            );
          case 'message':
            const activeMessage =
              this.props.workflows.find(
                workflow =>
                  workflow.uid ===
                  parseInt(this.props.activePersistentMenu.value, 10)
              ) || {};

            return (
              <div className="d-flex flex-column menu-message-container">
                <div className="d-flex justify-content-between input-title-container">
                  <p>Send Message</p>
                  {this.props.activePersistentMenu.value && (
                    <button
                      className="btn btn-link btn-delete"
                      onClick={this._clearActionType}
                    >
                      <i className="fa fa-trash" />
                      Delete Item
                    </button>
                    )}
                </div>
                {!this.props.activePersistentMenu.value && (
                  <button
                    className="btn btn-link btn-create-new"
                    onClick={this._goToEngageBuilder}
                  >
                    Create New
                  </button>
                )}
                <div className="d-flex flex-column select-existing-message-container">
                  <div
                    className={classnames('d-flex input-title-container', {
                      'justify-content-end': !!this.props.activePersistentMenu
                        .value,
                      'justify-content-between': !this.props
                        .activePersistentMenu.value
                    })}
                  >
                    {!this.props.activePersistentMenu.value && (
                      <label>Choose Existing</label>
                    )}
                  </div>
                  <UncontrolledDropdown style={{ display: 'flex' }}>
                    <DropdownToggle
                      className="d-flex justify-content-between align-items-center m-0 flex-grow-1"
                      caret
                    >
                      <span>{activeMessage.name || 'Select'}</span>
                    </DropdownToggle>

                    <DropdownMenu
                      style={{
                        width: '100%',
                        marginLeft: -5,
                        marginTop: 0,
                        padding: 0,
                        boxShadow: 'none',
                        border: '1px solid #ebebeb'
                      }}
                      right
                    >
                      {this.props.workflows.map((workflow, index) => (
                        <DropdownItem key={index}>
                          <div
                            onClick={() =>
                              this.props.actions.updatePersistentMenu({
                                value: workflow.uid
                              })
                            }
                          >
                            {workflow.name}
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            );
          case 'submenu':
            return (
              <div className="d-flex flex-column menu-submenu-container">
                <p>Submenu</p>
                {_renderSubMenuItems()}
                {Array.isArray(this.props.activePersistentMenu.value) &&
                  this.props.activePersistentMenu.value.length < 5 && (
                    <button
                      className={classnames('btn btn-add-menu-item', {
                        'border-top': !this.props.activePersistentMenu.value
                          .length
                      })}
                      onClick={() =>
                        this.props.actions.updatePersistentMenu({
                          value: this.props.activePersistentMenu.value.concat([
                            { name: '', type: '', value: null }
                          ])
                        })
                      }
                    >
                      Add Option
                    </button>
                  )}
              </div>
            );
          default:
            return <div />;
        }
      }
    };

    return (
      <div className="d-flex persistent-menu-container">
        <div className="d-flex flex-column justify-content-between bg-white menu-creator-container">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center toggle-container">
              <span>Active</span>
              <Switch
                checked={this.props.pageInfo.menusActive || false}
                onChange={active =>
                  this.props.actions.toggleMenus(
                    this.props.match.params.id,
                    active
                  )
                }
                checkedIcon={false}
                uncheckedIcon={false}
                offColor="#fff"
                offHandleColor="#274bf0"
                width={41}
                height={24}
                handleDiameter={16}
                className="btn-toggle"
              />
            </div>
            <div className="d-flex flex-column menu-creator">
              <label>Add Menu Items</label>
              <div className="menu-items-container">
                {_renderMenuItems()}
                {menuItems.length < 3 && (
                  <Button
                    className={classnames('btn btn-add-menu-item', {
                      'border-top': !menuItems.length
                    })}
                    onClick={this._addMenuItem}
                    startIcon={<ControlPointIcon />}
                  >
                    Add Menu Item
                  </Button>
                )}
              </div>
                {_renderMenuContent()}
            </div>
          </div>
          <div className="d-flex justify-content-center w-100">
            <button
              className="btn btn-primary btn-save-menu"
              onClick={this._saveMenu}
            >
              Save
            </button>
          </div>
        </div>
        <Preview />
      </div>
    );
  }
}

PersistentMenu.propTypes = {
  persistentMenus: PropTypes.shape({
    menus: PropTypes.array.isRequired
  }).isRequired,
  currentMenu: PropTypes.object,
  activeMenuId: PropTypes.any,
  activeOptionIndex: PropTypes.any,
  activePersistentMenu: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  actions: PropTypes.object.isRequired,
  adminsLoading: PropTypes.bool.isRequired,
  pageInfo: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  ...getPersistentMenuState(state),
  workflows: getActiveWorkflows(state),
  adminsLoading: state.default.settings.admins.loading,
  activePersistentMenu: getActivePersistentMenu(state),
  pageInfo: getPageFromUrl(state, props)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPersistentMenus,
      addPersistentMenu,
      deletePersistentMenu,
      savePersistentMenu,
      updatePersistentMenu,
      updateActiveMenuAndOption,
      toggleMenus,
      updateEngageInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PersistentMenu)
);
