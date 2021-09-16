import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Picker } from 'emoji-mart';
import moment from 'moment';
import classnames from 'classnames';
import 'moment-duration-format';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import _ from 'lodash';
import Pusher from 'pusher-js';
import { getActiveSubscriber } from 'services/subscribers/selector';
import { getPageFromUrl } from 'services/pages/selector';
import { updateSubscriberInfo } from 'services/subscribers/subscribersActions';
import { getSubscriberName } from 'services/utils';
import InfiniteScroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';
import CarouselModal from './components/CarouselModal';
/** import images */
import subscriberImg from 'assets/images/subscriber.png';
import pauseEngagementImg from 'assets/images/mini-stop-icon.svg';
import ChatMessage from './ChatMessage';
import './styles.css';
const CHAT_CHANNEL = 'private-cm_live_chat';

class ChatWidget extends React.Component {
    _pusher;
    _channel;
    constructor(props) {
        super(props);

        this.currentEmojiInputPos = null;

        this.state = {
            isConnected: false,
            timer: 0,
            chatType: 'reply',
            showEmojiBox: false,
            chatText: '',
            images: [],
            imageIndex: 0,
            isVisibleModal: false
        };

        this._pusher = new Pusher(process.env.REACT_APP_PUSHER_API_KEY, {
            authEndpoint: `${process.env.REACT_APP_API_URL}/pusher/auth`,
            auth: {
                headers: {
                    Authorization: `Token ${this.props.apiToken}`
                }
            },
            cluster: 'us2',
            forceTLS: true
        });
    }

    _sendMessage = () => {
        const { subscriber } = this.props;
        const { isConnected } = this.state;
        const message = this.state.chatText;

        if (this.state.chatText) {
            this.setState(
                {
                    messages: this.state.messages.concat([
                        {
                            message: this.state.chatText,
                            createdAt: moment(),
                            subscriber_psid: ''
                        }
                    ]),
                    chatText: ''
                },
                () => {
                    if (isConnected) {
                        this._channel.trigger('client-process_chat_out', {
                            message: message,
                            subscriber_psid: subscriber.psid
                        });
                    }
                }
            );
        }
    };

    newMessage = data => {
        const { subscriber } = this.props;
        if (data.subscriber_psid != subscriber.psid) {
            return;
        }
        const isImage = Array.isArray(data.message);
        this.setState({
            messages: [
                ...this.state.messages,
                {
                    ...data,
                    message: !isImage && data.message,
                    images: isImage ? data.message : [],
                    createdAt: moment()
                }
            ]
        });
    };

    _loadChatHistory = data => {
        const { subscriber } = this.props;
        if (data.subscriber_psid != subscriber.psid) {
            return;
        }

        const getPageMessages = textArray => {
            return textArray.map(x => x.text).join();
            // if (!!page.workflow_step_uid) {
            //     if (
            //         page.workflow_step_uid[0].message &&
            //         !!page.workflow_step_uid[0].message.attachment
            //     ) {
            //         return page.workflow_step_uid[0].message.attachment.payload
            //             .text;
            //     }
            //     let text = page.workflow_step_uid
            //         .map(x => x.message && x.message.text)
            //         .join();
            //     return text;
            // }
        };

        console.log("data", JSON.stringify(data))

        let messages = data.message
            .filter(x => !!x.page || !!x.subscriber)
            .map(d => {
                const item = !!d.subscriber ? d.subscriber : d.page;
                return {
                    images: item.filter(x => !!x.image).map(x => x.image),
                    message: getPageMessages(item.filter(x => !!x.text)),
                    createdAt: moment(moment.utc(d.datetime)),
                    subscriber_psid: !!d.page ? '' : data.subscriber_psid
                };
            });
        this.setState({ messages: [...this.state.messages, ...messages] });
    };

    componentDidMount() {
        this._pusher.connection.bind('error', err => console.log('err', err));
        this._pusher.connection.bind('connected', e => {
            this._initializeChannel(this.props.subscriber.psid);
        });

        setTimeout(() => {
            this._scrollToBottom();
        }, 1000);
    }

    _initializeChannel = subscriberPsid => {
        this._channel = this._pusher.subscribe(CHAT_CHANNEL);
        this._channel.bind('pusher:subscription_succeeded', () => {
            this.setState({ isConnected: true });
            this._channel.trigger('client-start_chat', {
                subscriber_psid: subscriberPsid
            });
        });
        this._channel.bind('client-process_chat_in', this.newMessage);
        this._channel.bind(
            'client-process_chat_history',
            this._loadChatHistory
        );
    };

