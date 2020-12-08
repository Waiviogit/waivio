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
    usedLocale: PropTypes.string,
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
    allPropositions: [],
    loadingPropositions: false,
    needUpdate: true,
    propositions: [],
  };

  componentDidMount() {
    const { match, limit, readLocales, wobject } = this.props;
    const { name } = match.params;
    const wobjectId = get(wobject, '_id');

    this.props.getObjectPosts({
      object: name,
      username: name,
      readLanguages: readLocales,
      limit,
    });

    if (wobjectId) {
      this.mountedId = wobjectId;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match, limit, usedLocale } = this.props;
    const nextPropswobjectId = get(nextProps, ['wobject', '_id']);
    const thisPropsWobjectId = get(this.props, ['wobject', '_id']);
    const nextName = get(nextProps, ['match', 'params', 'name']);
    const objectPosts = get(nextProps, ['feed', 'objectPosts', nextName]);

    if (match.params.name !== nextName && isEmpty(objectPosts)) {
      this.props.getObjectPosts({
        object: nextName,
        username: nextName,
        readLanguages: nextProps.readLocales,
        limit,
      });

      window.scrollTo(0, 0);
    }

    if (
      (thisPropsWobjectId !== nextPropswobjectId && !isEmpty(nextProps.wobject)) ||
      nextPropswobjectId === this.mountedId
    ) {
      const requiredObject =
        get(nextProps.wobject, ['parent', 'author_permlink']) || get(nextProps.wobject, ['parent']);
      const primaryObject = get(nextProps.wobject, ['author_permlink']);
      const reqData = {
        userName: nextProps.userName,
        match: nextProps.match,
        locale: usedLocale,
      };
      if (requiredObject) {
        reqData.requiredObject = requiredObject;
      } else {
        reqData.primaryObject = primaryObject;
      }
      this.getPropositions(reqData);
    }

    this.mountedId = null;
  }

  mountedId = null;

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
    const { loadingPropositions } = this.state;
    const wObjectName = this.props.match.params.name;
    const objectFeed = getFeedFromState('objectPosts', wObjectName, feed);
    const content = uniq(objectFeed);
    const isFetching = getFeedLoadingFromState('objectPosts', wObjectName, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', wObjectName, feed);
    const skip = content.length;
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: wObjectName,
        authorPermlink: wObjectName,
        limit,
        skip,
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
