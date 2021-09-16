import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Swal from 'sweetalert2';
import Switch from 'react-switch';
import { getActiveWorkflows } from 'services/workflows/selector';
import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { convertObjectKeyToCamelCase, xapi } from 'services/utils';
/** import components */
import Post from './components/Post/Post';
import {
    getPagePosts,
    getPageTriggers,
    getPageFromUrl
} from 'services/pages/selector';
import { updateTrigger, createTrigger } from 'services/pages/pagesActions';

const commentsFilterOptions = [
    { value: 'all', label: 'All posts' },
    { value: 'withTriggers', label: 'With Triggers' },
    { value: 'withoutTriggers', label: 'Without Triggers' }
];

const commentFilterStyles = {
    control: styles => ({
        ...styles,
        width: 120,
        maxHeight: 30,
        minHeight: 30,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: '#b1b9cc',
        fontSize: 12,
        color: '#464647'
    }),
    dropdownIndicator: styles => ({
        ...styles,
        padding: '0 7px',
        color: '#464647',
        width: 30
    }),
    indicatorSeparator: styles => ({
        ...styles,
        width: 0
    }),
    menuList: styles => ({
        ...styles,
        fontSize: 12,
        color: '#464647'
    })
};

class Details extends React.Component {
    state = {
        commentFilterBy: commentsFilterOptions[0],
        sendExistingWorkflow: true,
        activePost: null,
        activePostId: null,
        activeTrigger: null,
        isSearching: false,
        searchPostId: null,
        posts: this.props.posts
    };

