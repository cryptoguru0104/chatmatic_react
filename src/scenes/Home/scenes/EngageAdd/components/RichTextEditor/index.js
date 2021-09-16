import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import MUIRichTextEditor from 'mui-rte'
import _ from 'lodash';
import { convertToRaw, EditorState, Modifier } from 'draft-js'

import { getCustomFieldsState } from 'services/customfields/selector';
import './styles.scss';

const MESSAGE_LENGTH = 2000;
const defaultMergeTags = [
    { fieldName: 'First Name', mergeTag: '{fname}' },
    { fieldName: 'Last Name', mergeTag: '{lname}' },
    { fieldName: 'Email', mergeTag: '{email}' },
    { fieldName: 'Phone', mergeTag: '{phone}' }
];
class RichTextEditor extends React.Component {
    constructor(props) {
      super(props);

      this.currentEmojiInputPos = -1;

      this.state = {
        rteEditorState: null,
        showEmojiBox: false,
        mergeTags: defaultMergeTags.concat(
          _(props.mergeTags)
            .sortBy(x => x.fieldName)
            .value()
        )
      };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this._globalMouseClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this._globalMouseClick);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const { mergeTags } = this.props;
      if (mergeTags !== nextProps.mergeTags) {
        this.setState({
          mergeTags: defaultMergeTags.concat(
            _(nextProps.mergeTags)
              .sortBy(x => x.fieldName)
              .value()
          )
        });
      }
    }

    _globalMouseClick = event => {
      try {
        let node = ReactDOM.findDOMNode(this.emojiPicker);
        if (!node.contains(event.target)) {
          if (
            event.target.className != "fa fa-smile-o" &&
            this.state.showEmojiBox
          ) {
            setTimeout(
              () => this.setState({ showEmojiBox: false }),
              200
            );
          }
        }
      } catch (error) {
        return null;
      }
    };

    _addEmoji = event => {
      let newText = null;
      if (event.unified.length <= 5) {
        newText = String.fromCodePoint(`0x${event.unified}`);
      } else {
        let sym = event.unified.split('-');
        let codesArray = [];
        sym.forEach(el => codesArray.push('0x' + el));

        newText = String.fromCodePoint(...codesArray);
      }
      if(newText != null) {
        this.insertTextToEditor(newText);
      }
      this.setState({ showEmojiBox: false });
    };

    _addMergeTag = m => {
      this.insertTextToEditor(` ${m.mergeTag} `);
    };

    insertTextToEditor = (text) => {

      const { rteEditorState } = this.state;
      const { updateItemInfo } = this.props;
      if(rteEditorState !=  null) {
        let contentState = rteEditorState.getCurrentContent();
        let targetRange = rteEditorState.getSelection();
        let newContentState = Modifier.insertText(
          contentState,
          targetRange,
          text
        );
        
        let editorState = EditorState.push(
          rteEditorState,
          newContentState,"insert-characters"
        );

        let newStr=  JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        updateItemInfo(newStr);
      }

    };

    render() {
        const { mergeTags } = this.state;
        const { textMessage, updateItemInfo, getRef } = this.props;

        const max_length = this.props.maxLength || MESSAGE_LENGTH;
        return (<div className="mui-rich-texteditor-container">
        <MUIRichTextEditor defaultValue={ textMessage || "" } 
          ref={(ref) => {
            this.refEditorBody = ref;
            if(getRef) getRef(ref);
          }}
          toolbarButtonSize="small"
          controls={["bold", "italic", "strikethrough", "underline", "title", "link", "numberList", "bulletList", "quote", "emoji", "merge_tags", "code"]}
          customControls={[
            {
              name: "emoji",
              icon: <i className="fa fa-smile-o" />,
              type: 'callback',
              inlineStyle: { backgroundColor: "transparent", color: "black" },
              onClick: (state) => this.setState({rteEditorState: state, showEmojiBox: true})
            },
            {
              name: "merge_tags",
              icon: <UncontrolledDropdown>
              <DropdownToggle className="d-flex justify-content-between align-items-center p-0 flex-grow-1" 
                style={{
                  border: 0,
                  transform: 'none'}}>
                <i className="fa fa-user-o" />
              </DropdownToggle>
              <DropdownMenu right className="merge-tags-dropdown">
                {mergeTags.map((m, i) => (
                    <DropdownItem key={i} onClick={() => this._addMergeTag(m)}>{m.fieldName}</DropdownItem>
                ))}
              </DropdownMenu></UncontrolledDropdown>,
              type: 'callback',
              inlineStyle: { backgroundColor: "transparent", color: "black" },
              onClick: (state) => this.setState({rteEditorState: state})
            }
          ]}
          onSave={(data) => updateItemInfo(data) }
          onBlur={() => this.refEditorBody.save() } />

          <Picker
            className="emoji-picker"
            style={{
                display: this.state.showEmojiBox
                    ? 'inline-block'
                    : 'none',
            }}
            ref={ref => (this.emojiPicker = ref)}
            onSelect={this._addEmoji}
            showSkinTones={false}
            showPreview={false}
          />
        </div>);
    }
}

RichTextEditor.propTypes = {
  mergeTags: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string,
      mergeTag: PropTypes.string
    })
  ),
  textMessage: PropTypes.string.isRequired,
  updateItemInfo: PropTypes.func.isRequired,
  getRef: PropTypes.func
};

RichTextEditor.defaultProps = {
  
};

const mapStateToProps = state => ({
  mergeTags:
    (getCustomFieldsState(state).customFields &&
      getCustomFieldsState(state).customFields.map(x => ({
        fieldName: x.fieldName,
        mergeTag: x.mergeTag
      }))) ||
    []
});

export default connect(mapStateToProps, {})(RichTextEditor);
