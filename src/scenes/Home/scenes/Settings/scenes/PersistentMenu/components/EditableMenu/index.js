import React from 'react';
import ReactDOM from 'react-dom';
import { InlineEdit } from 'components';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import classnames from 'classnames';

import { Popover } from 'components';
import ActionModal from '../../components/ActionModal';
import NotLicensedModal from '../NotLicensedModal';
import './styles.css';

class EditableMenu extends React.Component {
  constructor(props) {
    super(props);

    this.currentEmojiInputPos = null;

    this.state = {
      editing: false,
      showEmojiBox: false,
      editToolbarMouseOver: false,
      actionModalTarget: null,
      hoverOnComponent: false,
      hoverOnActionModal: false
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this._globalMouseClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._globalMouseClick);
  }

  _globalMouseClick = event => {
    try {
      let node = ReactDOM.findDOMNode(this.emojiPicker);
      if (!node.contains(event.target)) {
        if (!this.state.actionModalTarget) {
          this.setState({ editing: false });
        }

        if (!this.state.editToolbarMouseOver && this.state.showEmojiBox) {
          setTimeout(() => this.setState({ showEmojiBox: false }), 200);
        }

        if (this.state.hoverOnComponent) {
          this.props.changeActiveMenu();
        }
      }
    } catch (error) {
      return null;
    }
  };

  _addEmoji = event => {
    if (event.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${event.unified}`);

      this.setState({ showEmojiBox: false });
      this.props.updateMenuName(
        [
          this.props.name.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.props.name.slice(this.currentEmojiInputPos)
        ].join('')
      );
    } else {
      let sym = event.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({ showEmojiBox: false });
      this.props.updateMenuName(
        [
          this.props.name.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.props.name.slice(this.currentEmojiInputPos)
        ].join('')
      );
    }
  };

  render() {
    const { isEditable, needsLicense } = this.props;

    return (
      <div
        className={classnames(
          'd-flex align-items-center position-relative menu-name-container',
          { first: this.props.firstMenu }
        )}
        onMouseEnter={() => this.setState({ hoverOnComponent: true })}
        onMouseLeave={() => this.setState({ hoverOnComponent: false })}
      >
        {isEditable ? (
          <InlineEdit
            activeClassName="w-100 name-active"
            text={this.props.name}
            paramName="name"
            change={params => {
              if (params.name !== this.props.name) {
                this.props.updateMenuName(params.name);
              }
              this.currentEmojiInputPos = params.currentPos;
            }}
            className="name"
            minLength={0}
            maxLength={30}
            placeholder="Add Text"
            onChangeEditing={editing => this.setState({ editing })}
            onChangeFocus={target =>
              this.setState({ actionModalTarget: target })
            }
            toolbarMouseOver={
              this.state.editToolbarMouseOver ||
              this.state.showEmojiBox ||
              this.state.hoverOnActionModal
            }
            style={{ height: 20 }}
            editing={this.state.editing}
          />
        ) : (
          <div
            className={classnames(
              'name',
              this.state.actionModalTarget && 'w-100 name-active'
            )}
            disabled
            onClick={e => {
              this.setState({ actionModalTarget: e.target });
            }}
            style={{ height: 20 }}
          >
            {this.props.name}
          </div>
        )}
        {isEditable &&
          this.state.editing && (
            <div
              className="d-flex align-items-center position-absolute toolbox-container"
              style={{ bottom: 10, right: 0, zIndex: 1 }}
              onMouseEnter={() => this.setState({ editToolbarMouseOver: true })}
              onMouseLeave={() =>
                this.setState({ editToolbarMouseOver: false })
              }
            >
              <button
                className="btn btn-link p-0 m-0"
                onClick={() =>
                  this.setState({ showEmojiBox: !this.state.showEmojiBox })
                }
              >
                <i className="fa fa-smile-o" />
              </button>
              <span
                style={{
                  color: this.props.name.length === 30 ? 'red' : 'inherit',
                  fontSize: 12
                }}
              >
                {this.props.name.length}
                /30
              </span>
            </div>
          )}
        <Picker
          style={{
            display: this.state.showEmojiBox ? 'inline-block' : 'none',
            position: 'absolute',
            top: 40,
            right: -100,
            zIndex: 1
          }}
          ref={ref => (this.emojiPicker = ref)}
          onSelect={this._addEmoji}
          showSkinTones={false}
          showPreview={false}
        />

        {this.state.actionModalTarget && (
          <Popover
            isOpen={true}
            target={this.state.actionModalTarget}
            offset={5}
            toggle={() => this.setState({ actionModalTarget: null })}
            className="popover-container"
          >
            {!isEditable && needsLicense ? (
              <NotLicensedModal
                onMouseEnter={() => this.setState({ hoverOnActionModal: true })}
                onMouseLeave={() =>
                  this.setState({ hoverOnActionModal: false })
                }
                pageId={this.props.pageId}
              />
            ) : (
              <ActionModal
                menuId={this.props.menuId}
                pageId={this.props.pageId}
                actionType={this.props.actionType}
                changeActionType={actionType => {
                  this.props.changeActionType(actionType);
                  this.setState({ editing: false, actionModalTarget: null });
                }}
                onMouseEnter={() => this.setState({ hoverOnActionModal: true })}
                onMouseLeave={() =>
                  this.setState({ hoverOnActionModal: false })
                }
              />
            )}
          </Popover>
        )}
      </div>
    );
  }
}

EditableMenu.propTypes = {
  menuId: PropTypes.number,
  pageId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
  firstMenu: PropTypes.bool.isRequired,
  updateMenuName: PropTypes.func.isRequired,
  changeActionType: PropTypes.func.isRequired,
  changeActiveMenu: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  needsLicense: PropTypes.bool.isRequired
};

export default EditableMenu;
