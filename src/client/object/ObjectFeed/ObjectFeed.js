import { isEmpty, uniq, map, get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, message } from 'antd';
import Feed from '../../feed/Feed';
import { getFeed, getReadLanguages, getCryptosPriceHistory } from '../../reducers';
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
    readLocales: getReadLanguages(state),
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
    wobject: PropTypes.shape().isRequired,
    currentProposition: PropTypes.arrayOf(PropTypes.shape()),
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    readLocales: [],
    handleCreatePost: () => {},
    currentProposition: {},
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
    const { match, limit, readLocales } = this.props;
    const { name } = match.params;
    this.props.getObjectPosts({
      object: name,
      username: name,
      readLanguages: readLocales,
      limit,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { match, limit, readLocales } = this.props;
    if (
      readLocales !== nextProps.readLocales ||
      match.params.name !== nextProps.match.params.name
    ) {
      if (
        readLocales !== nextProps.readLocales ||
        (nextProps.feed &&
          nextProps.feed.objectPosts &&
          !nextProps.feed.objectPosts[nextProps.match.params.name])
      ) {
        this.props.getObjectPosts({
          object: nextProps.match.params.name,
          username: nextProps.match.params.name,
          readLanguages: nextProps.readLocales,
          limit,
        });
      }
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    const { needUpdate } = this.state;
    const { userName, wobject, match } = this.props;
    const requiredObject = get(wobject, ['parent', 'author_permlink']);
    if (needUpdate && requiredObject) {
      this.getPropositions({ userName, requiredObject, match });
    }
  }

  getCurrentUSDPrice = () => {
    const { cryptosPriceHistory } = this.props;

    if (isEmpty(cryptosPriceHistory)) return !cryptosPriceHistory;
    const currentUSDPrice =
      cryptosPriceHistory &&
      cryptosPriceHistory.hive &&
      cryptosPriceHistory.hive.usdPriceHistory &&
      cryptosPriceHistory.hive.usdPriceHistory.usd;

    return currentUSDPrice;
  };

  getPropositions = ({ userName, requiredObject, match }) => {
    this.setState({ loadingPropositions: true, needUpdate: false });
    ApiClient.getPropositions({ userName, requiredObject, match }).then(data => {
      this.setState({ allPropositions: data.campaigns, loadingPropositions: false });
    });
  };

  renderProposition = propositions =>
    map(propositions, proposition =>
      map(
        proposition.objects,
        wobj =>
          wobj.object &&
          wobj.object.author_permlink === this.props.match.params.name && (
            <Proposition
              proposition={proposition}
              wobj={wobj.object}
              assignCommentPermlink={wobj.permlink}
              assignProposition={this.assignPropositionHandler}
              discardProposition={this.discardProposition}
              authorizedUserName={this.props.userName}
              loading={this.state.loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={this.props.history}
              isAssign={this.state.isAssign}
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
        // eslint-disable-next-line no-unreachable
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
    const { feed, limit, handleCreatePost, wobject, currentProposition } = this.props;
    const { loadingPropositions, allPropositions } = this.state;
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
      this.props.history.push(`/rewards/All/${permlink}`);
    };
    const currentUSDPrice = this.getCurrentUSDPrice();
    const minReward = currentProposition ? get(currentProposition[0], ['min_reward']) : 0;
    const maxReward = currentProposition ? get(currentProposition[0], ['max_reward']) : 0;
    const rewardPrise = currentUSDPrice
      ? `${(currentUSDPrice * minReward).toFixed(2)} USD`
      : `${maxReward} HIVE`;

    const getFeedProposition = () => {
      if (wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition)) {
        return (
          <div>
            <ObjectCardView wObject={wobject} passedParent={currentProposition} />
            <div className="Campaign__button" role="presentation" onClick={goToProducts}>
              <Button type="primary" size="large">
                <React.Fragment>
                  <span>
                    {this.props.intl.formatMessage({
                      id: 'rewards_details_earn',
                      defaultMessage: 'Earn',
                    })}
                  </span>
                  <span>
                    <span className="fw6 ml1">{rewardPrise}</span>
                    <Icon type="right" />
                  </span>
                </React.Fragment>
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
