import React, { Component } from 'react'

import { bindActionCreators } from 'redux';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';

import { getTagsState } from 'services/tags/selector';
import { getActiveSubscriber } from 'services/subscribers/selector';
import { updateSubscriberInfo } from 'services/subscribers/subscribersActions';
import { addTag } from 'services/tags/actions';

import './styles.scss';

class UserTags extends Component {
    constructor(props) {
      super(props)
      this.state = {
        tags: this.props.subscriber.tags || [],
      };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        tags: nextProps.subscriber.tags || [],
      });
    }

    
    render() {
      const customStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: 'white',

            padding: '6px 10px'
            // cursor: isDisabled ? 'not-allowed' : 'default',
      
            // ':active': {
            //   ...styles[':active'],
            //   backgroundColor:
            //     !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
            // }
          }
        },
        control: (styles) => ({
          ...styles,
          backgroundColor: '#F3F5F9',
          border: 'none',
          borderRadius: '10px',
          padding: '12px'

        }),
        multiValue: (styles, { data }) => {
          return {
            ...styles,
            backgroundColor: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            color: '#1A2770 !important',
            cursor: 'pointer',
            ':hover': {
              backgroundColor: '#3350EE',
              color: 'white !important'
            }
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          fontSize: '14px',
          color: 'inherit',
          ':hover': {
            color: 'white !important'
          }
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: 'inherit',
          fontSize: '10px',
          ':hover': {
            backgroundColor: 'inherit',
            color: 'inherit',
          },
        }),
        
      }
        return (
          <div className="card w-100 tags-container">
                <div className="d-flex justify-content-between align-items-center tags-header">
                    <h2>User Tags</h2>
                </div>
                <hr/>
                <div className="tags-content">
                  <CreatableSelect
                      className="categorySelector"
                      styles={customStyles}
                      isMulti
                      onChange={tags => {
                        this.setState({ tags });

                        this.props.actions.updateSubscriberInfo(
                            this.props.match.params.id,
                            this.props.subscriber.uid,
                            { tags }
                        );
                        }}
                        options={this.props.pageTags}
                        placeholder="Search for a existing tag or create a new one"
                        isClearable={false}
                        getOptionLabel={option =>
                        'uid' in option ? option.value : option.label
                        }
                        getOptionValue={option =>
                        (option.uid && option.uid.toString()) || option.value
                        }
                        onCreateOption={value => {
                        this.props.actions.addTag(this.props.match.params.id, value);
                        const newTags = this.state.tags.concat([
                            { uid: value, value }
                        ]);
                        this.setState({
                            tags: newTags
                        });
                        }}
                        value={this.state.tags}
                        isValidNewOption={label => {
                        if (!label) return false;

                        let returnValue = true;

                        this.props.pageTags.forEach(option => {
                            if (label.toLowerCase() === option.value.toLowerCase())
                            returnValue = false;
                        });

                        return returnValue;
                      }}
                  />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    subscriber: getActiveSubscriber(state),
    pageTags: getTagsState(state).tags,
    loading: state.default.subscribers.loading,
    error: state.default.subscribers.error,
    addingTag: state.default.settings.tags.loading,
    addingTagError: state.default.settings.tags.error
  });
  
  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
      {
        updateSubscriberInfo,
        addTag
      },
      dispatch
    )
  });
  
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserTags)
  );