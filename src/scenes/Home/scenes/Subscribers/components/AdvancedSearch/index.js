import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import RefreshIcon from '@material-ui/icons/Refresh';
import Select, { NonceProvider } from 'react-select';
import { Grid, Button, TextField, InputBase } from '@material-ui/core';
import { getCustomFields } from 'services/customfields/actions';
import { getTags } from 'services/tags/actions';
import { getCustomFieldsState } from 'services/customfields/selector';
import { getTagsState } from 'services/tags/selector';
import { getPageCampaigns } from "services/campaigns/campaignsActions";
import './styles.css';

const selectStyles = {
  control: styles => ({ ...styles, background: '#fff', 'min-height': '40px', border: 0, borderRadius: '8px', outline: 'none !important', '&:hover': { border: 0}, fontSize: '14px'}),
  indicatorSeparator: styles => ({ display: "none" }),
  multiValue: (styles) => ({ ...styles, backgroundColor: '#84889c', borderRadius: '6px' }),
  multiValueLabel: (styles) => ({ ...styles, color: '#fff', fontSize: '14px'}),
  multiValueRemove: (styles) => ({ ...styles, color: '#fff', fontSize: '14px' }),
  menu: (styles) => ({ ...styles, border: '0', 'overflow': 'hidden', 'border-radius': '10px', 'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 3px 8px', 'margin-top': '10px', '&:before': { position: 'absolute', content: "", width: 0, height: 0, 'border-style': 'solid', 'border-width': '0 10px 10px 10px', 'border-color': 'transparent transparent #f3f5f9 transparent', top: '-10px', right: '45px',} }),
  option: (styles, state) => ({ ...styles, backgroundColor: state.isSelected || state.isFocused ? '#f3f5f9' : '#fff',  fontSize: '14px', color: state.isSelected ? '#fff' : '#0A0D28' })
};
const subscribedDateTypeOptions = [
  {value: 'BEFORE', label: 'Before'},
  {value: 'AFTER', label: 'After'},
  {value: 'ON', label: 'On'}
];
class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          params: this.props.params || {
            tags: [],
            customField: null,
            customFieldValue: null,
            firstName: '',
            lastName: '',
            subscribedDateType: subscribedDateTypeOptions[0] , // AFTER
            subscribedDate: null,
            campaigns: []
          }
        };
    }

    componentWillMount() {
      const { actions, match } = this.props;
  
      actions.getTags(match.params.id);
      actions.getCustomFields(match.params.id);
      actions.getPageCampaigns(match.params.id);
    }

    render() {
      const { params } = this.state;
      const { pageTags, customFields, campaigns } = this.props;

      let optionsTags = [], optionsCustomFields = [], optionsCampaigns = [];

      if(pageTags) optionsTags = pageTags.map((tag) => ({ value: tag.uid, label: tag.value }));
      if(customFields) optionsCustomFields = customFields.map((field) => ({ value: field.uid, label: field.fieldName }));
      if(campaigns) optionsCampaigns = campaigns.map((field) => ({ value: field.uid, label: field.triggerName }));
      
      return (<div className="advanced-search-container">
        <div className="row">
          <label>Tags</label>
          <Select closeMenuOnSelect={false} defaultValue={params.tags} isMulti options={optionsTags} styles={selectStyles} onChange={e => this.setState({params: { ...params, tags: e}})}/>
        </div>
        <div className="row">
          <label>Custom Fields</label>
          <Select defaultValue={params.customField} options={optionsCustomFields} styles={selectStyles} onChange={e => this.setState({params: { ...params, customField: e}})} />
          {params.customField != null &&
            <InputBase placeholder="Custom field value"  className="text-field" value={params.customFieldValue || ""} onChange={e => this.setState({
              params: {
                ...params,
                customFieldValue: e.target.value
              }
            })} />}
        </div>
        <div className="row">
          <Grid container justify="space-between" alignItems="stretch" spacing={1}>
            <Grid item xs={6}>
              <label>First Name</label>
              <InputBase placeholder="First name"  className="text-field" value={params.firstName} onChange={e => this.setState({
                params: {
                  ...params,
                  firstName: e.target.value
                }
              })} />
            </Grid>
            <Grid item xs={6}>
              <label>Last Name</label>
              <InputBase placeholder="Last name"  className="text-field" value={params.lastName} onChange={e => this.setState({
                params: {
                  ...params,
                  lastName: e.target.value
                }
              })} />
            </Grid>
          </Grid>
        </div>
        <div className="row">
          <label>Subscribed Date</label>
          <Grid container justify="space-between" alignItems="stretch" spacing={1}>
            <Grid item style={{flex: 1}}>
              <Select className="subscribed-date-type-selector" defaultValue={params.subscribedDateType} options={subscribedDateTypeOptions} styles={selectStyles} onChange={e => this.setState({params: { ...params, subscribedDateType: e}})} />
            </Grid>
            <Grid item>
              <InputBase 
                type="date"
                value={params.subscribedDate || ""}
                onChange={e => this.setState({
                  params: {
                    ...params,
                    subscribedDate: e.target.value
                  }
                })}
                className="text-field subscribed-date-text-field"
              />
            </Grid>
          </Grid>
        </div>
        <div className="row">
          <label>Subscribed To</label>
          <Select closeMenuOnSelect={false} defaultValue={params.campaigns} isMulti options={optionsCampaigns} styles={selectStyles} onChange={e => this.setState({params: { ...params, campaigns: e}})}  />
        </div>
        <div className="row">
          <Grid container justify="space-between" alignItems="stretch">
            <Button className="btn-reset" onClick={this.props.onReset} startIcon={<RefreshIcon />}>Close &amp; Reset</Button>
            <Button className="btn-search" variant="contained" color="primary" onClick={() => this.props.onSearch(this.state.params)}>Search</Button>
          </Grid>
        </div>
      </div>);
    }
}

AdvancedSearch.propTypes = {
  params: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  pageTags: getTagsState(state).tags,
  customFields: getCustomFieldsState(state).customFields,
  campaigns: state.default.campaigns.campaigns,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          getCustomFields,
          getTags,
          getPageCampaigns,
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch)
);
