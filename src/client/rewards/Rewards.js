/* eslint-disable no-underscore-dangle */
import { message, Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getCryptosPriceHistory,
  getIsLoaded,
  getUserLocation,
} from '../reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import './Rewards.less';
import {
  activateCampaign,
  assignProposition,
  declineProposition,
  getCoordinates,
} from '../user/userActions';
import CreateRewardForm from './Create/CreateRewardForm';
import RewardsFiltersPanel from './RewardsFiltersPanel/RewardsFiltersPanel';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getTextByFilterKey, preparePropositionReqData } from './rewardsHelper';
import Loading from '../components/Icon/Loading';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Proposition from './Proposition/Proposition';
import Campaign from './Campaign/Campaign';
import Avatar from '../components/Avatar';
import Manage from './Manage/Manage';
import RewardBreadcrumb from './RewardsBreadcrumb/RewardBreadcrumb';
import SortSelector from '../components/SortSelector/SortSelector';
import MapWrap from '../components/Maps/MapWrap/MapWrap';

@withRouter
@injectIntl
@connect(
  state => ({
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
    userLocation: getUserLocation(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    user: getAuthenticatedUser(state),
  }),
  { assignProposition, declineProposition, getCoordinates, activateCampaign },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    // activateCampaign: PropTypes.func.isRequired,
    // declineProposition: PropTypes.func.isRequired,
    userLocation: PropTypes.shape(),
    getCoordinates: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    username: '',
    userLocation: {},
  };

  state = {
    loading: false,
    loadingCampaigns: false,
    loadingAssignDiscard: false,
    hasMore: true,
    propositions: [],
    sponsors: [],
    sort: 'reward',
    radius: 50000000,
    coordinates: [],
    campaignsTypes: [],
    isModalDetailsOpen: false,
    objectDetails: {},
    activeFilters: { guideNames: [], types: [] },
  };

  componentDidMount() {
    if (!_.size(this.props.userLocation)) {
      this.props.getCoordinates();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    if (match.params.filterKey !== 'create') {
      const { username } = this.props;
      const { radius, coordinates, sort, activeFilters } = this.state;
      if (
        (match.params.filterKey !== this.props.match.params.filterKey ||
          nextProps.match.params.campaignParent !== this.props.match.params.campaignParent) &&
        username
      ) {
        this.setState({ loadingCampaigns: true }, () => {
          this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
        });
      }
    } else this.setState({ propositions: [{}] }); // for map, not equal propositions
  }

  getRequiredObjects = () =>
    _.map(this.state.propositions, proposition => proposition.required_object);

  getAreaSearchData = ({ radius, coordinates }) => {
    const { username, match } = this.props;
    const { sort, activeFilters } = this.state;
    this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
  };

  getCampaignsLayout = (
    hasMore,
    IsRequiredObjectWrap,
    loading,
    filterKey,
    username,
    match,
    propositions,
  ) =>
    !this.state.loadingCampaigns ? (
      <React.Fragment>
        <RewardBreadcrumb
          tabText={getTextByFilterKey(this.props.intl, filterKey)}
          filterKey={filterKey}
          reqObject={
            !IsRequiredObjectWrap && propositions && propositions[0]
              ? propositions[0].required_object
              : null
          }
        />
        <SortSelector sort={this.state.sort} onChange={this.handleSortChange}>
          <SortSelector.Item key="reward">
            <FormattedMessage id="rewards" defaultMessage="rewards">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
          <SortSelector.Item key="date">
            <FormattedMessage id="date" defaultMessage="date">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
        </SortSelector>
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={this.handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {this.campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, username, match)}
        </ReduxInfiniteScroll>
      </React.Fragment>
    ) : (
      <Loading />
    );

  setFilterValue = (filter, key) => {
    const { username, match } = this.props;
    const { radius, coordinates, sort } = this.state;
    const activeFilters = this.state.activeFilters;
    if (_.includes(activeFilters[key], filter)) {
      _.remove(activeFilters[key], f => f === filter);
    } else {
      activeFilters[key].push(filter);
    }
    this.setState({ loadingCampaigns: true });
    this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
  };

  getPropositions = ({ username, match, coordinates, radius, sort, activeFilters }) => {
    ApiClient.getPropositions(
      preparePropositionReqData({
        username,
        match,
        coordinates,
        radius,
        sort,
        guideNames: activeFilters.guideNames,
        types: activeFilters.types,
      }),
    ).then(data => {
      this.setState({
        propositions: data.campaigns,
        hasMore: data.hasMore,
        sponsors: data.sponsors,
        campaignsTypes: data.campaigns_types,
        coordinates,
        radius,
        sort,
        loadingCampaigns: false,
        loading: false,
      });
    });
  };

  setCoordinates = () => {
    const { username, match } = this.props;
    const { radius, coordinates, sort, activeFilters } = this.state;
    this.setState({ loadingCampaigns: true });
    this.getPropositions({
      username,
      match,
      coordinates: _.isEmpty(coordinates)
        ? [+this.props.userLocation.lat, +this.props.userLocation.lon]
        : coordinates,
      radius,
      sort,
      activeFilters,
    });
  };

  handleSortChange = sort => {
    const { radius, coordinates, activeFilters } = this.state;
    const { username, match } = this.props;
    this.setState({ loadingCampaigns: true });
    this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
  };

  // Propositions
  assignProposition = (proposition, obj) => {
    this.setState({ loadingAssignDiscard: true });
    this.props
      .assignProposition(proposition._id, [obj.author_permlink])
      .then(() => {
        const updatedPropositions = this.updateProposition(
          proposition._id,
          true,
          obj.author_permlink,
        );
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully',
            defaultMessage: 'Assigned successfully',
          }),
        );
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(e => {
        message.error(e.toString());
        this.setState({ loadingAssignDiscard: false });
      });
  };
  updateProposition = (propsId, isAssign, objPermlink) =>
    _.map(this.state.propositions, propos => {
      // eslint-disable-next-line no-param-reassign
      if (propos._id === propsId) {
        _.map(propos.users, user => {
          if (user.name === this.props.username) {
            if (_.includes(user.approved_objects, objPermlink)) {
              const newUser = user;
              newUser.approved_objects = _.filter(user.approved_objects, o => o !== objPermlink);
              return newUser;
            }
            return user.approved_objects.push(objPermlink);
          }
          return user;
        });
      }
      return propos;
    });

  toggleModal = proposition => {
    this.setState({
      isModalDetailsOpen: !this.state.isModalDetailsOpen,
      objectDetails: !this.state.isModalDetailsOpen ? proposition : {},
    });
  };

  discardProposition = (proposition, obj) => {
    this.setState({ loadingAssignDiscard: true });
    this.discardProposition(proposition._id, obj.author_permlink)
      .then(() => {
        const updatedPropositions = this.updateProposition(
          proposition._id,
          false,
          obj.author_permlink,
        );
        message.success(
          this.props.intl.formatMessage({
            id: 'discarded_successfully',
            defaultMessage: 'Discarded successfully',
          }),
        );
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(e => {
        message.error(e.toString());
        this.setState({ loadingAssignDiscard: false });
      });
  };
  // END Propositions

  campaignsLayoutWrapLayout = (IsRequiredObjectWrap, filterKey, userName) => {
    const { propositions, isModalDetailsOpen, loadingAssignDiscard } = this.state;
    const { intl } = this.props;
    if (_.size(propositions) !== 0) {
      if (IsRequiredObjectWrap) {
        return _.map(
          propositions,
          proposition =>
            proposition &&
            proposition.required_object && (
              <Campaign
                proposition={proposition}
                filterKey={filterKey}
                key={`${proposition.required_object.author_permlink}${proposition.required_object.createdAt}`}
                userName={userName}
              />
            ),
        );
      }
      return _.map(propositions, proposition =>
        _.map(
          proposition.objects,
          wobj =>
            wobj.object &&
            wobj.object.author_permlink && (
              <Proposition
                guide={proposition.guide}
                proposition={proposition}
                wobj={wobj.object}
                assignProposition={() => this.assignProposition(proposition, wobj.object)}
                discardProposition={this.discardProposition}
                authorizedUserName={userName}
                loading={loadingAssignDiscard}
                key={`${wobj.object.author_permlink}`}
                isModalDetailsOpen={isModalDetailsOpen}
                toggleModal={this.toggleModal}
                assigned={wobj.assigned}
              />
            ),
        ),
      );
    }
    return `${intl.formatMessage(
      { id: 'noProposition', defaultMessage: `There are no propositions` },
      { userName },
    )}`;
  };

  goToCampaign = WobjPermlink => {
    this.props.history.push(`/rewards/active/${WobjPermlink}`);
  };

  handleLoadMore = () => {
    const { propositions, hasMore, radius, coordinates, sort, activeFilters } = this.state;
    const { username, match } = this.props;
    if (hasMore) {
      this.setState(
        {
          loading: true,
        },
        () => {
          const reqData = preparePropositionReqData({ username, match, coordinates, radius, sort });
          reqData.skip = propositions.length;
          ApiClient.getPropositions(reqData).then(newPropositions =>
            this.setState({
              loading: false,
              hasMore: newPropositions.campaigns && newPropositions.hasMore,
              propositions: this.state.propositions.concat(newPropositions.campaigns),
              sponsors: newPropositions.sponsors,
              campaignsTypes: newPropositions.campaigns_types,
              guideNames: activeFilters.guideNames,
              types: activeFilters.types,
            }),
          );
        },
      );
    }
  };

  campaignItemsWrap = location => {
    const { match, username, intl, cryptosPriceHistory, user } = this.props;
    const { loading, hasMore, propositions } = this.state;
    const filterKey = match.params.filterKey;
    const IsRequiredObjectWrap = !match.params.campaignParent;
    const currentSteemDollarPrice =
      cryptosPriceHistory && cryptosPriceHistory.SBD && cryptosPriceHistory.SBD.priceDetails
        ? cryptosPriceHistory.SBD.priceDetails.currentUSDPrice
        : 0;
    if (location.pathname === '/rewards/create') {
      return (
        <CreateRewardForm
          userName={username}
          user={user}
          intl={intl}
          currentSteemDollarPrice={currentSteemDollarPrice}
        />
      );
    } else if (location.pathname === '/rewards/manage') {
      return <Manage intl={intl} userName={username} />;
    }
    return this.getCampaignsLayout(
      hasMore,
      IsRequiredObjectWrap,
      loading,
      filterKey,
      username,
      match,
      propositions,
    );
  };

  render() {
    const { location } = this.props;
    const {
      sponsors,
      isModalDetailsOpen,
      objectDetails,
      campaignsTypes,
      activeFilters,
    } = this.state;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    const isCreate = location.pathname === '/rewards/create';
    return (
      <div className="Rewards">
        <Helmet>
          <title>Waivio</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={122}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">{this.campaignItemsWrap(location)}</div>
          {location.pathname !== '/rewards/manage' && (
            <Affix className="rightContainer leftContainer__user" stickPosition={122}>
              <div className="right">
                {!_.isEmpty(this.props.userLocation) && !isCreate && (
                  <React.Fragment>
                    <MapWrap
                      wobjects={this.getRequiredObjects()}
                      userLocation={this.props.userLocation}
                      onMarkerClick={this.goToCampaign}
                      getAreaSearchData={this.getAreaSearchData}
                    />
                  </React.Fragment>
                )}
                {!_.isEmpty(sponsors) && !isCreate && (
                  <RewardsFiltersPanel
                    campaignsTypes={campaignsTypes}
                    sponsors={sponsors}
                    activeFilters={activeFilters}
                    setFilterValue={this.setFilterValue}
                  />
                )}
              </div>
            </Affix>
          )}
        </div>
        {isModalDetailsOpen && !_.isEmpty(objectDetails) && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'details',
              defaultMessage: 'Details',
            })}
            closable
            onCancel={this.toggleModal}
            maskClosable={false}
            visible={this.state.isModalDetailsOpen}
            wrapClassName="Rewards-modal"
            footer={null}
          >
            <div className="Proposition__title">{objectDetails.name}</div>
            <div className="Proposition__header">
              <div className="Proposition__-type">{`Sponsored: ${objectDetails.type}`}</div>
              <div className="Proposition__reward">{`Reward: $${objectDetails.reward}`}</div>
            </div>
            <div className="Proposition__footer">
              <div className="Proposition__author">
                <div className="Proposition__author-title">{`Sponsor`}:</div>
                <div className="Rewards-modal__user-card">
                  <Link to={`/@${objectDetails.guide.name}`}>
                    <Avatar username={objectDetails.guide.name} size={34} />
                  </Link>
                  <Link to={`/@${objectDetails.guide.name}`} title={objectDetails.guide.name}>
                    <span className="username">{objectDetails.guide.name}</span>
                  </Link>
                </div>
              </div>
              <div>{`Paid rewards: ${objectDetails.payed}$ (${objectDetails.payedPercent}%)`}</div>
            </div>
            <div className="Proposition__body">
              <div className="Proposition__body-description">{objectDetails.description}</div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default Rewards;
