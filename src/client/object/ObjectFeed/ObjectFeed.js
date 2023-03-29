import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, uniq, get, isNil } from 'lodash';
import PropositionContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import Feed from '../../feed/Feed';
import { getSuitableLanguage } from '../../../store/reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../../common/helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../../store/feedStore/feedActions';
import { showPostModal } from '../../../store/appStore/appActions';
import PostModal from '../../post/PostModalContainer';
import Loading from '../../components/Icon/Loading';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';
import { getObject, getObjectsRewards } from '../../../waivioApi/ApiClient';
import { getPropositionsKey } from '../../../common/helpers/newRewardsHelper';
import Proposition from '../../newRewards/reuseble/Proposition/Proposition';
import Campaing from '../../newRewards/reuseble/Campaing';

import './ObjectFeed.less';

@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    readLocales: getReadLanguages(state),
    usedLocale: getSuitableLanguage(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    showPostModal,
  },
)
export default class ObjectFeed extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
    showPostModal: PropTypes.func.isRequired,
    readLocales: PropTypes.arrayOf(PropTypes.string),
    match: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    limit: PropTypes.number,
    handleCreatePost: PropTypes.func,
    wobject: PropTypes.shape(),
    userName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    readLocales: [],
    handleCreatePost: () => {},
    wobject: {},
    usedLocale: 'en-US',
    user: {},
  };

  state = {
    loadingPropositions: false,
    newsPermlink: '',
  };

  componentDidMount() {
    this.getWobjPropos();
    this.getFeedPosts();
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props;
    const nextName = get(nextProps, ['match', 'params', 'name']);
    const objectPosts = get(nextProps, ['feed', 'objectPosts', nextName]);

    if (match.params.name !== nextName && isEmpty(objectPosts)) {
      this.getFeedPosts();

      this.getWobjPropos();
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { name, itemId } = match.params;

    if (prevProps.match.params.name !== name || prevProps.match.params.itemId !== itemId) {
      this.getFeedPosts();
      this.getWobjPropos();
    }
  }

  getFeedPosts = () => {
    const { readLocales, limit, match } = this.props;
    const { name } = match.params;
    const query = new URLSearchParams(this.props.history.location.search);
    const isNewsfeedType = query.get('category') === 'newsfeed';
    const newsfeedParent = query.get('parentObj');

    if (isNewsfeedType) {
      getObject(name).then(res => {
        this.props.getObjectPosts({
          object: name,
          username: name,
          readLanguages: readLocales,
          limit,
          newsPermlink: res?.newsFeed?.permlink,
        });
        this.setState({ newsPermlink: res?.newsFeed?.permlink });
      });
    } else {
      this.props.getObjectPosts({
        object: newsfeedParent || name,
        username: name,
        readLanguages: readLocales,
        limit,
        newsPermlink: this.getNewsPermlink(),
      });
    }
  };

  getWobjPropos = () =>
    getObjectsRewards(this.props.match.params.name, this.props.userName).then(res =>
      this.setState({ reward: res }),
    );

  getNewsPermlink() {
    const { itemId } = this.props.match.params;

    if (isEmpty(this.props.match.params[1]) || isNil(this.props.match.params[1])) return undefined;

    return itemId || this.props.wobject?.newsFeed?.permlink;
  }

  render() {
    const { feed, limit, handleCreatePost, userName, wobject } = this.props;
    const { name } = this.props.match.params;
    const { loadingPropositions, reward } = this.state;
    const objectFeed = getFeedFromState('objectPosts', name, feed);
    const content = uniq(objectFeed);
    const isFetching = getFeedLoadingFromState('objectPosts', name, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', name, feed);
    const skip = content.length;
    const query = new URLSearchParams(this.props.history.location.search);
    const isNewsfeedType = query.get('category') === 'newsfeed';
    const newsfeedParent = query.get('parentObj');

    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: name,
        authorPermlink: newsfeedParent || name,
        limit,
        skip,
        newsPermlink: isNewsfeedType ? this.state.newsPermlink : this.getNewsPermlink(),
      });
    };

    const getFeedContent = () => {
      if (!isEmpty(content) || isFetching) {
        return (
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
        );
      }

      return (
        <div
          role="presentation"
          className="object-feed__row justify-center"
          onClick={handleCreatePost}
        >
          <FormattedMessage
            id="empty_object_profile"
            defaultMessage="Be the first to write a review"
          />
        </div>
      );
    };

    return (
      <div className="object-feed">
        {loadingPropositions ? (
          <Loading />
        ) : (
          <React.Fragment>
            {!isEmpty(reward?.main) && <Campaing campain={reward.main} />}
            {!isEmpty(reward?.secondary) &&
              reward?.secondary?.map((proposition, i) => (
                <Proposition key={getPropositionsKey(proposition, i)} proposition={proposition} />
              ))}
            <PropositionContainer userName={userName} wobject={wobject} />
            {getFeedContent()}
          </React.Fragment>
        )}
        <PostModal />
      </div>
    );
  }
}
