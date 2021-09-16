// Message Type Icons
import mini_autoresponse_icon from 'assets/images/mini_autoresponse_icon.svg';
import mini_broadcast_icon from 'assets/images/mini_broadcast_icon.svg';
import mini_general_icon from 'assets/images/mini_general_icon.svg';
import mini_keyword_msg_icon from 'assets/images/mini_keyword_msg_icon.svg';
import mini_welcome_msg_icon from 'assets/images/mini_welcome_msg_icon.svg';
import mini_unknown_icon from 'assets/images/mini_unknown_icon.svg';

// Toolbox Item Icons
import activeCardIcon from 'assets/images/icon-active-card.svg';
import activeCarouselIcon from 'assets/images/icon-active-carousel.svg';
import activeVideoIcon from 'assets/images/icon-active-video.svg';
import activeImageIcon from 'assets/images/icon-active-image.svg';
import activeTextIcon from 'assets/images/icon-active-text.svg';
import activeDelayIcon from 'assets/images/icon-active-delay.png';
import activeAudioIcon from 'assets/images/icon-active-audio.png';
import activeUserInputIcon from 'assets/images/icon-active-userinput.svg';
import activeWidgetIcon from 'assets/images/icon-active-widgets.svg';

export const conditionBuilder = Object.freeze({
    ifElseOperator: Object.freeze({
        and: {
            label: 'all of the following conditions',
            operator: 'and'
        },
        or: {
            label: 'any of the following conditions',
            operator: 'or'
        }
    })
});

