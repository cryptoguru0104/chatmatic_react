import React from 'react';
import ReactDOM from 'react-dom';
import { InlineEdit } from 'components';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import classnames from 'classnames';

import { Popover } from 'components';
import OptionActionModal from '../../components/OptionActionModal';

import './styles.css';

class EditableMenu extends React.Component {
  constructor(props) {
    super(props);

    this.currentEmojiInputPos = null;

    this.state = {
      editing: false,
      showEmojiBox: false,
      editToolbarMouseOver: false,
      optionTarget: null,
      hoverOnComponent: false,
      hoverOnOption: false
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this._globalMouseClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._globalMouseClick);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.editing !== nextProps.editing) {
      this.setState({ editing: nextProps.editing });
    }
  }

  _globalMouseClick = event => {
    try {
      let node = ReactDOM.findDOMNode(this.emojiPicker);
      if (!node.contains(event.target)) {
        if (!this.state.optionTarget) {
          this.setState({ editing: false });
        }
        if (!this.state.editToolbarMouseOver && this.state.showEmojiBox) {
          setTimeout(() => this.setState({ showEmojiBox: false }), 200);
        }

        if (this.state.hoverOnComponent) {
          this.props.changeActiveOption();
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
      this.props.updateOption({
        name: [
          this.props.option.name.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.props.option.name.slice(this.currentEmojiInputPos)
        ].join('')
      });
    } else {
      let sym = event.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({ showEmojiBox: false });
      this.props.updateOption({
        name: [
          this.props.option.name.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.props.option.name.slice(this.currentEmojiInputPos)
        ].join('')
      });
    }
  };

  render() {
    return (
      <div
        className={classnames(
          'd-flex align-items-center position-relative menu-name-container',
          { first: this.props.firstOption }
        )}
        onMouseEnter={() => this.setState({ hoverOnComponent: true })}
        onMouseLeave={() => this.setState({ hoverOnComponent: false })}
      >
        <InlineEdit
          activeClassName="w-100 name-active"
          text={this.props.option.name}
          paramName="name"
          change={params => {
            if (params.name !== this.props.option.name) {
              this.props.updateOption({ name: params.name });
            }
            this.currentEmojiInputPos = params.currentPos;
          }}
          className="name"
          minLength={0}
          maxLength={30}
          placeholder="Add Text"
          onChangeEditing={editing => this.setState({ editing })}
          onChangeFocus={target => this.setState({ optionTarget: target })}
          toolbarMouseOver={
            this.state.editToolbarMouseOver ||
            this.state.showEmojiBox ||
            this.state.hoverOnOption
          }
          style={{ height: 20 }}
          editing={this.state.editing}
        />
        {this.state.editing && (
          <div
            className="d-flex align-items-center position-absolute toolbox-container"
            style={{ bottom: 10, right: 0, zIndex: 1 }}
            onMouseEnter={() => this.setState({ editToolbarMouseOver: true })}
            onMouseLeave={() => this.setState({ editToolbarMouseOver: false })}
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
                color: this.props.option.name.length === 30 ? 'red' : 'inherit',
                fontSize: 12
              }}
            >
              {this.props.option.name.length}
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

        {this.state.optionTarget && (
          <Popover
            isOpen={true}
            target={this.state.optionTarget}
            offset={75}
            toggle={() => this.setState({ optionTarget: null })}
            className="popover-container"
            placement="right"
          >
            <OptionActionModal
              actionType={this.props.option.type}
              actionValue={this.props.option.value}
              onChange={option => {
                this.props.updateOption(option);
                this.setState({ editing: false, optionTarget: null });
              }}
              onMouseEnter={() => this.setState({ hoverOnOption: true })}
              onMouseLeave={() => this.setState({ hoverOnOption: false })}
              deleteOption={this.props.deleteOption}
            />
          </Popover>
        )}
      </div>
    );
  }
}

EditableMenu.propTypes = {
  option: PropTypes.object.isRequired,
  firstOption: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  updateOption: PropTypes.func.isRequired,
  changeActiveOption: PropTypes.func.isRequired,
  deleteOption: PropTypes.func.isRequired
};

export default EditableMenu;
