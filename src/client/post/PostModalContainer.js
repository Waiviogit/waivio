import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import { getSocialInfoPost as getSocialInfoPostAction } from '../../store/postsStore/postActions';
import { hidePostModal as hidePostModalAction } from '../../store/appStore/appActions';
import PostModal from './PostModal';
import { getCurrentShownPost, getShowPostModal } from '../../store/appStore/appSelectors';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import { getPostContent } from '../../store/postsStore/postsSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { addPayoutForActiveVotes } from '../../common/helpers';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
  getSocialInfoPost,
  isGuest,
  userName,
}) =>
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
    />
  );

PostModalContainer.propTypes = {
  hidePostModal: PropTypes.func.isRequired,
  author: PropTypes.shape().isRequired,
  showPostModal: PropTypes.bool,
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
    const getContent = getPostContent(permlink, author);
    const post = getContent(state);
    const waivRates = getTokenRatesInUSD(state, 'WAIV');

    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
      shownPostContents: {
        ...post,
        active_votes: addPayoutForActiveVotes(post, waivRates),
      },
      isGuest: isGuestUser(state),
      userName: getAuthenticatedUserName(state),
    };
  },
  {
    hidePostModal: hidePostModalAction,
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostModalContainer);
