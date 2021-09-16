import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class InlineEdit extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    paramName: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    validate: PropTypes.func,
    style: PropTypes.object,
    editingElement: PropTypes.string,
    staticElement: PropTypes.string,
    tabIndex: PropTypes.number,
    isDisabled: PropTypes.bool,
    editing: PropTypes.bool,
    toolbarMouseOver: PropTypes.bool,
    onChangeEditing: PropTypes.func,
    onChangeFocus: PropTypes.func
  };

  static defaultProps = {
    minLength: 1,
    maxLength: 256,
    editingElement: 'input',
    staticElement: 'span',
    tabIndex: 0,
    isDisabled: false,
    editing: false,
    toolbarMouseOver: false
  };

  componentWillMount() {
    this.isInputValid = this.props.validate || this.isInputValid;
  }

  componentDidMount() {
    if (this.refs.span) {
      this.refs.span.innerHTML = this.refs.span.innerHTML.replace(
        /(?:\r\n|\r|\n)/g,
        '<br />'
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.onChangeFocus && !nextProps.editing && this.props.editing) {
      this.props.onChangeFocus(null);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.editing) {
      ReactDOM.findDOMNode(this.refs.input).focus();

      if (
        this.props.onChangeFocus &&
        !prevProps.editing &&
        this.props.editing
      ) {
        this.props.onChangeFocus(this.refs.input);
      }
    } else if (this.refs.span) {
      this.refs.span.innerHTML = this.refs.span.innerHTML.replace(
        /(?:\r\n|\r|\n)/g,
        '<br />'
      );
    }
    if (prevProps.text !== this.props.text && !!this.refs.input) {
      const activeInput = ReactDOM.findDOMNode(this.refs.input);
      let newProp = {};

      newProp[this.props.paramName] = activeInput.value;
      newProp['currentPos'] = activeInput.selectionStart;
      this.props.change(newProp);
    }
  }

  startEditing = e => {
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }
    this.props.onChangeEditing(true);
  };

  clickWhenEditing = e => {
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    let newProp = {};
    newProp[this.props.paramName] = e.target.value;
    newProp['currentPos'] = e.target.selectionStart;
    this.props.change(newProp);
  };

  isInputValid = text => {
    return (
      text.length >= this.props.minLength && text.length <= this.props.maxLength
    );
  };

  keyDown = event => {
    if (event.keyCode === 27) {
      this.props.onChangeEditing(false);
    } else if (event.keyCode === 13 && !event.shiftKey) {
      this.props.onChangeEditing(false);
    }
  };

  textChanged = event => {
    if (this.isInputValid(event.target.value)) {
      let newProp = {};
      newProp[this.props.paramName] = event.target.value;
      newProp['currentPos'] = event.target.selectionStart;
      this.props.change(newProp);

      let textarea = ReactDOM.findDOMNode(this.refs.input);
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  blur = () => {
    if (!this.props.toolbarMouseOver) {
      this.props.onChangeEditing(false);
    }
  };

  render() {
    if (this.props.isDisabled) {
      const Element = this.props.element || this.props.staticElement;
      return (
        <Element className={this.props.className} style={this.props.style}>
          {this.props.text || this.props.placeholder}
        </Element>
      );
    } else if (!this.props.editing) {
      const Element = this.props.element || this.props.staticElement;
      return (
        <Element
          className={classnames(this.props.className, {
            'placeholder-color': !this.props.text
          })}
          onClick={this.startEditing}
          tabIndex={this.props.tabIndex}
          style={this.props.style}
          ref="span"
        >
          {this.props.text || this.props.placeholder}
        </Element>
      );
    } else {
      const Element = this.props.element || this.props.editingElement;
      return (
        <Element
          onClick={this.clickWhenEditing}
          onKeyDown={this.keyDown}
          onBlur={this.blur}
          className={this.props.activeClassName}
          placeholder={this.props.placeholder}
          value={this.props.text}
          onKeyUp={this.textChanged}
          onChange={this.textChanged}
          style={this.props.style}
          ref="input"
        />
      );
    }
  }
}
