import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import { isMobile } from '../../common/helpers/apiHelpers';
import formatter from '../../common/helpers/steemitFormatter';
import { isBannedPost } from '../../common/helpers/postHelpers';
import { setCurrentShownPost } from '../../store/appStore/appActions';
import { getSuitableLanguage } from '../../store/reducers';
import { getContent, getPostsByAuthor } from '../../store/postsStore/postActions';
import Error404 from '../statics/Error404';
import Comments from '../comments/Comments';
// import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import Affix from '../components/Utils/Affix';
import HiddenPostMessage from './HiddenPostMessage';
import PostRecommendation from '../components/Sidebar/PostRecommendation';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import {
  getAuthenticatedUserName,
  getIsAuthFetching,
  getAuthenticatedUser,
} from '../../store/authStore/authSelectors';
import {
  getIsPostFailed,
  getIsPostFetching,
  getIsPostLoaded,
  getPostContent,
} from '../../store/postsStore/postsSelectors';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';
import { addPayoutForActiveVotes } from '../../common/helpers';

@connect(
  (state, ownProps) => {
    const getContentOfPost = getPostContent(
      ownProps.match.params.permlink,
      ownProps.match.params.author,
    );
    const waivRates = getTokenRatesInUSD(state, 'WAIV');
    const post = getContentOfPost(state);
    const follower = getAuthenticatedUserName(state);
    const authUser = getAuthenticatedUser(state);

    return {
      content: post
        ? {
            ...post,
            active_votes: addPayoutForActiveVotes(post, waivRates),
          }
        : post,
      isAuthFetching: getIsAuthFetching(state),
      fetching: getIsPostFetching(state, ownProps.match.params),
      loaded: getIsPostLoaded(state, ownProps.match.params.author, ownProps.match.params.permlink),
      failed: getIsPostFailed(state, ownProps.match.params),
      user: authUser,
      locale: getSuitableLanguage(state),
      follower,
    };
  },
  { getContent, setCurrentShownPost },
)
export default class Post extends React.Component {
  static propTypes = {
    isAuthFetching: PropTypes.bool.isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    content: PropTypes.shape(),
    fetching: PropTypes.bool,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getContent: PropTypes.func,
    setCurrentShownPost: PropTypes.func,
    locale: PropTypes.string,
    follower: PropTypes.string,
  };

  static defaultProps = {
    user: {},
    content: null,
    fetching: false,
    loaded: false,
    failed: false,
    locale: 'en-US',
    follower: '',
    getContent: () => {},
  };

  static fetchData({ store, match }) {
    const { author, permlink } = match.params;

    return Promise.allSettled([
      store.dispatch(getContent(author, permlink), store.dispatch(getPostsByAuthor(author))),
      store.dispatch(getPostsByAuthor(author)),
    ]);
  }

  state = {
    commentsVisible: false,
    showHiddenPost: false,
  };

  componentDidMount() {
    const { match, content } = this.props;
    const { author, permlink } = match.params;

    if (
      (content?.author && content?.permlink && content?.author !== author) ||
      content?.permlink !== permlink
    )
      this.props.getContent(author, permlink, false);

    if (!!content && match.params.category && typeof window !== 'undefined') {
      window.history.replaceState(
        {},
        '',
        `/@${content.author}/${content.permlink}${window.location.hash}`,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { author, permlink } = nextProps.match.params;
    const { author: prevAuthor, permlink: prevPermlink } = this.props.match.params;

    const shouldUpdate = author !== prevAuthor || permlink !== prevPermlink;

    if (shouldUpdate && !nextProps.fetching) {
      this.setState({ commentsVisible: false }, () => {
        this.props.getContent(author, permlink, false);
      });
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      if (typeof document !== 'undefined') window.document.title = 'Waivio';
    }
    this.props.setCurrentShownPost({});
  }

  handleCommentsVisibility = visible => {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  };

  handleShowPost = () => {
    this.setState({
      showHiddenPost: true,
    });
  };

  render() {
    const {
      content,
      // fetching,
      loaded,
      failed,
      isAuthFetching,
      user,
      match,
      locale,
      follower,
    } = this.props;

    if (failed) return <Error404 />;
    // if (fetching || !content) return <Loading />;

    const { showHiddenPost } = this.state;
    const reputation = loaded ? formatter.reputation(content.author_reputation) : 0;
    const showPost = reputation >= 0 || showHiddenPost;
    const jsonMetadata =
      !isEmpty(user) && !isEmpty(user?.posting_json_metadata)
        ? JSON.parse(user?.posting_json_metadata)
        : {};
    const signature = jsonMetadata?.profile?.signature || null;

    const isThread = content && isEmpty(content?.title) && content?.parent_author === 'leothreads';

    return (
      <div className="main-panel">
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <PostRecommendation
                  isAuthFetching={isAuthFetching}
                  locale={locale}
                  follower={follower}
                />
              </div>
            </Affix>
            {showPost ? (
              content && (
                <div className="center" style={{ paddingBottom: '24px' }}>
                  <PostContent
                    isThread={isThread}
                    content={content}
                    signature={signature}
                    isOriginalPost={match.params.original}
                  />
                  <VisibilitySensor onChange={this.handleCommentsVisibility}>
                    {!isBannedPost(content) && (
                      <div id="comments">
                        <Comments show={this.state.commentsVisible} post={content} />
                      </div>
                    )}
                  </VisibilitySensor>
                  {isMobile() && <PostRecommendation />}
                </div>
              )
            ) : (
              <HiddenPostMessage onClick={this.handleShowPost} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
