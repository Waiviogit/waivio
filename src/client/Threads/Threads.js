import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { isEmpty, uniq } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThreadsEditor from './ThreadsEditor/ThreadsEditor';
import { showPostModal } from '../../store/appStore/appActions';
import PostModal from '../post/PostModalContainer';
import { getFeed } from '../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../common/helpers/stateHelpers';
import { getMoreThreadsContent, getThreadsContent } from '../../store/feedStore/feedActions';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import Feed from '../feed/Feed';
import { getUserProfileBlog } from '../../waivioApi/ApiClient';
import * as commentsActions from '../../store/commentsStore/commentsActions';
import './Threads.less';

const limit = 10;

const Threads = props => {
  const { name } = useParams();
  const [parentPost, setParentPost] = useState({});
  const leothreads = 'leothreads';
  const isFetching = getFeedLoadingFromState('threads', name, props.feed);
  const objectFeed = getFeedFromState('threads', name, props.feed);
  const hasMore = getFeedHasMoreFromState('threads', name, props.feed);
  const threads = uniq(objectFeed);
  const initialInputValue = `${props.isUser ? '@' : '#'}${name}`;

  const loadMoreThreads = () => {
    props.getMoreThreadsContent(name, limit, props.isUser);
  };

  useEffect(() => {
    props.getThreadsContent(name, 0, limit, props.isUser);
    getUserProfileBlog(leothreads, props.authUserName, {
      limit: 1,
      skip: 0,
    }).then(r => {
      setParentPost(r.posts[0]);
    });
  }, [name]);

  return (
    <div className={'Threads'}>
      <ThreadsEditor
        mainThreadHashtag={props.isUser ? undefined : name}
        parentPost={parentPost}
        inputValue={initialInputValue}
        onSubmit={props.sendComment}
        callback={() => props.getThreadsContent(name, 0, limit, props.isUser)}
      />
      {isEmpty(threads) ? (
        <div role="presentation" className="Threads__row justify-center">
          <FormattedMessage id="empty_threads" defaultMessage="Be the first to write a thread" />
        </div>
      ) : (
        <div>
          <Feed
            isThread
            content={threads}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreThreads}
            showPostModal={post => props.showPostModal(post)}
            isGuest={props.isGuest}
          />
          <PostModal />
        </div>
      )}
    </div>
  );
};

Threads.propTypes = {
  feed: PropTypes.shape(),
  getThreadsContent: PropTypes.func,
  getMoreThreadsContent: PropTypes.func,
  showPostModal: PropTypes.func,
  sendComment: PropTypes.func,
  isGuest: PropTypes.bool,
  isUser: PropTypes.bool,
  authUserName: PropTypes.string,
};

export default connect(
  state => ({
    feed: getFeed(state),
    isGuest: isGuestUser(state),
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    getThreadsContent,
    getMoreThreadsContent,
    sendComment: (parentPost, body, isUpdating, originalPost, cb) =>
      commentsActions.sendComment(parentPost, body, isUpdating, originalPost, cb),
    showPostModal,
  },
)(Threads);