    _scrollToBottom = () => {
        if (this.messageBottom) {
            this.messageBottom.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    componentDidUpdate(prevProps) {
        const { subscriber } = this.props;
        if (prevProps.subscriber.psid !== subscriber.psid) {
            this._channel.trigger('client-stop_chat', {
                subscriber_psid: prevProps.subscriber.psid
            });
            this._channel.trigger('client-start_chat', {
                subscriber_psid: subscriber.psid
            });
            this.setState({ messages: [] });
        }

        this._scrollToBottom();
    }

    componentWillUnmount() {
        this._pusher.unsubscribe(`private-${this.props.subscriber.psid}`);
    }

    _countDownTimer = () => {
        let timer = this.state.timer;

        this.setState({ timer: timer + 1 }, () => {
            setTimeout(() => {
                timer < 119
                    ? this._countDownTimer()
                    : this.setState({ timer: 0 });
            }, 1000);
        });
    };

    _addEmoji = event => {
        if (event.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${event.unified}`);

            this.setState({
                chatText: [
                    this.state.chatText.slice(0, this.currentEmojiInputPos),
                    emojiPic,
                    this.state.chatText.slice(this.currentEmojiInputPos)
                ].join(''),
                showEmojiBox: false
            });
        } else {
            let sym = event.unified.split('-');
            let codesArray = [];
            sym.forEach(el => codesArray.push('0x' + el));

            let emojiPic = String.fromCodePoint(...codesArray);
            this.setState({
                chatText: [
                    this.state.chatText.slice(0, this.currentEmojiInputPos),
                    emojiPic,
                    this.state.chatText.slice(this.currentEmojiInputPos)
                ].join(''),
                showEmojiBox: false
            });
        }

        if (this.chatInput) {
            this.chatInput.focus();
        }
    };

    _chatKeyDown = event => {
        if (event.keyCode === 13) {
            this._sendMessage();
        }
    };

    _toggleSubscribe = () => {
        Swal({
            text: 'Are you sure you want to unsubscribe this user?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, I want to unsubscribe the user',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.updateSubscriberInfo(
                    this.props.match.params.id,
                    this.props.subscriber.uid,
                    {
                        isSubscribed: !this.props.subscriber.isSubscribed
                    }
                );
            }
        });
    };

    _showImageCarousel = (index, images) => {
        this.setState({ imageIndex: index });
        this.setState({ isVisibleModal: true });
        this.setState({ images: images });
    }

    _closeModal = () => {
        this.setState({ isVisibleModal: false });
        this.setState({ images: []});
    }

    render() {
        const { messages, timer } = this.state;
        const { subscriber } = this.props;
        const gender = subscriber.gender
            ? subscriber.gender.toUpperCase()
            : 'No Data Provided';

        const groupedChatHistoryByDate = _(messages)
            .sortBy(x => x.createdAt)
            .groupBy(history =>
                moment(history.createdAt)
                    .local()
                    .format('MMM D, YYYY h:mm A')
            )
            .map((histories, date) => ({ date, histories }))
            .value();
        const groupedChatHistoryByUser = [];
        let messageGroup = [];
        let dummyMessages = [{ "images": ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080","https://images.unsplash.com/photo-1621912911625-c3b08f187953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGFwcm9ufGVufDB8fHx8MTYyOTEzOTQ3NQ&ixlib=rb-1.2.1&q=80&w=1080","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080","https://images.unsplash.com/photo-1621912911625-c3b08f187953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGFwcm9ufGVufDB8fHx8MTYyOTEzOTQ3NQ&ixlib=rb-1.2.1&q=80&w=1080","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080"], "message": "Ok great! Use the code \"thecook\" to get 20% off this apron WHILE SUPPLIES LAST", "createdAt": moment("2021-08-16T23:40:56.000Z"), "subscriber_psid": "" }, { "images": [], "message": "Hey Varus - give me your email for something ridiculous,enter your email here 👇", "createdAt": moment("2021-08-16T23:42:16.000Z"), "subscriber_psid": "" }, { "images": [], "message": "fabianrm333@gmail.com", "createdAt": moment("2021-08-16T23:42:51.000Z"), "subscriber_psid": "3468263553293516" }, { "images": [], "message": "Ok great!", "createdAt": moment("2021-08-16T23:42:52.000Z"), "subscriber_psid": "" }, { "images": [], "message": "Apron", "createdAt": moment("2021-08-17T00:06:56.000Z"), "subscriber_psid": "3468263553293516" }, { "images": [], "message": "Hey  Varus  - this apron is literally the best!\\n\\nLet me ask, do you do the 👨‍🍳  cooking around your house?", "createdAt": moment("2021-08-17T00:06:56.000Z"), "subscriber_psid": "" }, { "images": ["https://images.unsplash.com/photo-1621912911625-c3b08f187953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGFwcm9ufGVufDB8fHx8MTYyOTEzOTQ3NQ&ixlib=rb-1.2.1&q=80&w=1080"], "message": "Ok great! You will literally love this Apron! \\n\\nI'm so sure of it, I wanna give you a 20% discount because I think you'll get this apron, you'll wear it, you'll make something amazing... like...\\n\\n🍕\\nor\\n🍳\\n\\nAnd maybe when you do, you'll post it on Social and Tag @feedingthefrasiers...so let's do this!,Type your phone number below and I will give you an instant text with a 20% off code! 👇", "createdAt": moment("2021-08-17T00:07:10.000Z"), "subscriber_psid": "" }, { "images": [], "message": "2154852106", "createdAt": moment("2021-08-17T00:07:35.000Z"), "subscriber_psid": "3468263553293516" }, { "images": [], "message": "You absolutely rock! Give it about 30 seconds and you should receive the text message.\\n\\n(If you'd like not to wait even that long, just click - Gimme My 20% below)", "createdAt": moment("2021-08-17T00:07:36.000Z"), "subscriber_psid": "" }, { "images": ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3NjYwNnwwfDF8c2VhcmNofDJ8fGNvb2t8ZW58MHx8fHwxNjI5MTM5Njkz&ixlib=rb-1.2.1&q=80&w=1080"], "message": "Ok great! Use the code \"thecook\" to get 20% off this apron WHILE SUPPLIES LAST", "createdAt": moment("2021-08-17T00:07:54.000Z"), "subscriber_psid": "" }, { "images": [], "message": "Recipe", "createdAt": moment("2021-08-17T00:08:32.000Z"), "subscriber_psid": "3468263553293516" }, { "images": [], "message": "Hey Varus - would you like to get emails whenever I post a new recipe to make sure you see them all?,If so - just type your email address below, I'll confirm it, and you'll get a recipe RIGHT NOW!", "createdAt": moment("2021-08-17T00:08:32.000Z"), "subscriber_psid": "" }, { "images": [], "message": "Stephenson.travis@gmail.com", "createdAt": moment("2021-08-17T00:08:43.000Z"), "subscriber_psid": "3468263553293516" }, { "images": [], "message": "Awesome!", "createdAt": moment("2021-08-17T00:08:44.000Z"), "subscriber_psid": "" }, { "images": [], "message": "Hey Varus - give me your email for something ridiculous,enter your email here 👇", "createdAt": moment("2021-08-17T00:09:17.000Z"), "subscriber_psid": "" }];
        // _(dummyMessages)
        _(messages)
            .sortBy(x => x.createdAt)
            .forEach(message => {
                if (messageGroup.length === 0 ||
                    messageGroup[messageGroup.length - 1].subscriber_psid === message.subscriber_psid) {
                    messageGroup.push(message);
                } else {
                    groupedChatHistoryByUser.push(messageGroup);
                    messageGroup = [message]
                }
            })
        if (messageGroup.length > 0) groupedChatHistoryByUser.push(messageGroup); // add last group

        const subscriberImgUrl = subscriber.profilePicUrl || subscriberImg;
        const renderChatHistory = groupedChatHistoryByUser.reverse().map(
            (messageGroup, i) => {
                // const sent = !messageGroup[0].subscriber_psid;
                const sent = !messageGroup[0].subscriber_psid || messageGroup[0].subscriber_psid !== this.props.subscriber.psid;
                return (
                    <div
                        className={`d-flex ${sent ? 'sent' : 'received'} message-group`}
                        key={`${messageGroup[0].subscriber_psid}${i}`}
                    >
                        {/* <h6 className="align-self-center date">
                            {historiesByDate.date}
                        </h6> */}
                        {!sent && <img className="avatar" src={subscriberImgUrl} alt="" />}
                        <div className="messages">
                            <div className={`${sent ? 'text-right' : 'text-left'}`}>{messageGroup[0].createdAt.format('hh:mm')}</div>
                            <div className="flex-column">
                                {messageGroup.map((message, i) => {
                                    if (sent) {
                                        return (
                                            <div
                                                className="mb-1 owner-chat"
                                                key={i}
                                            >
                                                <ChatMessage message={message} showImageCarousel={(imageIndex, images) => this._showImageCarousel(imageIndex, images)} />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                className="mb-1 subscriber-chat"
                                                key={i}
                                            >
                                                <ChatMessage message={message} showImageCarousel={(imageIndex, images) => this._showImageCarousel(imageIndex, images)} />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        
                    </div>
                );
            }

        );

        return (
            <div className="w-100 card chat-container">
                {/* <div className="volume" />
                <div className="sleep" /> */}
                <div className="header d-flex bg-transparent">
                    <img
                        src={subscriber.profilePicUrl || subscriberImg}
                        alt=""
                        className="mr-3"
                    />
                    <div className="d-flex flex-column user-info">
                        <span className="user-name">
                            {getSubscriberName(
                                subscriber.firstName,
                                subscriber.lastName
                            )}
                        </span>
                        <div className="d-flex align-items-center user-subscription">
                            <span>
                                {subscriber.isSubscribed
                                    ? 'Subscribed'
                                    : 'Not Subscribed'}
                            </span>
                            {subscriber.isSubscribed && (
                                <button
                                    className="btn btn-link btn-toggle-subscribe p-0"
                                    onClick={this._toggleSubscribe}
                                >
                                    UNSUBSCRIBE
                                </button>
                            )}
                        </div>
                        <span className="user-sex">{gender}</span>
                        {/* {timer === 0 && (
                            <button
                                className="btn btn-link p-0 text-left user-active-engagements"
                                onClick={this._countDownTimer}
                            >
                                <img src={pauseEngagementImg} alt="" />
                                pause active engagements
                            </button>
                        )}
                        {timer > 0 && (
                            <span className="user-inactive-engagements">
                                {moment
                                    .duration(120 - timer, 'seconds')
                                    .format('*mm:ss')}
                            </span>
                        )} */}
                    </div>
                </div>
                <div
                    className="card-body message-list"
                    ref="chatHistoryContainer"
                >
                    {renderChatHistory}
                </div>
                <div className="card-footer d-flex">
                    <div className="position-relative input-message">
                        <input
                            ref={ref => (this.chatInput = ref)}
                            type="text"
                            className="form-control rounded bg-white"
                            placeholder="Type a message..."
                            value={this.state.chatText}
                            onClick={event => {
                                this.currentEmojiInputPos =
                                    event.target.selectionStart;
                            }}
                            onKeyUp={event => {
                                this.currentEmojiInputPos =
                                    event.target.selectionStart;
                            }}
                            onChange={event => {
                                this.setState({ chatText: event.target.value });
                                this.currentEmojiInputPos =
                                    event.target.selectionStart;
                            }}
                            onKeyDown={this._chatKeyDown}
                        />
                        <button
                            className="position-absolute btn btn-link btn-send-chat"
                            onClick={this._sendMessage}
                        >
                            <svg
                                height="16px"
                                width="16px"
                                version="1.1"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                xmlSpace="preserve"
                            >
                                <path
                                    d="M11,8.3L2.6,8.8C2.4,8.8,2.3,8.9,2.3,9l-1.2,4.1c-0.2,0.5,0,1.1,0.4,1.5C1.7,14.9,2,15,2.4,15c0.2,0,0.4,0,0.6-0.1l11.2-5.6 C14.8,9,15.1,8.4,15,7.8c-0.1-0.4-0.4-0.8-0.8-1L3,1.1C2.5,0.9,1.9,1,1.5,1.3C1,1.7,0.9,2.3,1.1,2.9L2.3,7c0,0.1,0.2,0.2,0.3,0.2 L11,7.7c0,0,0.3,0,0.3,0.3S11,8.3,11,8.3z"
                                    fill="#BEC3C9"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center chat-widgets-container">
                        <div className="d-flex chat-toolbar">
                            {/* <button  className="btn btn-link btn-image">
                                <i className="fa fa-image" />
                            </button> */}
                            <button
                                className="btn btn-link"
                                onClick={() =>
                                    this.setState({
                                        showEmojiBox: !this.state.showEmojiBox
                                    })
                                }
                            >
                                <i className="fa fa-smile-o" />
                            </button>
                            <button className="btn btn-link">
                                <i className="fa fa-paperclip" />
                            </button>
                        </div>
                        <Picker
                            style={{
                                display: this.state.showEmojiBox
                                    ? 'inline-block'
                                    : 'none',
                                position: 'absolute',
                                bottom: 85,
                                right: 0
                            }}
                            onSelect={this._addEmoji}
                            showSkinTones={false}
                            showPreview={false}
                        />
                    </div>
                </div>
                {
                    <CarouselModal photoIndex={this.state.imageIndex} isOpen={this.state.isVisibleModal} images={this.state.images} onClose={this._closeModal} />
                }
            </div>
        );
    }
}

ChatWidget.propTypes = {
    subscriber: PropTypes.object.isRequired,
    fbId: PropTypes.string.isRequired,
    apiToken: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
};

const mapStateToProps = (state, props) => ({
    apiToken: state.default.auth.apiToken,
    subscriber: getActiveSubscriber(state),
    fbId: getPageFromUrl(state, props).fbId,
    loading: state.default.subscribers.loading,
    error: state.default.subscribers.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateSubscriberInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ChatWidget)
);
