import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { some } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import ApprovingCard from '../../object/AppendCard/ApprovingCard';
import AppendObjButtons from '../../components/StoryFooter/AppendObjButtons';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';
import { getAppendDownvotes, getAppendUpvotes } from '../../../common/helpers/voteHelpers';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import { voteAppends } from '../../../store/appendStore/appendActions';

import './LightboxTools.less';
import { getAppendList } from '../../../store/appendStore/appendSelectors';

const LightboxFooter = ({ post }) => {
  const [reactionsModalVisible, showReactionModal] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const updatesList = useSelector(getAppendList);

  const user = useSelector(getAuthenticatedUser);
  const defaultVotePercent = useSelector(getVotePercent);
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const upVotes = currentPost.active_votes && getAppendUpvotes(currentPost.active_votes);
  const isLiked = currentPost.isLiked || some(upVotes, { voter: user.name });

  const handleLikeClick = (pic, weight = 10000) => {
    if (isLiked) {
      dispatch(voteAppends(pic.author, pic.permlink, 0, currentPost.name, false, match.params[0]));
    } else {
      dispatch(
        voteAppends(pic.author, pic.permlink, weight, currentPost.name, false, match.params[0]),
      );
    }
  };

  const handleReportClick = (pic, myWeight) => {
    const downVotes = getAppendDownvotes(pic.active_votes);
    const isReject = pic.isReject || some(downVotes, { voter: user.name });
    const onlyMyLike = isLiked && pic.active_votes.length === 1;
    const voteWeight = onlyMyLike ? 1 : myWeight;

    if (isReject) {
      dispatch(voteAppends(pic.author, pic.permlink, 0, currentPost.name, false, match.params[0]));
    } else {
      dispatch(
        voteAppends(pic.author, pic.permlink, voteWeight, currentPost.name, false, match.params[0]),
      );
    }
  };

  useEffect(() => {
    if (updatesList) {
      setCurrentPost(updatesList.find(p => p.permlink === post.permlink));
    } else {
      setCurrentPost(post);
    }
  }, [updatesList]);

  return currentPost.approvePercent ? (
    <div className="LightboxTools__container">
      <AppendObjButtons
        post={currentPost}
        lightbox
        handleLikeClick={handleLikeClick}
        onFlagClick={handleReportClick}
        handleShowReactions={() => showReactionModal(true)}
        // handleCommentsClick={handleCommentsClick}
        handleCloseReactions={() => showReactionModal(false)}
        reactionsModalVisible={reactionsModalVisible}
        defaultVotePercent={defaultVotePercent}
      />
      <ApprovingCard lightbox post={currentPost} />
    </div>
  ) : null;
};

LightboxFooter.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default LightboxFooter;
