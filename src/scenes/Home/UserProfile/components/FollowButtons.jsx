import React from 'react';

import '../style.scss';
import { Block } from '../../Layout';

const FollowButtons = ({ followInfo, isAdmin, onFollow, isFollowed }) => {
  const followerCount = !!followInfo && !!followInfo.followers && followInfo.followers.length;
  const followingCount = !!followInfo && !!followInfo.followings && followInfo.followings.length;
  const handleFollow = () => {
    onFollow();
  }

  return (
    <div className="follow-section">
      <Block className="followers">
        <span className="number">{followerCount}</span>
        <span>Followers</span>
      </Block>
      <Block className="following">
        <span className="number">{followingCount}</span>
        <span>Followings</span>
      </Block>
      {!isAdmin ? <button className="follow-button" onClick={handleFollow} disabled={isFollowed}>+Follow</button> : null}
    </div>
  );
};

export default FollowButtons;