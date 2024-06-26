import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../../common/helpers/stateHelpers';
import { showPostModal } from '../../store/appStore/appActions';
import { getUserComments, getMoreUserComments } from '../../store/feedStore/feedActions';
import EmptyMutedUserProfile from '../statics/MutedContent';
import { getFeed } from '../../store/feedStore/feedSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import Loading from '../components/Icon/Loading';

const UserProfilePosts = props => {
  const [skip, setSkip] = useState(0);
  const { feed, match, limit, user } = props;
  const username = match.params.name;
  const content = getFeedFromState('comments', username, feed);
  const isFetching = getFeedLoadingFromState('comments', username, feed);
  const hasMore = getFeedHasMoreFromState('comments', username, feed);

  useEffect(() => {
    if (isEmpty(content)) {
      props.getUserComments({
        username: match.params.name,
      });
      setSkip(skip + props.limit);
    }
  }, []);

  const loadMoreContentAction = () => {
    props.getMoreUserComments({ username, skip, limit });
    setSkip(skip + props.limit);
  };

  if (!isEmpty(user.mutedBy) || user.muted) return <EmptyMutedUserProfile user={user} />;

  if (isEmpty(content) && !isFetching) {
    return (
      <div role="presentation" className="Threads__row justify-center">
        <FormattedMessage id="empty_comments" defaultMessage="There are no comments yet" />
      </div>
    );
  }
  const description = `Explore genuine ${username} feedback! Dive into our collection of authentic comments left by engaged readers under our posts. Discover what our community is saying, share your thoughts, and join the conversation today.`;

  return (
    <React.Fragment>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
      </Helmet>
      {isFetching && content?.length < limit ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={props.showPostModal}
            userComments
          />
          <PostModal />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

UserProfilePosts.propTypes = {
  feed: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  showPostModal: PropTypes.func.isRequired,
  limit: PropTypes.number,
  getUserComments: PropTypes.func,
  getMoreUserComments: PropTypes.func,
};

UserProfilePosts.defaultProps = {
  limit: 10,
  getUserComments: () => {},
  getMoreUserComments: () => {},
  authenticatedUserName: '',
  user: {},
};

export default connect(
  (state, ownProps) => ({
    feed: getFeed(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  {
    getUserComments,
    getMoreUserComments,
    showPostModal,
  },
)(UserProfilePosts);
