import React, { Component, Fragment } from 'react';
import { Segment, Card, Image, Checkbox, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import { getPagePosts } from 'services/pages/selector';
import { getPagePosts as fetchPagePosts } from 'services/pages/pagesActions';
import { updateNewCampaignInfo } from '../services/actions';
import Swal from 'sweetalert2';

class PrivateReplay extends Component {
    constructor(props) {
        super(props);
        let options = {
            postUid: null,
            message: '',
            active: 1
        };

        if (props.defaultOptions) {
            options = {
                ...options,
                ...props.defaultOptions
            };
        }

        const triggerId = this.props.match.params.triggerId;
        this.state = {
            options,
            triggerId: triggerId ? Number(triggerId) : null
        };
    }

    componentDidMount = () => {
        this.updateOptions();
        this.props.actions.fetchPagePosts(this.props.match.params.id);
    };

    UNSAFE_componentWillReceiveProps = ({ loading, error }) => {
        if (loading && this.state.updating) {
            Swal({
                title: 'Please wait...',
                text: 'We are updating post trigger...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading) {
            Swal.close();
            if (error) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text:
                        error ||
                        'Something went wrong! Please try again.'
                });
            }
        }

        if (!loading && this.state.updating) {
            this.setState({
                updating: false
            });
            this.props.actions.fetchPagePosts(this.props.match.params.id);
        }
    }

    updateOptions = () => {
        const { options } = this.state;
        console.log('options', options);
        this.props.updateOptions(options);
    };

    handlePostUid = p => {
        const { triggerId } = this.state;
        if (p.trigger && p.triggerStatus && triggerId !== p.triggerUid) {
            Swal.fire({
                type: 'warning',
                title: 'Oops...',
                text: 'This post already has a active trigger. Please disable it before selecting it'
            });
            return false;
        }
        this.setState(
            ({ options }) => ({
                options: { ...options, postUid: p.uid }
            }),
            () => this.updateOptions()
        );
    };

    handleIsActive = active => {
        this.setState(
            ({ options }) => ({
                options: { ...options, active }
            }),
            () => this.updateOptions()
        );
    };

    handlePostTrigger = (triggerUid, status) => () => {
        const { triggers } = this.props
        // console.log('triggerUid', triggerUid, triggers);
        const trigger = triggers.find(t => t.uid === triggerUid);
        if (trigger) {
            trigger.options.active = status;
            // console.log('trigger', trigger);
            this.setState({
                updating: true
            }, () => {
                this.props.actions.updateNewCampaignInfo(
                    this.props.match.params.id,
                    trigger,
                    true
                );
            })
            this.setState(
                ({ options }) => ({
                    options: { ...options, postUid: null },

                }),
                () => this.updateOptions()
            );
        }
    }

    render() {
        const { posts, defaultOptions } = this.props;
        const {
            options: { postUid, active },
            triggerId
        } = this.state;

        // let posts = [];
        // if (allPosts && allPosts.length > 0) {
        //     if (defaultOptions && defaultOptions.postUid) {
        //         posts = allPosts.filter(
        //             p => p.uid === defaultOptions.postUid || !p.trigger
        //         );
        //     } else {
        //         posts = allPosts.filter(p => !p.trigger);
        //     }
        // }
        // console.log('posts', posts);

        return (
            <Fragment>
                <h3 className="heading">Private Replay</h3>

                {defaultOptions && defaultOptions.postUid && (
                    <div>
                        <label className="no-padding">
                            Manage trigger Status
                        </label>
                        <br />
                        <Checkbox
                            checked={active}
                            label={`Trigger is ${
                                active ? 'active' : 'not active'
                                }`}
                            onChange={(e, { checked }) =>
                                this.handleIsActive(checked)
                            }
                        />
                        <br />
                        <br />
                    </div>
                )}
                <label className="no-padding">Choose Post</label>
                <div className="side-posts-block">
                    {posts &&
                        posts.map(p => (
                            <Card
                                key={p.uid}
                                onClick={() => this.handlePostUid(p)}
                                className={`${
                                    postUid === p.uid ? 'active' : ''
                                    }`}
                            >
                                <Card.Content>
                                    <Card.Header>{p.message} </Card.Header>

                                    <Card.Meta>
                                        <span className="date">
                                            {moment(
                                                p.facebookCreatedTimeUtc
                                            ).format('MMM Do YY')}
                                        </span>
                                    </Card.Meta>
                                    {p.trigger && p.triggerStatus === 1 && triggerId !== p.triggerUid &&
                                        <Button onClick={this.handlePostTrigger(p.triggerUid, 0)} className="pr-d-btn">Disable</Button>
                                    }
                                    {p.trigger && p.triggerStatus === 0 && triggerId !== p.triggerUid &&
                                        <Button onClick={this.handlePostTrigger(p.triggerUid, 1)} className="pr-d-btn">Enable</Button>
                                    }
                                </Card.Content>
                                {p.picture && (
                                    <Image src={p.picture} wrapped ui={false} />
                                )}
                            </Card>
                        ))}
                </div>
                {/* <Segment>Post 2</Segment>
                <Segment>Post 3</Segment>
                <Segment>Post 4</Segment> */}
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.match.params.id,
        posts: getPagePosts(state, ownProps),
        triggers: state.default.campaigns.campaigns,
        loading: state.default.scenes.campaignAdd.loading,
        error: state.default.scenes.campaignAdd.error
        // workflows: getGeneralWorkflows(state),
        // campaignAdd: getCampaignAdd(state),
        // loading: state.default.scenes.campaignAdd.loading,
        // campaignAdd: getCampaignAdd(state),
    };
};


const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            fetchPagePosts,
            updateNewCampaignInfo
        },
        dispatch
    )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateReplay));
