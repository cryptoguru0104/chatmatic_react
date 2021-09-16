import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';
import classnames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import Subscriber from '../Subscriber';
import { Collapse } from 'components';
import uuidv1 from 'uuid/v1';
import { Scrollbars } from 'react-custom-scrollbars';
import { Grid, TextField, InputAdornment, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import moment from 'moment';
import _ from 'lodash';

import { Svg } from 'scenes/Home/Layout';
import {
  getSubscribers,
  getSubscribersState
} from 'services/subscribers/selector';
import {
  clearPageSubscribers,
  getPageSubscribers,
  updateActiveSubscriber,
  getExportSubscribers
} from 'services/subscribers/subscribersActions';

import AdvancedSearch from '../AdvancedSearch';
import './styles.css';

const PER_PAGE = 100;
class SubscriberList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: '',
      subscriberSearch: '',
      searchParams: null,
      debounceTimer: null,
      subscribers: this.props.subscribers || [],
      isFilteringSubscribers: false,
      exportSubscribers: [],
    };
    this.searchRef = React.createRef();
    this.buttonRef = React.createRef();
  }

  componentDidMount() {
    const { actions, pageId, loading } = this.props;
    actions.clearPageSubscribers();
    actions.getPageSubscribers(pageId, true, null, 1, PER_PAGE);
  }

  componentWillUnmount() {
    this.props.actions.clearPageSubscribers();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text:
          this.state.action == 'getSubscribers'
            ? 'Fetching more subscribers'
            : 'We are fetching a subscriber detailed info...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      return <div />;
    } else if (this.props.loading) {
      Swal.close();

      if (nextProps.error) {
        Swal({
          title: 'Subscriber Detail Info Fetching Error',
          text: nextProps.error,
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });
      }
    }
    if (nextProps.loadingExportSubscribers) {
      Swal({
        title: 'Please wait...',
        text: 'We are exporting subscribers data',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loadingExportSubscribers) {
      Swal.close();
      console.log(nextProps)
      if (nextProps.error) {
        Swal({
          title: 'Error on Exporting Subscribers',
          text: nextProps.error,
          type: 'error',
          showCancelButton: true,
          cancelButtonText: 'Close'
        });
      } else {
        const csvData = nextProps.exportSubscribers.map((subscriber, index) => {
          let subscriberData = {
            index: index + 1,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
            phone: subscriber.phone,
            email: subscriber.email,
            location: subscriber.location,
            psid: subscriber.psid,
            url: subscriber.url,
            facebook: subscriber.facebookUrl,
            youtube: subscriber.youtubeUrl,
            instagram: subscriber.instagramUrl
          };
          subscriber.tags.forEach((tag, index) => {
            subscriberData[`tag${index + 1}`] = tag.value;
          });
          subscriberData[`Attributes`] = '';
          subscriber.customFieldResponses.forEach((response, index) => {
            let temp = '<' + response.fieldName + '>' + '-' + response.response + ' | ';
            subscriberData[`Attributes`] += temp;
          });
          return subscriberData;
        });
        this.setState({ exportSubscribers: csvData });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { subscribers } = this.props;
    if (
      prevProps.loadingExportSubscribers &&
      !this.props.loadingExportSubscribers &&
      !this.props.error
    ) {
      this.refs.csv.link.click();
    }

    if (subscribers && subscribers.length !== prevProps.subscribers.length) {
      this.setState({ action: '', subscribers: subscribers });
    }
  }

  _filterSubscribers = () => {
    const { subscriberSearch, searchParams } = this.state;

    // const filteredSubscribers = this.props.subscribers.filter(subscriber => {
    //   if(!((subscriber.firstName || "") + " " + (subscriber.lastName || "")).toLowerCase().includes(subscriberSearch.toLowerCase())) return false;

    //   if(searchParams == null) return true;

    //   if(searchParams.firstName.trim() != "" && subscriber.firstName.toLowerCase() != searchParams.firstName.toLowerCase()) return false;
    //   if(searchParams.lastName.trim() != "" && subscriber.lastName.toLowerCase() != searchParams.lastName.toLowerCase()) return false;

    //   if(searchParams.subscribedDate != null) {
    //     if(searchParams.subscribedDateType.value == 'BEFORE' && moment(subscriber.createdAtUtc).format('MMM D, YYYY') > moment(searchParams.subscribedDate).format('MMM D, YYYY')) return false;
    //     if(searchParams.subscribedDateType.value == 'AFTER' && moment(subscriber.createdAtUtc).format('MMM D, YYYY') < moment(searchParams.subscribedDate).format('MMM D, YYYY')) return false;
    //     if(searchParams.subscribedDateType.value == 'ON' && !moment(subscriber.createdAtUtc).format('MMM D, YYYY') != moment(searchParams.subscribedDate).format('MMM D, YYYY')) return false;
    //   }

    //   if(searchParams.tags.length > 0) {
    //     if(!_.every(searchParams.tags, tag => subscriber.tags.filter(st => st.uid == tag.value).length != 0)) return false;
    //   }

    //   if(searchParams.campaigns.length > 0) {
    //     if(!_.every(searchParams.campaigns, campaign => subscriber.campaigns.filter(st => st.uid == campaign.value).length != 0)) return false;
    //   }

    //   if(searchParams.customField != null) {
    //     let customField = subscriber.customFields.find(cf => cf.customFieldUid == searchParams.customField.value);
    //     if(customField == null || customField.response.toLowerCase() != searchParams.customFieldValue.toLowerCase()) return false;
    //   }
    //   return true;
    // });

    // this.setState({ subscribers: filteredSubscribers });

    this.props.actions.getPageSubscribers(this.props.pageId, true, {query: subscriberSearch, params: searchParams}, 1, PER_PAGE);


    this.props.actions.updateActiveSubscriber(
      this.props.match.params.id,
      null,
      true
    );

  };

  _loadMoreSubscribers = page => {
    const { actions, pageId, paging, loading } = this.props;
    if (loading) {
      return;
    }
    let nextPage = paging.currentPage + 1;
    this.setState({ action: 'getSubscribers' });
    actions.getPageSubscribers(pageId, true, {query: this.state.subscriberSearch, params: this.state.searchParams}, nextPage, PER_PAGE);
  };

  countDebounce = e => {
    // e.persist();
    let { debounceTimer } = this.state;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      this._filterSubscribers();
    }, 500);
    this.setState({ debounceTimer });
  };

  _loadExportSubscribers = () => {
    this.props.actions.getExportSubscribers(this.props.match.params.id);
  };

  handleSearchBlur = (event) => {
    if (this.searchRef && !this.searchRef.current.contains(event.target)) {
      setTimeout(() => {
        this.setState({ isFilteringSubscribers: false });
      }, 500)
    }
  }

  resetSearch = (e) => {
    this.setState({
      isFilteringSubscribers: false,
      searchParams: null
    });
    this.countDebounce(e);
  }

  render() {
    const { loading, paging } = this.props;
    const loadingMessage = (
      <h5 key={uuidv1()} className="px-3 load-message-container">
        Loading...
      </h5>
    );

    console.log('exportSubscribers Data; ', this.state.exportSubscribers);

    return (
      <div className="w-100 subscribers-list-wrapper d-flex flex-column" >
        <div className={classnames('d-flex flex-column align-items-center subscribers-header', {
            'show-btn-export': this.state.isFilteringSubscribers
          })} >
          <Grid container spacing={1} justify="flex-start" alignItems="stretch" className="filter-wrapper">
            <TextField
              placeholder="Search"
              className="input-search"
              onChange={e => {                
                this.setState({ subscriberSearch: e.target.value });
                this.countDebounce();
              }}
              name="subscriberSearch"
              InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>
              }}
            />
            <Button onClick={() => this.setState({ isFilteringSubscribers: !this.state.isFilteringSubscribers })} className="btn-advanced-search">
              {!this.state.isFilteringSubscribers && <Svg name="equalizer"></Svg>}
              {this.state.isFilteringSubscribers && <span>X</span>}
            </Button>
          </Grid>
          <Collapse isOpen={this.state.isFilteringSubscribers} className="advanced-search-wrapper">
            <AdvancedSearch params={this.state.searchParams} onSearch={params => {
              this.setState({
                isFilteringSubscribers: false,
                searchParams: params
              });
              this.countDebounce(); 
            }} onReset={(e) => this.resetSearch(e)} />
          </Collapse>
        </div>
        <div
          id="subscriberScrollContainer"
          ref={ref => (this.scrollParentRef = ref)}
          className={classnames('w-100 subscriber-list', {
            'show-btn-export': this.state.isFilteringSubscribers
          })}
        >
          <InfiniteScroll
            pageStart={1}
            initialLoad={false}
            useWindow={false}
            hasMore={
              !loading &&
              this.state.subscribers.length !== (paging && paging.total)
            }
            loadMore={this._loadMoreSubscribers}
            loader={loadingMessage}
          >
            {this.state.subscribers.map((subscriber, index) => (
              <Subscriber key={index} subscriberId={subscriber.uid} />
            ))}
          </InfiniteScroll>
        </div>
        <div className="subscribers-footer">
          <CSVLink
            ref="csv"
            data={this.state.exportSubscribers}
            filename={'subscribers.csv'}
            className="btn-export-csv d-none"
          >
            Export Subscribers
          </CSVLink>
          <Button variant="outlined"
            className="btn btn-link btn-export-csv"
            onClick={this._loadExportSubscribers}
            ref={this.buttonRef}
            startIcon={<Svg name="publish" />}
          >
            Export Subscribers
          </Button>
        </div>
      </div>
    );
  }
}

SubscriberList.propTypes = {
  activeSubscriberId: PropTypes.number,
  pageId: PropTypes.number.isRequired,
  paging: PropTypes.object,
  subscribers: PropTypes.array.isRequired,
  exportSubscribers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingExportSubscribers: PropTypes.bool.isRequired,
  error: PropTypes.any
};

const mapStateToProps = (state, props) => ({
  activeSubscriberId: state.default.subscribers.activeSubscriberId,
  pageId: (props && parseInt(props.match.params.id)) || 0,
  subscribers: getSubscribers(state),
  loading: getSubscribersState(state).loading,
  loadingExportSubscribers: getSubscribersState(state).loadingExportSubscribers,
  paging: getSubscribersState(state).paging,
  exportSubscribers: getSubscribersState(state).exportSubscribers,
  error: getSubscribersState(state).error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      clearPageSubscribers,
      getPageSubscribers,
      updateActiveSubscriber,
      getExportSubscribers
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriberList)
);
