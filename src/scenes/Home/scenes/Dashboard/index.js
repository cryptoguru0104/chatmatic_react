import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import moment from 'moment';
/** Import components */
import PageMenuItem from './components/PageMenuItem/PageMenuItem';
import Subscribers from './components/Subscribers';

/** Import selectors */
import { filterConnectedPagesWithSearchString } from 'services/pages/selector';
/** Import Actions */
import { getSubscribersHistory } from 'services/subscribers/subscribersActions';
import { setSearchString } from './services/dashboardSceneActions';
import { getPages } from 'services/pages/pagesActions';
// Import Assets
import viceImg from 'assets/images/vice.png';
import './styles.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePageId: this.props.connectedPages.length
                ? this.props.connectedPages[0].uid
                : null,
            recentDays: 7,
            debounceTimer: null
        };

        /** Get Page Subscriber History */
        if (this.props.connectedPages.length > 0) {
            this.props.actions.getSubscribersHistory(
                this.props.connectedPages[0].uid,
                7
            );
        }
    }

    componentDidMount() {
        this.props.actions.setSearchString('');
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        /**
         * When connected pages updated get history of first item of new connected pages array
         */
        if (this.props.connectedPages !== nextProps.connectedPages) {
            if (nextProps.connectedPages.length > 0) {
                nextProps.actions.getSubscribersHistory(
                    nextProps.connectedPages[0].uid,
                    this.state.recentDays
                );
            }

            /**
             * When search filter changes set the showing index 0 to show the first item
             */
            this.setState({
                activePageId: nextProps.connectedPages.length
                    ? nextProps.connectedPages[0].uid
                    : null
            });
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextState.recentDays !== this.state.recentDays) {
            this.props.actions.getSubscribersHistory(
                this.state.activePageId,
                nextState.recentDays
            );
        }
    }

    handlePageMenuItemClick = pageId => {
        this.setState({ activePageId: pageId });
        this.props.actions.getSubscribersHistory(pageId, this.state.recentDays);
    };

    /**
     * On user input data change
     * @param {*} e
     */
    change = e => {
        if (e.target.name === 'searchString') {
            this.props.actions.setSearchString(e.target.value);
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    };

    onAddNewPage = () => {
        this.props.actions.getPages(true);
        this.props.history.push('/page/add');
    };

    renderPageInfo = () => {
        const currentPage = this.props.connectedPages.find(
            page => page.uid === this.state.activePageId
        );

        if (currentPage) {
            const {
                uid,
                fbName,
                // pageLikes,
                subscribers,
                createdAtUtc,
                recentSubscribers,
                fbCoverPhoto
            } = currentPage;

            const fbPageCoverPhoto =
                fbCoverPhoto &&
                fbCoverPhoto !== 'not-connected' &&
                fbCoverPhoto !== 'no-token'
                    ? fbCoverPhoto
                    : viceImg;
            const fbCreated = moment(createdAtUtc).format('DD/MM/YYYY');

            return (
                <div className="page-info-container">
                    <div className="position-relative page-logo-container">
                        <img
                            src={fbPageCoverPhoto}
                            alt=""
                            className="card-img"
                            data-aos="fade"
                        />
                        <div className="d-flex justify-content-between align-items-center position-absolute text-white">
                            <h3 className="m-0 font-weight-normal text-white d-flex align-items-center">
                                {fbName}
                                <small>
                                    <i className="fa fa-thumbs-o-up mx-2" />{' '}
                                    {/* {pageLikes.toLocaleString()} */}
                                </small>
                            </h3>
                            <p className="m-0 font-weight-bold">
                                Created {fbCreated}
                            </p>
                        </div>
                    </div>

                    <div className="page-content">
                        <Subscribers
                            pageId={uid}
                            recentSubscribers={recentSubscribers}
                            subscribers={subscribers}
                            history={this.props.subscribersHistory}
                            activePeriod={this.state.recentDays}
                            onChangeActive={recentDays =>
                                this.setState({ recentDays })
                            }
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="d-flex justify-content-center align-items-center w-100">
                    No page selected
                </div>
            );
        }
    };

    countDebounce = e => {
        e.persist();
        let { debounceTimer } = this.state;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            this.change(e);
        }, 500);
        this.setState({
            debounceTimer
        });
    };

    render() {
        const { loadingMsgTitle, loadingMsgBody } = this.props;

        /** show loading alert */
        if (this.props.loading) {
            Swal({
                title: loadingMsgTitle,
                text: loadingMsgBody,
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.subscribersHistoryLoading) {
            Swal({
                title: 'Please wait...',
                text: 'We are generating a list of recent subscribers.',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else {
            Swal.close();
        }

        const pageMenuItems = this.props.connectedPages.map((item, index) => (
            <PageMenuItem
                fbId={item.fbId}
                fbName={item.fbName}
                uid={item.uid}
                key={index}
                handleClick={this.handlePageMenuItemClick}
                activePageId={this.state.activePageId}
            />
        ));

        /**
         * TODO: Change to url rendering using react-router // Now is handling the left page menu item with onClick
         */
        return (
            <div className="shadow dashboard-scene">
                <div className="d-flex ml-0 h-100">
                    <div className="d-flex flex-column justify-content-between align-items-center page-list-container">
                        <div className="d-flex flex-column w-100 page-list">
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="form-control bg-white search-input"
                                    onChange={this.countDebounce}
                                    name="searchString"
                                />
                            </div>
                            <ul className="list-group list-group-flush">
                                {pageMenuItems}
                            </ul>
                        </div>
                        <div className="btn-add-page-wrapper">
                            <button
                                onClick={this.onAddNewPage}
                                className="btn btn-primary m-4 btn-add-page"
                            >
                                Add A New Page
                            </button>
                        </div>
                    </div>
                    {this.renderPageInfo()}
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.any,
    loadingMsgTitle: PropTypes.string,
    loadingMsgBody: PropTypes.string,
    pages: PropTypes.array,
    successTet: PropTypes.string,
    toggleConnectSucceed: PropTypes.bool,
    connectedPages: PropTypes.array,
    subscribersHistory: PropTypes.array,
    subscribersHistoryLoading: PropTypes.bool
};

export default connect(
    state => ({
        ...state.default.pages,
        connectedPages: filterConnectedPagesWithSearchString(state),
        subscribersHistory: state.default.subscribers.subscribersHistory,
        subscribersHistoryLoading: state.default.subscribers.loading
    }),
    dispatch => ({
        actions: bindActionCreators(
            {
                setSearchString,
                getSubscribersHistory,
                getPages
            },
            dispatch
        )
    })
)(Dashboard);