    componentDidMount() {
        if (this.props.workflows.length < 1) {
            this.props.pageActions.getPageWorkflows(this.props.match.params.id);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.page.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Saving...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.page.loading) {
            Swal.close();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { posts, triggers } = this.props;
        const { activePost, activePostId } = this.state;
        if (prevProps.posts !== posts) {
            this.setState({ posts: posts }, () => {
                if (posts.length > 0 && prevProps.posts.length <= 0) {
                    this._setActivePost(posts[0]);
                }
            });
        }
        if (prevProps.triggers !== triggers && activePostId) {
            this._setActivePost(activePost);
        }
    }

    _saveTrigger = (postId, activeTrigger) => {
        if (activeTrigger.uid) {
            this.props.pageActions.updateTrigger(
                parseInt(this.props.match.params.id, 10),
                {
                    ...activeTrigger,
                    message:
                        (this.triggerMessage && this.triggerMessage.value) ||
                        '',
                    inclusionKeywords:
                        (this.includeKeywordsRef &&
                            this.includeKeywordsRef.value) ||
                        ''
                }
            );
        } else {
            this.props.pageActions.createTrigger(
                parseInt(this.props.match.params.id, 10),
                {
                    message:
                        (this.triggerMessage && this.triggerMessage.value) ||
                        '',
                    inclusionKeywords:
                        (this.includeKeywordsRef &&
                            this.includeKeywordsRef.value) ||
                        '',
                    postUid: postId,
                    workflowUid: activeTrigger.workflowUid,
                    active: 1
                }
            );
        }
    };

    _search = searchVal => {
        const { posts } = this.state;
        this.setState({ searchPostId: searchVal }, () => {
            if (searchVal) {
                this.setState({ isSearching: true });
                if (!posts.some(x => x.facebookPostId == searchVal)) {
                    xapi(false)
                        .get(
                            `pages/${this.props.match.params.id}/posts?facebook_post_id=${searchVal}`
                        )
                        .then(data => {
                            if (data.data.posts && data.data.posts.length > 0) {
                                this.setState({
                                    posts: [
                                        ...this.state.posts,
                                        convertObjectKeyToCamelCase(
                                            data.data.posts[0]
                                        )
                                    ]
                                });
                            }
                        })
                        .finally(() => {
                            this.setState({ isSearching: false });
                        });
                }
            }
        });
    };

    _handleSearchPostIdChange = e => {
        if (!e.target.value) {
            this.setState({ searchPostId: this.searchPostRef.value });
        }
    };

    _filteredPosts = () => {
        const { posts } = this.state;
        let filteredPosts = [];

        switch (this.state.commentFilterBy) {
            case commentsFilterOptions[0]:
                filteredPosts = posts;
                break;
            case commentsFilterOptions[1]:
                filteredPosts = posts.filter(post => post.trigger);
                break;
            default:
                filteredPosts = posts.filter(post => !post.trigger);
        }

        return this.state.searchPostId
            ? filteredPosts.filter(
                  post => post.facebookPostId == this.state.searchPostId
              ) || []
            : filteredPosts;
    };

    _setActivePost = post => {
        const { triggers } = this.props;

        const activeTrigger =
            post && post.uid
                ? triggers.find(trigger => trigger.postUid === post.uid) || {}
                : {};

        this.setState({
            activePostId: post.uid,
            activePost: post,
            activeTrigger: activeTrigger,
            sendExistingWorkflow: !(
                activeTrigger &&
                activeTrigger.message &&
                activeTrigger.message.length > 0
            )
        });
    };

    render() {
        const { triggers, pageActions } = this.props;
        const {
            activePost,
            activeTrigger,
            isSearching,
            sendExistingWorkflow
        } = this.state;

        const sortedPosts = _.orderBy(
            this._filteredPosts(),
            [post => new Date(post.facebookCreatedTimeUtc)],
            ['desc']
        );

        const triggerFormDisable =
            activePost !== null && activePost.trigger && !activeTrigger.active;

        if (this.triggerMessage) {
            this.triggerMessage.value = activeTrigger.message || '';
        }

        if (this.includeKeywordsRef) {
            this.includeKeywordsRef.value =
                activeTrigger.inclusionKeywords || '';
        }
        const workflowValue =
            (activeTrigger &&
                this.props.workflows.find(
                    x => x.uid == activeTrigger.workflowUid
                )) ||
            null;

        return (
            <div
                className="d-flex w-100 homepage-details-container"
                data-aos="fade"
                data-aos-delay="300"
            >
                <div className="comments-container">
                    <div className="d-flex justify-content-between flex-wrap align-items-center mb-3 comments-header">
                        <Select
                            value={this.state.commentFilterBy}
                            onChange={filterOption =>
                                this.setState({ commentFilterBy: filterOption })
                            }
                            options={commentsFilterOptions}
                            isClearable={false}
                            isSearchable={false}
                            styles={commentFilterStyles}
                        />

                        <div className="d-flex align-items-center comment-search-container">
                            <input
                                type="number"
                                ref={ref => (this.searchPostRef = ref)}
                                className="form-control form-control-sm rounded "
                                placeholder="post id"
                                onChange={this._handleSearchPostIdChange}
                                onKeyDown={event =>
                                    event.keyCode === 13 &&
                                    this._search(this.searchPostRef.value)
                                }
                            />
                            <button
                                className="btn btn-link p-0 m-0"
                                onClick={() =>
                                    this.searchPostRef &&
                                    this._search(this.searchPostRef.value)
                                }
                            >
                                <i className="fa fa-search ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="d-flex flex-column comments-list pr-1">
                        {isSearching && (
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                Searching...
                            </div>
                        )}
                        {sortedPosts.length == 0 && !isSearching && (
                            <div>
                                No results{' '}
                                {this.state.searchPostId &&
                                    `for Post ID - "${this.state.searchPostId}"`}{' '}
                            </div>
                        )}
                        {sortedPosts.map((post, index) => {
                            const trigger =
                                triggers.find(
                                    trigger => trigger.postUid === post.uid
                                ) || {};
                            return (
                                <Post
                                    key={index}
                                    post={post}
                                    activeTrigger={trigger}
                                    isActivePost={
                                        this.state.activePostId
                                            ? post.uid ===
                                              this.state.activePostId
                                            : index == 0
                                    }
                                    onClick={() => this._setActivePost(post)}
                                    onToggleTrigger={() =>
                                        pageActions.updateTrigger(
                                            parseInt(
                                                this.props.match.params.id,
                                                10
                                            ),
                                            {
                                                ...trigger,
                                                active: !trigger.active
                                            }
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="d-sm-flex post-comment-container">
                    <div className="d-flex flex-column justify-content-between col-sm-12 pr-0 post-left-container">
                        <div>
                            <div className="d-flex align-items-center toggle-container mb-3">
                                <span>Send Existing Workflow:</span>
                                <Switch
                                    checked={sendExistingWorkflow}
                                    onChange={active => {
                                        this.setState({
                                            sendExistingWorkflow: active,
                                            activeTrigger: {
                                                ...activeTrigger,
                                                message: active
                                                    ? ''
                                                    : activeTrigger.message,
                                                workflowUid: active
                                                    ? activeTrigger.workflowUid
                                                    : null
                                            }
                                        });
                                    }}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    offColor="#fff"
                                    offHandleColor="#274bf0"
                                    width={41}
                                    height={24}
                                    handleDiameter={16}
                                    className="btn-toggle"
                                />
                            </div>
                            {sendExistingWorkflow ? (
                                <div className="form-group tags-container">
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <label>Select Existing Workflow:</label>
                                    </div>
                                    <Select
                                        options={_(this.props.workflows).sortBy(
                                            x => x.name
                                        )}
                                        getOptionLabel={option => option.name}
                                        getOptionValue={option =>
                                            (option.uid &&
                                                option.uid.toString()) ||
                                            option.value
                                        }
                                        isClearable
                                        isSearchable
                                        value={workflowValue}
                                        onChange={workflow => {
                                            this.setState({
                                                activeTrigger: {
                                                    ...activeTrigger,
                                                    workflowUid: workflow.uid
                                                }
                                            });
                                        }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>
                                            Enter The Message You’d Like To Send
                                        </span>
                                        <div
                                            id="trigger-message"
                                            className="comment-tip"
                                            ref={ref =>
                                                (this.triggerMessageRef = ref)
                                            }
                                        />
                                    </div>
                                    <textarea
                                        maxLength={960}
                                        rows="10"
                                        ref={ref => (this.triggerMessage = ref)}
                                        className="form-control rounded-0 bg-light mb-4"
                                        disabled={triggerFormDisable}
                                        defaultValue={
                                            activeTrigger.message || ''
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-end align-items-center flex-wrap mt-3 action-container">
                            <div
                                className="btn btn-primary rounded-0 btn-save text-white"
                                onClick={() =>
                                    !triggerFormDisable &&
                                    activePost &&
                                    Object.keys(activePost).length > 0 &&
                                    this._saveTrigger(
                                        activePost.uid,
                                        activeTrigger
                                    )
                                }
                            >
                                Save Trigger
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Details.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.number.isRequired,
            postType: PropTypes.string,
            trigger: PropTypes.bool.isRequired,
            permalinkUrl: PropTypes.string,
            message: PropTypes.string,
            picture: PropTypes.string,
            comments: PropTypes.number.isRequired,
            facebookPostId: PropTypes.string,
            facebookCreatedTimeUtc: PropTypes.string
        })
    ),
    triggers: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.number.isRequired,
            postUid: PropTypes.number.isRequired,
            inclusionKeywords: PropTypes.string,
            message: PropTypes.string,
            messagesSent: PropTypes.number,
            messagesRead: PropTypes.number
        })
    ),
    pageActions: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    workflows: PropTypes.array.isRequired
};

const mapStateToProps = (state, props) => ({
    posts: getPagePosts(state, props),
    triggers: getPageTriggers(state, props),
    page: getPageFromUrl(state, props),
    workflows: getActiveWorkflows(state)
});

const mapDispatchToProps = dispatch => ({
    pageActions: bindActionCreators(
        {
            getPageWorkflows,
            updateTrigger,
            createTrigger
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Details)
);
