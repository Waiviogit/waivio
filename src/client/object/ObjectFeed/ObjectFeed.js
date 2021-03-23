import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, uniq, get, filter } from 'lodash';
import PropositionContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import Feed from '../../feed/Feed';
import { getFeed, getReadLanguages, getSuitableLanguage } from '../../reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../feed/feedActions';
import { showPostModal } from '../../app/appActions';
import PostModal from '../../post/PostModalContainer';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
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
    /* from connect */
    feed: PropTypes.shape().isRequired,
    getObjectPosts: PropTypes.func,
    getMoreObjectPosts: PropTypes.func,
    showPostModal: PropTypes.func.isRequired,
    readLocales: PropTypes.arrayOf(PropTypes.string),
    /* passed */
    match: PropTypes.shape().isRequired,
    /* default props */
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
    loadingAssignDiscard: false,
    isAssign: false,
    loadingPropositions: false,
    needUpdate: true,
    propositions: [],
  };

  componentDidMount() {
    const { match, limit, readLocales } = this.props;
    const { name, itemId } = match.params;

    this.props.getObjectPosts({
      object: name,
      username: name,
      readLanguages: readLocales,
      limit,
      newsPermlink: itemId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { match, limit } = this.props;
    const nextName = get(nextProps, ['match', 'params', 'name']);
    const nextItemID = get(nextProps, ['match', 'params', 'itemId']);
    const objectPosts = get(nextProps, ['feed', 'objectPosts', nextName]);

    if (match.params.name !== nextName && isEmpty(objectPosts)) {
      this.props.getObjectPosts({
        object: nextName,
        username: nextName,
        readLanguages: nextProps.readLocales,
        limit,
        newsPermlink: nextItemID,
      });

      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { match, limit, readLocales } = this.props;
    const { name, itemId } = match.params;
    if (prevProps.match.params.name !== name || prevProps.match.params.itemId !== itemId) {
      this.props.getObjectPosts({
        object: name,
        username: name,
        readLanguages: readLocales,
        limit,
        newsPermlink: itemId,
      });
    }
  }

  getPropositions = reqData => {
    const { match } = this.props;
    this.setState({ loadingPropositions: true });
    ApiClient.getPropositions(reqData).then(data => {
      const currentProposition = filter(
        data.campaigns,
        obj => obj.required_object.author_permlink === match.params.name,
      );

      this.setState({
        allPropositions: data.campaigns,
        currentProposition,
        loadingPropositions: false,
      });
    });
  };

  render() {
    const { feed, limit, handleCreatePost, userName, wobject } = this.props;
    const { name, itemId } = this.props.match.params;
    const { loadingPropositions } = this.state;
    const objectFeed = getFeedFromState('objectPosts', name, feed);
    const content = uniq(objectFeed);
    const isFetching = getFeedLoadingFromState('objectPosts', name, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', name, feed);
    const skip = content.length;
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: name,
        authorPermlink: name,
        limit,
        skip,
        newsPermlink: itemId,
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
            <PropositionContainer userName={userName} wobject={wobject} />
            {getFeedContent()}
          </React.Fragment>
        )}
        <PostModal />
      </div>
    );
  }
}
