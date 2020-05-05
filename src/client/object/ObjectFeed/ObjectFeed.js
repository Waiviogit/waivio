import { isEmpty, uniq, map } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import Feed from '../../feed/Feed';
import { getFeed, getReadLanguages, getCryptosPriceHistory } from '../../reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../feed/feedActions';
import { showPostModal } from '../../app/appActions';
import ObjectCardView from '../../objectCard/ObjectCardView';
import PostModal from '../../post/PostModalContainer';
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
    propositions: PropTypes.shape().isRequired,
    currentProposition: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    readLocales: [],
    handleCreatePost: () => {},
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

  render() {
    const { feed, limit, handleCreatePost, wobject, propositions, currentProposition } = this.props;
    const wObjectName = this.props.match.params.name;
    console.log('wobject', wobject);

    console.log('currentProposition', currentProposition);
    const content = uniq(getFeedFromState('objectPosts', wObjectName, feed));
    const isFetching = getFeedLoadingFromState('objectPosts', wObjectName, feed);
    const hasMore = getFeedHasMoreFromState('objectPosts', wObjectName, feed);
    const loadMoreContentAction = () => {
      this.props.getMoreObjectPosts({
        username: wObjectName,
        authorPermlink: wObjectName,
        limit,
      });
    };
    const goToProducts = () => {
      this.props.history.push(`/rewards/All`);
    };
    const currentUSDPrice = this.getCurrentUSDPrice();
    const minReward = currentProposition ? currentProposition.min_reward : null;
    const maxReward = currentProposition ? currentProposition.max_reward : null;

    const rewardPrise = currentUSDPrice
      ? `${(currentUSDPrice * minReward).toFixed(2)} USD`
      : `${maxReward} HIVE`;

    return (
      <div className="object-feed">
        <div>
          {!isEmpty(propositions)
            ? map(propositions, proposition => (
                <div>
                  <ObjectCardView wObject={proposition.required_object} passedParent={wobject} />
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
              ))
            : null}
        </div>
        {!isEmpty(content) || isFetching ? (
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
            showPostModal={this.props.showPostModal}
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div className="object-feed__row justify-center" onClick={handleCreatePost}>
            <FormattedMessage
              id="empty_object_profile"
              defaultMessage="Be the first to write a review"
            />
          </div>
        )}
        {<PostModal />}
      </div>
    );
  }
}
