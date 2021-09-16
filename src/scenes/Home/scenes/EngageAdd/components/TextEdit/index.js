import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    InlineEdit,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { getCustomFieldsState } from 'services/customfields/selector';
import { insertTextAtPos } from 'services/utils';
import _ from 'lodash';
import './styles.css';
const MESSAGE_LENGTH = 2000;
const defaultMergeTags = [
    { fieldName: 'First Name', mergeTag: '{fname}' },
    { fieldName: 'Last Name', mergeTag: '{lname}' },
    { fieldName: 'Email', mergeTag: '{email}' },
    { fieldName: 'Phone', mergeTag: '{phone}' }
];
const defaultEmailMergeTags = [
    { fieldName: 'Email', mergeTag: '{email}' },
];
class TextEdit extends React.Component {
    constructor(props) {
        super(props);

        this.currentEmojiInputPos = -1;
        this.MESSAGE_LENGTH = props.maxLength || MESSAGE_LENGTH

        this.state = {
            editing: this.props.editing || false,
            showEmojiBox: false,
            editToolbarMouseOver: false,
            mergeTags: props.type == 'EMAIL' ? defaultEmailMergeTags : defaultMergeTags.concat(
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
                mergeTags: nextProps.type == 'EMAIL' ? defaultEmailMergeTags : defaultMergeTags.concat(
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
                    !this.state.editToolbarMouseOver &&
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
        if (event.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${event.unified}`);
            const newTextMessage = insertTextAtPos(
                this.props.textMessage,
                emojiPic,
                this.currentEmojiInputPos
            );

            this.setState({ showEmojiBox: false });
            this.props.updateItemInfo({ textMessage: newTextMessage });
        } else {
            let sym = event.unified.split('-');
            let codesArray = [];

            sym.forEach(el => codesArray.push('0x' + el));

            let emojiPic = String.fromCodePoint(...codesArray);

            this.setState({ showEmojiBox: false });
            this.props.updateItemInfo({
                textMessage: insertTextAtPos(
                    this.props.textMessage,
                    emojiPic,
                    this.currentEmojiInputPos
                )
            });
        }
    };

    render() {
        const { isRestrictedForJSON, placeholder } = this.props;
        const { mergeTags } = this.state;
        const max_length = this.props.maxLength || MESSAGE_LENGTH;
        console.log('max_length: ', max_length);
        return (
            <div className="d-flex position-relative text-edit-container">
                <InlineEdit
                    activeClassName="w-100 text-message-active"
                    text={this.props.textMessage}
                    paramName="textMessage"
                    change={params => {
                        if (params.textMessage !== this.props.textMessage) {
                            this.props.updateItemInfo({
                                textMessage: params.textMessage
                            });
                        }
                        this.currentEmojiInputPos = params.currentPos;
                    }}
                    className="text-message"
                    placeholder={placeholder || 'Text Message'}
                    editingElement={'textarea'}
                    minLength={0}
                    maxLength={max_length}
                    onChangeEditing={editing => this.setState({ editing })}
                    toolbarMouseOver={
                        this.state.editToolbarMouseOver ||
                        this.state.showEmojiBox
                    }
                    editing={this.props.editing || this.state.editing}
                />
                {(this.props.editing || this.state.editing) && (
                    <div
                        className="d-flex align-items-center position-absolute"
                        style={{ bottom: 0, right: 18, zIndex: 1 }}
                        onMouseEnter={() =>
                            this.setState({ editToolbarMouseOver: true })
                        }
                        onMouseLeave={() =>
                            this.setState({ editToolbarMouseOver: false })
                        }
                    >
                        {this.props.type != 'EMAIL' && <button
                            className="btn btn-link p-0 m-0"
                            onClick={() =>
                                this.setState({
                                    showEmojiBox: !this.state.showEmojiBox
                                })
                            }
                        >
                            <i className="fa fa-smile-o" />
                        </button>}
                        {!isRestrictedForJSON && (
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
                                    {mergeTags.map((m, i) => (
                                        <DropdownItem key={i}>
                                            <div
                                                onClick={() =>
                                                    this.props.updateItemInfo({
                                                        textMessage: this.props.type == 'EMAIL' ? `${m.mergeTag}` : insertTextAtPos(
                                                            this.props
                                                                .textMessage,
                                                            ` ${m.mergeTag} `,
                                                            this
                                                                .currentEmojiInputPos
                                                        )
                                                    })
                                                }
                                            >
                                                {m.fieldName}
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                        <span
                            style={{
                                color:
                                    this.props.textMessage.length ===
                                    max_length
                                        ? 'red'
                                        : 'inherit',
                                fontSize: 12
                            }}
                        >
                            {this.props.textMessage.length}/{max_length}
                        </span>
                    </div>
                )}
                <Picker
                    style={{
                        display: this.state.showEmojiBox
                            ? 'inline-block'
                            : 'none',
                        position: 'absolute',
                        top: 70,
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

TextEdit.propTypes = {
    editing: PropTypes.bool,
    isRestrictedForJSON: PropTypes.bool.isRequired,
    mergeTags: PropTypes.arrayOf(
        PropTypes.shape({
            fieldName: PropTypes.string,
            mergeTag: PropTypes.string
        })
    ),
    placeholder: PropTypes.string,
    textMessage: PropTypes.string.isRequired,
    updateItemInfo: PropTypes.func.isRequired
};

TextEdit.defaultProps = {
    isRestrictedForJSON: false
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

export default connect(mapStateToProps, {})(TextEdit);
