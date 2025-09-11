import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
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
import {
  getMoreThreadsContent,
  getThreadsContent,
  resetThreads,
} from '../../store/feedStore/feedActions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
  getAuthenticatedUser,
  getAuthUserSignature,
} from '../../store/authStore/authSelectors';
import Feed from '../feed/Feed';
import { getUserProfileBlog } from '../../waivioApi/ApiClient';
import * as commentsActions from '../../store/commentsStore/commentsActions';
import './Threads.less';
import Loading from '../components/Icon/Loading';

const limit = 5;

const Threads = props => {
  const { name } = useParams();
  const [parentPost, setParentPost] = useState({});
  const [loading, setLoading] = useState(false);
  const leothreads = 'leothreads';
  const isFetching = getFeedLoadingFromState('threads', name, props.feed);
  const objectFeed = getFeedFromState('threads', name, props.feed);
  const hasMore = getFeedHasMoreFromState('threads', name, props.feed);
  const threads = uniq(objectFeed);
  const currHost = typeof location !== 'undefined' && location.hostname;
  const jsonMetadata = !isEmpty(props.user) ? JSON.parse(props.user?.posting_json_metadata) : {};
  const signature = jsonMetadata?.profile?.signature || null;
  const sign = props.signatureAuth || signature;
  const initialInputValue = `${
    props.isUser ? `@${name}` : `[#${name}](https://${currHost}/object/${name}) `
  }`;

  const loadMoreThreads = () => {
    props.getMoreThreadsContent(name, limit, props.isUser);
  };
  const callback = () => {
    props.getThreadsContent(name, 0, limit, props.isUser);
    setLoading(false);
  };

  useEffect(() => {
    if (isEmpty(threads)) {
      props.getThreadsContent(name, 0, limit, props.isUser);
      getUserProfileBlog(leothreads, props.authUserName, {
        limit: 1,
        skip: 0,
      }).then(r => {
        setParentPost(r.posts[0]);
      });
    }

    return () => props.resetThreads();
  }, [name]);
  const description = `Create vibrant conversations and build connections on ${name}'s Threads page! Join the dialogue, share insights, and spark discussions with fellow users. Dive into a diverse array of topics and engage with a community passionate about exchanging ideas. Start your thread today and unleash the power of collaborative dialogue!`;

  return (
    <div className={'Threads'}>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
      </Helmet>

      <ThreadsEditor
        signature={sign}
        isUser={props.isUser}
        name={name}
        loading={loading}
        setLoading={setLoading}
        mainThreadHashtag={props.isUser ? undefined : name}
        parentPost={parentPost}
        inputValue={initialInputValue}
        onSubmit={props.sendComment}
        callback={callback}
      />
      {(isFetching && threads.length < limit) || loading ? (
        <Loading />
      ) : (
        <div>
          {isEmpty(threads) ? (
            <div role="presentation" className="Threads__row justify-center">
              <FormattedMessage
                id="empty_threads"
                defaultMessage="Be the first to write a thread."
              />
            </div>
          ) : (
            <div className={'profile'}>
              <Feed
                // userComments
                isThread
                content={threads}
                isFetching={isFetching}
                hasMore={hasMore}
                loadMoreContent={loadMoreThreads}
                showPostModal={post => props.showPostModal(post)}
                isGuest={props.isGuest}
              />
              <PostModal isThread />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Threads.propTypes = {
  feed: PropTypes.shape(),
  user: PropTypes.shape(),
  getThreadsContent: PropTypes.func,
  resetThreads: PropTypes.func,
  getMoreThreadsContent: PropTypes.func,
  showPostModal: PropTypes.func,
  sendComment: PropTypes.func,
  isGuest: PropTypes.bool,
  isUser: PropTypes.bool,
  authUserName: PropTypes.string,
  signatureAuth: PropTypes.string,
};

export default connect(
  state => ({
    feed: getFeed(state),
    user: getAuthenticatedUser(state),
    signatureAuth: getAuthUserSignature(state),
    isGuest: isGuestUser(state),
    isAuth: getIsAuthenticated(state),
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    getThreadsContent,
    resetThreads,
    getMoreThreadsContent,
    sendComment: (parentPost, body, isUpdating, originalPost, isThread, cb) =>
      commentsActions.sendComment(parentPost, body, isUpdating, originalPost, isThread, cb),
    showPostModal,
  },
)(Threads);
