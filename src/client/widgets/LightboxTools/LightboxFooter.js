import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { has, some } from 'lodash';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import ApprovingCard from '../../object/AppendCard/ApprovingCard';
import AppendObjButtons from '../../components/StoryFooter/AppendObjButtons';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';
import { getAppendDownvotes, getAppendUpvotes } from '../../../common/helpers/voteHelpers';
import {
  getAuthenticatedUser,
  getIsAuthenticated,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import { voteAppends } from '../../../store/appendStore/appendActions';
import { getAppendList } from '../../../store/appendStore/appendSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import './LightboxTools.less';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';

const LightboxFooter = ({ post }) => {
  const albums = useSelector(getObjectAlbums);
  const relatedAlbum = useSelector(getRelatedPhotos);
  const currImg = [...albums, relatedAlbum].reduce((result, album) => {
    if (result) return result;

    const al = album.items.find(item => item.body === post.body);

    return al || null;
  }, null);

  const initialPost = has(post, 'active_votes') ? post : currImg;
  const [reactionsModalVisible, showReactionModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(initialPost);
  const updatesList = useSelector(getAppendList);
  const isGuest = useSelector(isGuestUser);
  const isAuthUser = useSelector(getIsAuthenticated);
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
      const newPost = updatesList.find(p => p.permlink === post.permlink);

      if (newPost) {
        setCurrentPost(updatesList.find(p => p.permlink === post.permlink));
      } else {
        setCurrentPost(initialPost);
      }
    }
  }, [updatesList, post]);

  return currentPost?.approvePercent && currentPost ? (
    <div
      className={classNames({
        LightboxTools__container: !isMobile(),
        LightboxTools__container__column: isMobile(),
        LightboxTools__guestContainer: isGuest || !isAuthUser,
      })}
    >
      {!isGuest && isAuthUser && (
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
      )}
      <ApprovingCard lightbox post={currentPost} />
    </div>
  ) : null;
};

LightboxFooter.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default LightboxFooter;
