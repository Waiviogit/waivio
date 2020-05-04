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
import * as ApiClient from '../../../waivioApi/ApiClient';
import { preparePropositionReqData } from '../../rewards/rewardsHelper';
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
    userName: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    limit: 10,
    getObjectPosts: () => {},
    getMoreObjectPosts: () => {},
    readLocales: [],
    handleCreatePost: () => {},
  };

  state = {
    propositions: [],
    sort: 'reward',
  };

  componentDidMount() {
    const { match, limit, readLocales, userName } = this.props;
    const { name } = match.params;
    const { sort } = this.state;
    this.getPropositions({ match, name, userName, sort });
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

  getPropositions = ({ match, requiredObject, userName, sort }) => {
    this.setState({ loadingPropositions: true });
    ApiClient.getPropositions(
      preparePropositionReqData({
        match,
        requiredObject,
        userName,
        sort,
      }),
    ).then(data => {
      this.setState({
        propositions: data.campaigns,
        hasMore: data.hasMore,
        sponsors: data.sponsors,
        sort,
        loadingCampaigns: false,
        loadingPropositions: false,
      });
    });
  };

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
    const { feed, limit, handleCreatePost } = this.props;
    const { propositions } = this.state;
    console.log('propositions', propositions);
    const wObjectName = this.props.match.params.name;
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
    // const minReward = proposition.required_object
    //   ? proposition.required_object.min_reward
    //   : proposition.min_reward;
    // const maxReward = proposition.required_object
    //   ? proposition.required_object.max_reward
    //   : proposition.max_reward;

    // const rewardPrise = currentUSDPrice
    //   ? `${(currentUSDPrice * minReward).toFixed(2)} USD`
    //   : `${maxReward} HIVE`;

    return (
      <div className="object-feed">
        <div>
          {!isEmpty(propositions)
            ? map(propositions, proposition => (
                <div>
                  <ObjectCardView wObject={proposition.required_object} />
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
                          <span className="fw6 ml1">{currentUSDPrice}</span>
                          <Icon type="right" />
                        </span>
                      </React.Fragment>
                      {/* {!rewardMax ? ( */}
                      {/*  <React.Fragment> */}
                      {/* <span> */}
                      {/*  {this.props.intl.formatMessage({ */}
                      {/*    id: 'rewards_details_earn', */}
                      {/*    defaultMessage: 'Earn', */}
                      {/*  })} */}
                      {/* </span> */}
                      {/*    <span> */}
                      {/*  <span className="fw6 ml1">{rewardPrise}</span> */}
                      {/*  <Icon type="right" /> */}
                      {/* </span> */}
                      {/*  </React.Fragment> */}
                      {/* ) : ( */}
                      {/*  <React.Fragment> */}
                      {/* <span> */}
                      {/*  {this.props.intl.formatMessage({ */}
                      {/*    id: 'rewards_details_earn_up_to', */}
                      {/*    defaultMessage: 'Earn up to', */}
                      {/*  })} */}
                      {/* </span> */}
                      {/*    <span> */}
                      {/*  <span className="fw6 ml1">{`${rewardMax}`}</span> */}
                      {/*  <Icon type="right" /> */}
                      {/* </span> */}
                      {/*  </React.Fragment> */}
                      {/* )} */}
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
