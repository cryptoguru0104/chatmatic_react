import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
/** import assets */
import postImg from 'assets/images/icon-messages-lg.png';

export default class Post extends React.Component {
  render() {
    const {
      post,
      isActivePost,
      onClick,
      onToggleTrigger,
      activeTrigger
    } = this.props;

    const triggerActiveStatus = !!activeTrigger.active;

    return (
      <div
        onClick={onClick}
        style={{
          border: isActivePost ? '1px solid #274bf0' : 'none',
          boxShadow: isActivePost
            ? '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
            : 'none'
        }}
        className="d-flex justify-content-start align-items-center py-1 px-2 flex-shrink-0 my-1 page-post"
      >
        <img
          src={post.picture ? post.picture : postImg}
          alt=""
          className="img-thumbnail mr-2"
          width="60"
        />
        <small className="flex-grow-1 flex-shrink-1 text-muted post-content">
          {post.message}
        </small>
        <span
          className={classnames(
            'ml-2',
            { 'd-flex': post.trigger },
            { 'd-none': !post.trigger }
          )}
        >
          <div
            className={classnames(
              'btn btn-link btn-toggle btn-sm border-0 px-1',
              { 'text-muted': !triggerActiveStatus }
            )}
            onClick={() => !triggerActiveStatus && onToggleTrigger()}
          >
            On
          </div>
          <div
            className={classnames(
              'btn btn-link btn-toggle btn-sm border-0 px-1',
              { 'text-muted': triggerActiveStatus }
            )}
            onClick={() => triggerActiveStatus && onToggleTrigger()}
          >
            Off
          </div>
        </span>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    uid: PropTypes.number.isRequired,
    postType: PropTypes.string,
    trigger: PropTypes.bool.isRequired,
    permalinkUrl: PropTypes.string,
    message: PropTypes.string,
    picture: PropTypes.string,
    comments: PropTypes.number.isRequired,
    facebookPostId: PropTypes.string,
    facebookCreatedTimeUtc: PropTypes.string
  }).isRequired,
  onToggleTrigger: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isActivePost: PropTypes.bool.isRequired,
  activeTrigger: PropTypes.object.isRequired
};
