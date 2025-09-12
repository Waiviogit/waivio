import React from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';
import { useHistory } from 'react-router';

import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import StoryContainer from './StoryContainer';
import StoryLoading from '../components/Story/StoryLoading';
import Loading from '../components/Icon/Loading';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';

import './Feed.less';

const Feed = ({
  content,
  isFetching,
  hasMore,
  loadMoreContent,
  showPostModal,
  isGuest,
  userComments,
  isOwnProfile,
  isThread,
}) => {
  const history = useHistory();

  if (
    isGuest &&
    isOwnProfile &&
    !size(content) &&
    !isFetching &&
    !history.location.pathname?.includes('blog')
  ) {
    return <QuickPostEditor history={history} />;
  }

  return (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMoreContent}
      loader={userComments ? <Loading /> : <StoryLoading />}
      loadingMore={isFetching}
      hasMore={hasMore}
      elementIsScrollable={false}
      containerHeight={content.length === 1 ? '100vh' : '100%'}
    >
      {content.map(id => (
        <StoryContainer
          isThread={isThread}
          key={id}
          id={id}
          showPostModal={showPostModal}
          singlePostVew={false}
          userComments={userComments}
        />
      ))}
    </ReduxInfiniteScroll>
  );
};

Feed.propTypes = {
  showPostModal: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.string),
  isFetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  isGuest: PropTypes.bool,
  loadMoreContent: PropTypes.func,
  userComments: PropTypes.bool,
  isThread: PropTypes.bool,
  isOwnProfile: PropTypes.bool,
};

Feed.defaultProps = {
  content: [],
  isFetching: false,
  hasMore: false,
  isGuest: false,
  loadMoreContent: () => {},
  showPostModal: () => {},
  history: {},
  userComments: false,
  isOwnProfile: false,
};

export default Feed;
