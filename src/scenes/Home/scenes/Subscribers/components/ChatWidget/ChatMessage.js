import React from 'react';
import PropTypes from 'prop-types';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import classnames from 'classnames';

const URL_PATTERN = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
    'i'
);

const ChatMessage = props => {
    const { message } = props;
    const parseMessage = message => {
        if (!message || message.length <= 0) {
            return;
        }

        if (message.slice(0, 1) == '{' && message.slice(-1) == '}') {
            message = message.slice(1, message.length - 1);

            const images = message
                .split(',')
                .filter(x => !!URL_PATTERN.test(x))
                .map((img, i) => (
                    <img key={i} src={img} className="img-fluid my-2" />
                ));
            return images;
        }
        return message.split('\n').map((item, index) => index == 0 ? item : <><br key={index} />{item}</>);
    };
    const ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]', // U+1F680 to U+1F6FF
        ' ', // Also allow spaces
    ].join('|');
    
    const removeEmoji = str => str.replace(new RegExp(ranges, 'g'), '');
    
    const isOnlyEmojis = str => !removeEmoji(str).length;

    return (
        <>
            <div className={classnames('text', isOnlyEmojis(message.message)?'emoticon':'')}>{parseMessage(message.message)}</div>
            <div className="image-wrapper">
                {message.images &&
                    message.images.map((image, x) => (
                        <div className="chat-image-container" style={{backgroundImage: `url(${image})`}} onClick={() => {props.showImageCarousel(x, message.images);}}></div>
                    ))}
            </div>
            {/* <Carousel showThumbs={false}>
                {message.images && message.images.length > 0 &&
                    message.images.map(image => (
                        <img key={image} src={image} className="img-fluid my-2" />
                    ))}
            </Carousel> */}
        </>
    );
};

ChatMessage.propTypes = {
    message: PropTypes.object.isRequired
};

export default ChatMessage;