export default {
    messageType: {
        welcomemsg: {
            value: 'welcomemsg',
            label: 'Welcome Message',
            image: mini_welcome_msg_icon,
            title: 'Welcome Message',
            description:
                'A welcome message is shown to users as soon as they open Facebook Messenger in order to communicate with your fan page. ' +
                'Each fan page may only have ONE (1) welcome message.'
        },
        keywordmsg: {
            value: 'keywordmsg',
            label: 'Keyword Message',
            image: mini_keyword_msg_icon,
            title: 'Keyword Message',
            description:
                'As users message your fan page, you may want your bot to send them different messages depending on what was typed. ' +
                "With this type of engagement your bot is able to provide information and answer your subscriber's questions automatically."
        },
        general: {
            value: 'general',
            label: 'General',
            image: mini_general_icon,
            title: 'General Message',
            description:
                'A general message can be used to engage users when they subscribe to your campaigns.'
        },
        broadcast: {
            value: 'broadcast',
            label: 'Broadcast',
            image: mini_broadcast_icon,
            title: 'Broadcast Message',
            description:
                'A broadcast message allows you to create a flow and send it to many subscribers at once. ' +
                'With this type of engagement you can send promotional marketing material or even just a non-promotional notification with ease.'
        },
        json: {
            value: 'json',
            label: 'JSON',
            image: mini_unknown_icon,
            title: 'JSON Message',
            description:
                'A JSON message is strictly for running Facebook ads. When you create this type of message we restrict your FIRST step to only contain material that can be used in a Facebook ad. After you build it, you will be able to copy the JSON code to use in a Facebook ad from main Engagement screen by clicking on the “…”'
        },
        autoresponse: {
            value: 'autoresponse',
            label: 'AutoResponse',
            image: mini_autoresponse_icon,
            title: 'Auto response',
            description: 'This is a just an auto response'
        }
    },
    toolboxItems: {
        cardItem: {
            type: 'card',
            label: 'CARD',
            image: activeCardIcon,
            active: true,
            component: 'Card'
        },
        carouselItem: {
            type: 'carousel',
            label: 'CAROUSEL',
            image: activeCarouselIcon,
            active: true,
            component: 'Carousel'
        },
        videoItem: {
            type: 'video',
            label: 'VIDEO',
            image: activeVideoIcon,
            active: true,
            component: 'Video'
        },
        imageItem: {
            type: 'image',
            label: 'IMAGE',
            image: activeImageIcon,
            active: true,
            component: 'Image'
        },
        textItem: {
            type: 'text',
            label: 'TEXT',
            image: activeTextIcon,
            active: true,
            component: 'Text'
        },
        audioItem: {
            type: 'audio',
            label: 'AUDIO',
            image: activeAudioIcon,
            active: true,
            component: 'Audio'
        },
        delayItem: {
            type: 'delay',
            label: 'DELAY',
            image: activeDelayIcon,
            active: true,
            component: 'Delay'
        },
        userInputItem: {
            type: 'free_text_input',
            label: 'User Input',
            image: activeUserInputIcon,
            active: true,
            component: 'UserInput'
        },
        widgets: {
            type: 'widgets',
            label: 'Widgets',
            image: activeWidgetIcon,
            active: true,
            component: 'Widgets'
        }
    },
    toolboxItemsPages: {
        fb: [],
        ig: ['cardItem', 'carouselItem', 'imageItem', 'textItem', 'delayItem', 'userInputItem', 'widgets']
    },
    workflowIcons: {
        broadcast: mini_broadcast_icon,
        autoresponse: mini_autoresponse_icon,
        general: mini_general_icon,
        json: mini_general_icon,
        keywordmsg: mini_keyword_msg_icon,
        welcomemsg: mini_welcome_msg_icon
    },
    keywordsOptions: [
        {
            key: 'contains_any',
            label: 'Contains Any',
            description:
                'This option would trigger your response if ANY of the words you list here are contained in the users message. ' +
                'You can list multiple words and if any of them appear in a message to your page, we will send the response you set.',
            constraint: 'Individual words only'
        },
        {
            key: 'contains_all',
            label: 'Contains All',
            description:
                'This option would trigger your response if ALL of the words or phrases you list here are used. ' +
                'If you list "Hello" and "There"... your response will only be sent if the message sent to your page contains both "Hello" and "There". ' +
                'If someone types "Hello" nothing would be sent if you select this option.',
            constraint: 'Individual words only'
        },
        {
            key: 'exact_match',
            label: 'Exact Match',
            description:
                'If you select this option your user will only receive a response if they type EXACTLY what you enter above. ' +
                'Capital letters do not matter, but if they word or phrase is sent to you exactly as you have it above, your response will send. ' +
                'If you use the phrase "Hello There" and someone types "Hello there Sam" your response will not send.'
        }
    ],
    builderTypes: Object.freeze({
        messageConfig: Object.freeze({
            type: 'items',
            label: 'Send Message',
            iconName: 'Send_Message'
        }),
        smsConfig: Object.freeze({
            type: 'sms',
            label: 'Send SMS',
            iconName: 'Another_Flow'
        }),
        smtpConfig: Object.freeze({
            type: 'smtp',
            label: 'Send Email',
            iconName: 'smtp'
        }),
        conditionConfig: Object.freeze({
            type: 'conditions',
            label: 'Condition',
            iconName: 'Condition'
        }),
        randomizerConfig: Object.freeze({
            type: 'randomizer',
            label: 'Randomizer',
            iconName: 'Randomizer'
        }),
        delayConfig: Object.freeze({
            type: 'delay',
            label: 'Smart Delay',
            iconName: 'delaysm'
        })
    }),
    builderActionTypes: {
        web_url: {
            type: 'web_url',
            label: 'Open URL',
        },
        postback_existing: {
            type: 'postback_existing',
            label: 'Send Existing',
        },
        phone_number: {
            type: 'phone_number',
            label: 'Call Button',
        },
        items: {
            type: 'items',
            label: 'Send Message',
        },
        sms: {
            type: 'sms',
            label: 'Send SMS',
        },
        conditions: {
            type: 'conditions',
            label: 'Condition',
        },
        randomizer: {
            type: 'randomizer',
            label: 'Randomizer',
        },
        delay: {
            type: 'delay',
            label: 'Smart Delay',
        },
        postback_existing_workflow: {
            type: 'postback_existing_workflow',
            label: 'Send Existing Workflow',
        }
    },
    builderActionTypesPages: {
        fb: ['web_url', 'postback_existing', 'phone_number', 'items', 'sms', 'conditions', 'randomizer', 'delay', 'postback_existing_workflow'],
        ig: ['web_url', 'sms', 'conditions', 'randomizer', 'delay'],
    },
    smsBuilderItemTypes: Object.freeze({
        text: 'text',
        image: 'image',
        audio: 'audio',
        video: 'video'
    }),
    smtpBuilderItemTypes: Object.freeze({
        text: 'text',
        editor: 'editor',
    }),
    PLAN_DATA: {
        'monthly_single-fan-page': {
            name: 'Basic Plan',
            title: 'Pay As You Grow Plans',
            subtitle: '',
            desc: 'Chatmatic gives you everything!',
            price: 97,
            period: 'PER_MONTH',
            features: [
                'All Features',
                'Some Super Feature',
                'Customer Support'
            ],
            subscriptionLimit: 25000,
        },
        'yearly_single-fan-page': {
            name: 'Ultimate Plan',
            title: 'Keep It Simple',
            subtitle: '',
            desc: 'Chatmatic gives you everything!',
            price: 499,
            period: 'PER_YEAR',
            features: [
                'All Features',
                'All Super Feature',
                'Customer Support',
                'Customer Support',
            ],
            subscriptionLimit: 0
        }
    },
    broadcastTypes: [
        {
            type: 'broadcast-messenger',
            icon: 'broadcast-messenger',
            title: 'Messenger',
            desc: 'This option will allow you to send a broadcast into an existing chat thread'
        },
        {
            type: 'broadcast-sms',
            icon: 'broadcast-sms',
            title: 'Sms',
            desc: 'This option allows you to broadcast to anyone who\'s phone number you\'ve collected, via text message'
        },
        {
            type: 'broadcast-email',
            icon: 'broadcast-email',
            title: 'Email',
            desc: 'This option allows you to broadcast an email to anyone who\'s email you\'ve collected'
        }
    ],
    trainingVideoUrl: 'https://www.youtube.com/channel/UCDMVAdeGH3f8KJc6rD-B2WA'
};
