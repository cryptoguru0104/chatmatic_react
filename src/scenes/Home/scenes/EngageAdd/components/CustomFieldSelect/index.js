import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getCustomFieldsState } from 'services/customfields/selector';
import { addCustomField } from 'services/customfields/actions';
import _ from 'lodash';

class CustomFieldSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCustomField:
        (!!this.props.customFieldUid && [...(this.props.defaultFields ? this.props.defaultFields : []), ...this.props.customFields].find(c => c.uid == this.props.customFieldUid)) ||
        null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { addingCustomField, customFields } = this.props;
    if (nextProps.addingCustomField) {
      Swal({
        title: 'Please wait...',
        text: 'We are adding a new custom field to the page...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (addingCustomField) {
      Swal.close();

      if (nextProps.addingCustomFieldError) {
        Swal(nextProps.addingCustomFieldError);
      } else {
        //This was loaded before CustomFields were able to populate
        if (
          customFields.length == 0 &&
          nextProps.customFields.length !== customFields.length &&
          !!nextProps.customFieldUid
        ) {
          this.setState({
            selectedCustomField: nextProps.customFields.find(
              x => x.uid == nextProps.customFieldUid
            )
          });
        } else {
          const selectedCustomField = nextProps.customFields.find(
            x => x.fieldName == this.state.selectedCustomField.fieldName
          );
          this.setState({ selectedCustomField: selectedCustomField });
          this.props.onChange(selectedCustomField.uid);
        }
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { customFieldUid, customFields, defaultFields, onChange } = this.props;
    if (prevProps.customFieldUid !== customFieldUid) {
      this.setState({
        selectedCustomField:
        [...(defaultFields ? defaultFields : []), ...customFields].find(c => c.uid == customFieldUid) || null
      });
    }
  }

  _onChange = selectedCustomField => {
    const { onChange } = this.props;
    this.setState({ selectedCustomField });
    onChange(selectedCustomField.uid);
  };

  render() {
    const { actions, customFields, labelName, validationType, defaultFields } = this.props;
    const { selectedCustomField } = this.state;
    const customFieldOptions = [...(defaultFields ? defaultFields : []), ...(_.orderBy(
      customFields.filter(
        c => validationType == null || c.validationType == validationType
      ),
      'fieldName'
    ))];

    console.log(customFieldOptions);
    console.log(selectedCustomField);

    return (
      <div className="form-group tags-container">
        <div className="d-flex justify-content-between align-items-center py-1">
          <label>{labelName ? labelName : 'Save Response to Field'}</label>
        </div>
        <CreatableSelect
          onChange={selectedCustomField => this._onChange(selectedCustomField)}
          options={customFieldOptions}
          isClearable={false}
          getOptionLabel={option =>
            'uid' in option ? option.fieldName : option.label
          }
          getOptionValue={option =>
            (option.uid && option.uid.toString()) || option.value
          }
          onCreateOption={value => {
            let selectedCustomField = {
              fieldName: value,
              validationType: validationType
            };
            this.setState({ selectedCustomField: selectedCustomField });
            actions.addCustomField(this.props.match.params.id, {
              field_name: value,
              field_type: 'set_value',
              validation_type: validationType
            });
          }}
          value={selectedCustomField}
          isValidNewOption={label => {
            if (!label) return false;

            let returnValue = true;

            customFieldOptions.forEach(option => {
              if (label.toLowerCase() === option.fieldName.toLowerCase())
                returnValue = false;
            });

            return returnValue;
          }}
        />
      </div>
    );
  }
}

CustomFieldSelect.propTypes = {
  actions: PropTypes.object.isRequired,
  addingCustomField: PropTypes.bool.isRequired,
  addingCustomFieldError: PropTypes.any,
  customFieldUid: PropTypes.number,
  labelName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationType: PropTypes.string,
  customFields: PropTypes.arrayOf(
    PropTypes.shape({
      fieldType: PropTypes.string,
      fieldName: PropTypes.string,
      mergeTag: PropTypes.string,
      pageUid: PropTypes.number.isRequired,
      uid: PropTypes.any.isRequired,
      validationType: PropTypes.string
    })
  ),
  defaultFields: PropTypes.array
};

const mapStateToProps = state => ({
  customFields: getCustomFieldsState(state).customFields,
  addingCustomField: getCustomFieldsState(state).loading,
  addingCustomFieldError: getCustomFieldsState(state).error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addCustomField
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomFieldSelect)
);
