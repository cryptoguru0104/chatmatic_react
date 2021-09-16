import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'components';
import {
  addCustomField,
  updateCustomField
} from 'services/customfields/actions';
import { getCustomFieldsState } from 'services/customfields/selector';
import { userInputFormats } from 'scenes/Home/scenes/EngageAdd/components/UserInputSettings';

class NewCustomFieldModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldName: props.customField ? props.customField.fieldName : '',
      newAddErrorMessage: '',
      validationType: props.customField
        ? props.customField.validationType
        : 'text'
    };
  }

  _save = e => {
    e.preventDefault();
    const { actions, customField, customFields, pageId } = this.props;
    const { fieldName, validationType } = this.state;
    if (!fieldName) {
      return;
    }
    const isEdit = !!customField;

    if (
      !isEdit &&
      customFields.some(
        x => x.fieldName.toLowerCase() == fieldName.toLowerCase()
      )
    ) {
      this.setState({
        newAddErrorMessage: 'Custom Field with the same name already exists'
      });
      return;
    }

    this.setState({ newAddErrorMessage: '' });
    if (isEdit) {
      actions.updateCustomField(pageId, customField.uid, {
        ...this.props.customField,
        fieldName,
        validationType
      });
    } else {
      actions.addCustomField(pageId, {
        field_name: fieldName,
        field_type: 'set_value',
        validation_type: validationType
      });
    }
  };

  _onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { customField, isOpen, toggle } = this.props;
    const { fieldName, validationType } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {customField ? 'Edit' : 'Add New'} Custom Field
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this._save} className="" id="formNewCustomField">
            <div className="form-group">
              <label className="ml-0">Field Name</label>
              <input
                type="text"
                required
                className="form-control"
                name="fieldName"
                onChange={this._onChange}
                placeholder="Enter field name"
                value={fieldName}
              />
            </div>
            <div className="form-group">
              <label className="ml-0">User Input Format</label>
              <div className="flex flex-row">
                {userInputFormats.map((u, i) => (
                  <label key={u.key} className="align-items-center ml-0 mr-3">
                    <input
                      onChange={() => {
                        this.setState({ validationType: u.key });
                      }}
                      type="radio"
                      value="inputFormat"
                      checked={validationType == u.key}
                    />
                    <span className="pl-2">{u.label}</span>
                  </label>
                ))}
              </div>
              <span className="note">
                *chatmatic will not validate the response, it will store however
                the user inputs it
              </span>
            </div>
            {this.state.newAddErrorMessage && (
              <div className="alert alert-danger">
                {this.state.newAddErrorMessage}
              </div>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            className="rounded mb-2 w-100"
            color="primary"
            form="formNewCustomField"
            type="submit"
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

NewCustomFieldModal.propTypes = {
  customField: PropTypes.object,
  customFields: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pageId: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  customFields: getCustomFieldsState(state).customFields
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addCustomField,
      updateCustomField
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCustomFieldModal);
