import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import {
  getContent as getContentAction,
  getSocialInfoPost as getSocialInfoPostAction,
} from '../../store/postsStore/postActions';
import { hidePostModal as hidePostModalAction } from '../../store/appStore/appActions';
import PostModal from './PostModal';
import { getCurrentShownPost, getShowPostModal } from '../../store/appStore/appSelectors';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { addPayoutForActiveVotes } from '../../common/helpers';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';
import { getPostContent } from '../../store/postsStore/postsSelectors';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
  getSocialInfoPost,
  isGuest,
  userName,
  isFeedMasonry,
  getContent,
}) => {
  useEffect(() => {
    getContent(currentShownPost.author, currentShownPost.permlink);
  }, [currentShownPost.author, currentShownPost.permlink]);

  return (
    showPostModal && (
      <PostModal
        showPostModal={showPostModal}
        currentShownPost={currentShownPost}
        hidePostModal={hidePostModal}
        author={author}
        shownPostContents={shownPostContents}
        getSocialInfoPost={getSocialInfoPost}
        isGuest={isGuest}
        username={userName}
        isFeedMasonry={isFeedMasonry}
      />
    )
  );
};

PostModalContainer.propTypes = {
  hidePostModal: PropTypes.func.isRequired,
  getContent: PropTypes.func.isRequired,
  author: PropTypes.shape().isRequired,
  showPostModal: PropTypes.bool,
  isFeedMasonry: PropTypes.bool,
  currentShownPost: PropTypes.shape(),
  shownPostContents: PropTypes.shape(),
  getSocialInfoPost: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  userName: PropTypes.string,
};

PostModalContainer.defaultProps = {
  author: {},
  showPostModal: false,
  currentShownPost: {},
  shownPostContents: {},
  isGuest: false,
  userName: '',
};

export default connect(
  state => {
    const currentShownPost = getCurrentShownPost(state);
    const author = get(currentShownPost, 'author');
    const permlink = get(currentShownPost, 'permlink');
    const getContentFromState = getPostContent(permlink, author);
    const post = getContentFromState(state);
    const waivRates = getTokenRatesInUSD(state, 'WAIV');
    const userName = getAuthenticatedUserName(state);

    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
      shownPostContents: {
        ...post,
        active_votes: addPayoutForActiveVotes(post, waivRates),
      },
      isGuest: isGuestUser(state),
      userName,
    };
  },
  {
    hidePostModal: hidePostModalAction,
    getSocialInfoPost: getSocialInfoPostAction,
    getContent: getContentAction,
  },
)(PostModalContainer);
