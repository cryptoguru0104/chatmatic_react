import React from 'react';
import ReactDOM from 'react-dom';
import {
  InlineEdit,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';

import { insertTextAtPos } from 'services/utils';

import './styles.css';

export default class Headline extends React.Component {
  constructor(props) {
    super(props);

    this.currentEmojiInputPos = -1;

    this.state = {
      editing: false,
      showEmojiBox: false,
      editToolbarMouseOver: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this._globalMouseClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._globalMouseClick);
  }

  _globalMouseClick = event => {
    try {
      let node = ReactDOM.findDOMNode(this.emojiPicker);
      if (!node.contains(event.target)) {
        if (!this.state.editToolbarMouseOver && this.state.showEmojiBox) {
          setTimeout(() => this.setState({ showEmojiBox: false }), 200);
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
      this.props.updateItemInfo({
        headline: insertTextAtPos(
          this.props.headline,
          emojiPic,
          this.currentEmojiInputPos
        )
      });
    } else {
      let sym = event.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({ showEmojiBox: false });
      this.props.updateItemInfo({
        headline: insertTextAtPos(
          this.props.headline,
          emojiPic,
          this.currentEmojiInputPos
        )
      });
    }
  };

  render() {
    return (
      <div className="d-flex position-relative headline-container">
        <InlineEdit
          activeClassName="w-100 headline-active"
          text={this.props.headline}
          paramName="headline"
          change={params => {
            if (params.headline !== this.props.headline) {
              this.props.updateItemInfo({ headline: params.headline });
            }
            this.currentEmojiInputPos = params.currentPos;
          }}
          className="headline"
          placeholder="Headline Preview"
          minLength={0}
          maxLength={45}
          onChangeEditing={editing => this.setState({ editing })}
          toolbarMouseOver={
            this.state.editToolbarMouseOver || this.state.showEmojiBox
          }
          editing={this.state.editing}
        />
        {this.state.editing && (
          <div
            className="d-flex align-items-center position-absolute"
            style={{ bottom: 7, right: 4, zIndex: 1 }}
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
            <UncontrolledDropdown>
              <DropdownToggle
                className="d-flex justify-content-between align-items-center p-0 flex-grow-1"
                style={{
                  boxShadow: 'none',
                  paddingLeft: 12,
                  border: 'none',
                  background: 'transparent',
                  margin: '0 5px',
                  color: '#525f7f'
                }}
              >
                <i className="fa fa-user-o" />
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
                <DropdownItem key={'fname'}>
                  <div
                    onClick={() =>
                      this.props.updateItemInfo({
                        headline: insertTextAtPos(
                          this.props.headline,
                          ' {fname} ',
                          this.currentEmojiInputPos
                        )
                      })
                    }
                  >
                    First Name
                  </div>
                </DropdownItem>
                <DropdownItem key={'lname'}>
                  <div
                    onClick={() =>
                      this.props.updateItemInfo({
                        headline: insertTextAtPos(
                          this.props.headline,
                          ' {lname} ',
                          this.currentEmojiInputPos
                        )
                      })
                    }
                  >
                    Last Name
                  </div>
                </DropdownItem>
                <DropdownItem key={'email'}>
                  <div
                    onClick={() =>
                      this.props.updateItemInfo({
                        headline: insertTextAtPos(
                          this.props.headline,
                          ' {email} ',
                          this.currentEmojiInputPos
                        )
                      })
                    }
                  >
                    Email
                  </div>
                </DropdownItem>
                <DropdownItem key={'phone'}>
                  <div
                    onClick={() =>
                      this.props.updateItemInfo({
                        headline: insertTextAtPos(
                          this.props.headline,
                          ' {phone} ',
                          this.currentEmojiInputPos
                        )
                      })
                    }
                  >
                    Phone
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <span
              style={{
                color: this.props.headline.length === 45 ? 'red' : 'inherit',
                fontSize: 12
              }}
            >
              {this.props.headline.length}
              /45
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
      </div>
    );
  }
}

Headline.propTypes = {
  headline: PropTypes.string.isRequired,
  updateItemInfo: PropTypes.func.isRequired
};
