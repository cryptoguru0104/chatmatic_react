import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'components';
import { addTag } from 'services/tags/actions';
import { getTagsState } from 'services/tags/selector';

class NewTagModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newAddErrorMessage: ''
    };
  }

  _addTag = () => {
    const { actions, pageId, pageTags } = this.props;
    if (!this.refs.newTag.value) {
      return;
    }
    if (
      pageTags.some(
        x => x.value.toLowerCase() == this.refs.newTag.value.toLowerCase()
      )
    ) {
      this.setState({
        newAddErrorMessage: 'Tag with the same name already exists'
      });
      return;
    }
    this.setState({ newAddErrorMessage: '' });
    actions.addTag(pageId, this.refs.newTag.value);
  };

  render() {
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add New Tag</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="newTag"
              ref="newTag"
              placeholder="Enter tag name"
            />
          </div>
          {this.state.newAddErrorMessage && (
            <div className="alert alert-danger">
              {this.state.newAddErrorMessage}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="rounded mb-2 w-100"
            color="primary"
            onClick={this._addTag}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

NewTagModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  pageId: PropTypes.string.isRequired,
  pageTags: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pageTags: getTagsState(state).tags
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addTag
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTagModal);
