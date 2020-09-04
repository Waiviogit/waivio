import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, message } from 'antd';
import { isEmpty, uniq, map, get, filter } from 'lodash';

import Feed from '../../feed/Feed';
import {
  getFeed,
  getReadLanguages,
  getCryptosPriceHistory,
  getSuitableLanguage,
  getAuthenticatedUser,
} from '../../reducers';
import { assignProposition, declineProposition } from '../../user/userActions';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../feed/feedActions';
import { showPostModal } from '../../app/appActions';
import Proposition from '../../rewards/Proposition/Proposition';
import ObjectCardView from '../../objectCard/ObjectCardView';
import PostModal from '../../post/PostModalContainer';
import * as apiConfig from '../../../waivioApi/config.json';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import './ObjectFeed.less';

@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    user: getAuthenticatedUser(state),
    readLocales: getReadLanguages(state),
    usedLocale: getSuitableLanguage(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    getObjectPosts,
    getMoreObjectPosts,
    showPostModal,
    assignProposition,
    declineProposition,
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
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    wobject: PropTypes.shape(),
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    user: PropTypes.shape(),
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

    if (match.params.name !== nextName) {
      if (objectPosts) {
        this.props.getObjectPosts({
          object: nextName,
          username: nextName,
          readLanguages: nextProps.readLocales,
          limit,
        });
      }

      window.scrollTo(0, 0);
    }

    if (thisPropsWobjectId !== nextPropswobjectId && !isEmpty(nextProps.wobject)) {
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

    if (nextPropswobjectId === this.mountedId) {
      const requiredObject = get(nextProps.wobject, ['parent', 'author_permlink']);

      this.getPropositions({
        userName: nextProps.userName,
        requiredObject,
        match: nextProps.match,
        locale: usedLocale,
      });
    }

    this.mountedId = null;
  }

  mountedId = null;

  getCurrentUSDPrice = () => {
    const { cryptosPriceHistory } = this.props;

    if (isEmpty(cryptosPriceHistory)) return !cryptosPriceHistory;

    return get(cryptosPriceHistory, ['hive', 'usdPriceHistory', 'usd']);
  };

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

  renderProposition = propositions =>
    map(propositions, proposition =>
      map(
        proposition.objects,
        wobj =>
          get(wobj, ['object', 'author_permlink']) === this.props.match.params.name && (
            <Proposition
              proposition={proposition}
              wobj={wobj.object}
              wobjPrice={wobj.reward}
              assignCommentPermlink={wobj.permlink}
              assignProposition={this.assignPropositionHandler}
              discardProposition={this.discardProposition}
              authorizedUserName={this.props.userName}
              loading={this.state.loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={this.props.history}
              isAssign={this.state.isAssign}
              match={this.props.match}
              user={this.props.user}
            />
          ),
      ),
    );

  // Propositions
  assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    companyId,
    proposition,
    proposedWobj,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    this.setState({ loadingAssignDiscard: true });
    return this.props
      .assignProposition({
        companyAuthor,
        companyPermlink,
        objPermlink,
        resPermlink,
        appName,
        proposition,
        proposedWobj,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully_update',
            defaultMessage: 'Assigned successfully. Your new reservation will be available soon.',
          }),
        );
        const updatedPropositions = this.updateProposition(
          companyId,
          true,
          objPermlink,
          companyAuthor,
        );
        this.setState({
          propositions: updatedPropositions,
          loadingAssignDiscard: false,
          isAssign: true,
        });

        return { isAssign: true };
      })
      .catch(e => {
        this.setState({ loadingAssignDiscard: false, isAssign: false });
        throw e;
      });
  };

  updateProposition = (propsId, isAssign, objPermlink, companyAuthor) =>
    this.state.propositions.map(proposition => {
      const updatedProposition = proposition;
      // eslint-disable-next-line no-underscore-dangle
      if (updatedProposition._id === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            updatedProposition.objects[index].assigned = isAssign;
          } else {
            updatedProposition.objects[index].assigned = null;
          }
        });
      }
      // eslint-disable-next-line no-underscore-dangle
      if (updatedProposition.guide.name === companyAuthor && updatedProposition._id !== propsId) {
        updatedProposition.isReservedSiblingObj = true;
      }
      return updatedProposition;
    });

  discardProposition = ({
    companyAuthor,
    companyPermlink,
    companyId,
    objPermlink,
    unreservationPermlink,
    reservationPermlink,
  }) => {
    this.setState({ loadingAssignDiscard: true });
    return this.props
      .declineProposition({
        companyAuthor,
        companyPermlink,
        companyId,
        objPermlink,
        unreservationPermlink,
        reservationPermlink,
      })
      .then(() => {
        const updatedPropositions = this.updateProposition(companyId, false, objPermlink);
        this.setState({
          propositions: updatedPropositions,
          loadingAssignDiscard: false,
          isAssign: false,
        });
        return { isAssign: false };
      })
      .catch(e => {
        message.error(e.error_description);
        this.setState({ loadingAssignDiscard: false, isAssign: true });
      });
  };
  // END Propositions

  render() {
    const { feed, limit, handleCreatePost, wobject, intl } = this.props;
    const { loadingPropositions, allPropositions, currentProposition } = this.state;
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
    const goToProducts = () => {
      const permlink = get(wobject, 'author_permlink');
      this.props.history.push(`/rewards/all/${permlink}`);
    };
    const minReward = currentProposition ? get(currentProposition[0], ['min_reward']) : 0;
    const maxReward = currentProposition ? get(currentProposition[0], ['max_reward']) : 0;
    const rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
    const rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
    const getFeedProposition = () => {
      if (wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition)) {
        return (
          <div>
            <ObjectCardView wObject={wobject} passedParent={currentProposition} />
            <div className="Campaign__button" role="presentation" onClick={goToProducts}>
              <Button type="primary" size="large">
                {!rewardMax ? (
                  <React.Fragment>
                    <span>
                      {intl.formatMessage({
                        id: 'rewards_details_earn',
                        defaultMessage: 'Earn',
                      })}
                    </span>
                    <span>
                      <span className="fw6 ml1">{rewardPrise}</span>
                      <Icon type="right" />
                    </span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span>
                      {intl.formatMessage({
                        id: 'rewards_details_earn_up_to',
                        defaultMessage: 'Earn up to',
                      })}
                    </span>
                    <span>
                      <span className="fw6 ml1">{`${rewardMax}`}</span>
                      <Icon type="right" />
                    </span>
                  </React.Fragment>
                )}
              </Button>
            </div>
          </div>
        );
      }
      return this.renderProposition(allPropositions);
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
            {getFeedProposition()}
            {getFeedContent()}
          </React.Fragment>
        )}
        {<PostModal />}
      </div>
    );
  }
}
