import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getPostKey } from '../../../common/helpers/stateHelpers';
import formatter from '../../../common/helpers/steemitFormatter';
import { getPostsByAuthor, resetRecommendetPosts } from '../../../store/postsStore/postActions';
import { getRecommendedPosts } from '../../../store/postsStore/postsSelectors';
import PostRecommendationLink from './PostRecommendationLink';

import './PostRecommendation.less';
import './SidebarContentBlock.less';

const PostRecommendation = props => {
  const { recommendedPosts, match } = props;
  const { author } = match.params;

  useEffect(() => {
    if (isEmpty(recommendedPosts)) {
      props.getPostsByAuthor(author);
    }

    return () => props.resetRecommendetPosts();
  }, []);

  useEffect(() => {
    props.getPostsByAuthor(author);
  }, [author]);

  const getFilteredPosts = () => {
    if (!Array.isArray(recommendedPosts)) return [];

    return recommendedPosts
      .filter(
        post =>
          formatter.reputation(post.author_reputation) > -1 &&
          post.permlink !== match.params.permlink,
      )
      .slice(0, 3);
  };

  const navigateToPost = () => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const navigateToPostComments = () => {
    if (typeof document !== 'undefined') document.getElementById('comments').scrollIntoView();
  };

  const filteredRecommendedPosts = getFilteredPosts();

  return (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-headlines SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="recommended_posts" defaultMessage="Recommended Posts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {filteredRecommendedPosts.map(post => (
          <PostRecommendationLink
            key={getPostKey(post)}
            post={post}
            navigateToPost={navigateToPost}
            navigateToPostComments={navigateToPostComments}
          />
        ))}
      </div>
    </div>
  );
};

PostRecommendation.propTypes = {
  match: PropTypes.shape().isRequired,
  getPostsByAuthor: PropTypes.func.isRequired,
  resetRecommendetPosts: PropTypes.func.isRequired,
  recommendedPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default withRouter(
  connect(
    state => ({
      recommendedPosts: getRecommendedPosts(state),
    }),
    { getPostsByAuthor, resetRecommendetPosts },
  )(PostRecommendation),
);
