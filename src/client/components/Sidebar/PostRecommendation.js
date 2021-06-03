import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { usernameURLRegex } from '../../helpers/regexHelpers';
import { getPostKey } from '../../helpers/stateHelpers';
import formatter from '../../helpers/steemitFormatter';
import Loading from '../../components/Icon/Loading';
import PostRecommendationLink from './PostRecommendationLink';
import { getUserProfileBlog } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';

import './PostRecommendation.less';
import './SidebarContentBlock.less';

@withRouter
@connect(state => ({
  follower: getAuthenticatedUserName(state),
}))
class PostRecommendation extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    follower: PropTypes.string,
  };
  static defaultProps = {
    follower: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      recommendedPosts: [],
      loading: false,
      currentAuthor: '',
    };

    this.getRecommendations = this.getRecommendations.bind(this);
  }

  componentWillMount() {
    const { location, isAuthFetching } = this.props;

    if (!isAuthFetching && location.pathname !== '/') {
      this.getRecommendations();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthFetching !== nextProps.isAuthFetching) {
      this.getRecommendations();
    }
  }

  getRecommendations() {
    const { location } = this.props;

    const author = location.pathname.match(usernameURLRegex)[1];

    this.setState({
      loading: true,
    });
    this.getPostsByAuthor(author);
  }

  getPostsByAuthor = author => {
    const { follower } = this.props;

    getUserProfileBlog(author, follower, { limit: 4 }, this.props.locale)
      .then(result => {
        const recommendedPosts = result || [];

        this.setState({
          recommendedPosts,
          loading: false,
          currentAuthor: author,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  getFilteredPosts = () => {
    const { match } = this.props;

    if (!Array.isArray(this.state.recommendedPosts.posts)) return [];

    return this.state.recommendedPosts.posts
      .filter(
        post =>
          formatter.reputation(post.author_reputation) > -1 &&
          post.permlink !== match.params.permlink,
      )
      .slice(0, 3);
  };

  navigateToPost = author => {
    window.scrollTo(0, 0);

    if (author !== this.state.currentAuthor) {
      this.getPostsByAuthor(author);
    } else {
      this.forceUpdate();
    }
  };

  navigateToPostComments = () => {
    document.getElementById('comments').scrollIntoView();
    this.forceUpdate();
  };

  renderPosts = () => {
    const filteredRecommendedPosts = this.getFilteredPosts();

    return filteredRecommendedPosts.map(post => (
      <PostRecommendationLink
        key={getPostKey(post)}
        post={post}
        navigateToPost={this.navigateToPost}
        navigateToPostComments={this.navigateToPostComments}
      />
    ));
  };

  render() {
    const { loading } = this.state;
    const filteredRecommendedPosts = this.getFilteredPosts();

    if (loading) {
      return <Loading />;
    }

    if (filteredRecommendedPosts.length === 0) {
      return <div />;
    }

    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-headlines SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="recommended_posts" defaultMessage="Recommended Posts" />
        </h4>
        <div className="SidebarContentBlock__content">{this.renderPosts()}</div>
      </div>
    );
  }
}

export default PostRecommendation;
