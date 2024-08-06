import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { isEmpty, uniq } from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import Loading from '../Icon/Loading';
import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getIsAuthenticated, isGuestUser } from '../../../store/authStore/authSelectors';
import {
  getMentionsContent,
  getMoreMentionsContent,
  resetMentions,
} from '../../../store/feedStore/feedActions';
import { showPostModal } from '../../../store/appStore/appActions';

const limit = 10;

const UserMentions = props => {
  const [loading, setLoading] = useState(false);
  const { name } = useParams();
  const description = `Discover where ${name} is making waves across our platform with the Mentions Tab. See all posts where ${name} is mentioned, showcasing active engagement and influence. Stay informed about ${name}’s contributions by checking out mentions today!`;
  const isFetching = getFeedLoadingFromState('mentions', name, props.feed);
  const objectFeed = getFeedFromState('mentions', name, props.feed);
  const hasMore = getFeedHasMoreFromState('mentions', name, props.feed);
  const mentions = uniq(objectFeed);

  const loadMoreMentions = () => {
    props.getMoreMentionsContent(name, limit);
  };

  useEffect(() => {
    if (isEmpty(mentions)) {
      props.getMentionsContent(name, 0, limit).then(() => setLoading(false));
    }

    return () => props.resetMentions();
  }, [name]);

  return (
    <div className={'UserMentions'}>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
      </Helmet>
      {(isFetching && mentions.length < limit) || loading ? (
        <Loading />
      ) : (
        <div>
          {isEmpty(mentions) ? (
            <div role="presentation" className="Threads__row justify-center">
              <FormattedMessage id="empty_mentions" defaultMessage="There are no mentions yet" />
            </div>
          ) : (
            <div className={'profile'}>
              <Feed
                isThread={false}
                content={mentions}
                isFetching={isFetching}
                hasMore={hasMore}
                loadMoreContent={loadMoreMentions}
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

UserMentions.propTypes = {
  feed: PropTypes.shape(),
  getMentionsContent: PropTypes.func,
  resetMentions: PropTypes.func,
  getMoreMentionsContent: PropTypes.func,
  showPostModal: PropTypes.func,
  isGuest: PropTypes.bool,
};

export default connect(
  state => ({
    feed: getFeed(state),
    isGuest: isGuestUser(state),
    isAuth: getIsAuthenticated(state),
  }),
  {
    getMentionsContent,
    resetMentions,
    getMoreMentionsContent,
    showPostModal,
  },
)(UserMentions);
