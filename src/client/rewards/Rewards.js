/* eslint-disable no-underscore-dangle */
import { message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { isEmpty, map, size, includes, remove, find } from 'lodash';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getCryptosPriceHistory, getFilteredObjectsMap,
  getIsLoaded,
  getUserLocation,
} from '../reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import {
  activateCampaign,
  assignProposition,
  declineProposition,
  getCoordinates,
} from '../user/userActions';
import RewardsFiltersPanel from './RewardsFiltersPanel/RewardsFiltersPanel';
import * as ApiClient from '../../waivioApi/ApiClient';
import { preparePropositionReqData } from './rewardsHelper';
import Proposition from './Proposition/Proposition';
import Campaign from './Campaign/Campaign';
import MapWrap from '../components/Maps/MapWrap/MapWrap';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
// eslint-disable-next-line import/extensions
import * as apiConfig from '../../waivioApi/config';
import './Rewards.less';
import { getObjectTypeMap } from '../objectTypes/objectTypeActions';

@withRouter
@injectIntl
@connect(
  state => ({
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
    userLocation: getUserLocation(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    user: getAuthenticatedUser(state),
    wobjects: getFilteredObjectsMap(state),
  }),
  { assignProposition, declineProposition, getCoordinates, activateCampaign, getObjectTypeMap },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    // activateCampaign: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    userLocation: PropTypes.shape(),
    getCoordinates: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getObjectTypeMap: PropTypes.func.isRequired,
    wobjects: PropTypes.array,
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
    objectDetails: {},
    activeFilters: { guideNames: [], types: [] },
    activePayableFilters: [],
    isSearchAreaFilter: false,
  };

  componentDidMount() {
    const { username, match, userLocation, history } = this.props;
    const { radius, coordinates, sort, activeFilters } = this.state;
    if (!size(userLocation)) {
      this.props.getCoordinates();
    }
    if (!username) {
      this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
      if (!match.params.campaignParent || match.params.filterKey !== 'all') {
        history.push(`/rewards/all`);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;

    if (match.path !== this.props.match.path) {
      this.setState({ activePayableFilters: [] });
    }
    if (match.params.filterKey !== 'create') {
      const { radius, coordinates, sort, activeFilters } = this.state;
      if (
        match.params.filterKey !== this.props.match.params.filterKey ||
        nextProps.match.params.campaignParent !== this.props.match.params.campaignParent
      ) {
        this.setState({ loadingCampaigns: true }, () => {
          this.getPropositions({
            username: nextProps.username,
            match,
            coordinates,
            radius,
            sort,
            activeFilters,
          });
        });
      }
    } else this.setState({ propositions: [{}] }); // for map, not equal propositions
  }

  componentDidUpdate(prevProps, prevState) {
    const { username, match } = this.props;
    const { radius, coordinates, sort, activeFilters, isSearchAreaFilter } = this.state;
    if (prevState.isSearchAreaFilter && !isSearchAreaFilter && username) {
      this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
    }
    if (prevProps.username !== username && !username) {
      this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
      this.props.history.push(`/rewards/all`);
    }
  }

  setMapArea = mapArea => this.props.getObjectTypeMap(mapArea);

  getRequiredObjects = () =>
    this.props.wobjects.filter(wobj => !isEmpty(wobj.map));

  getAreaSearchData = ({ radius, coordinates }) => {
    const { username, match } = this.props;
    const { sort, activeFilters } = this.state;
    this.getPropositions({ username, match, area: coordinates, radius, sort, activeFilters });
  };

  setFilterValue = (filter, key) => {
    const { username, match } = this.props;
    const { radius, coordinates, sort } = this.state;
    const activeFilters = this.state.activeFilters;
    if (includes(activeFilters[key], filter)) {
      remove(activeFilters[key], f => f === filter);
    } else {
      activeFilters[key].push(filter);
    }
    this.setState({ loadingCampaigns: true });
    this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
  };

  setPayablesFilterValue = filter => {
    const activeFilters = [...this.state.activePayableFilters];
    if (find(activeFilters, ['filterName', filter.filterName])) {
      this.setState({
        activePayableFilters: activeFilters.filter(f => f.filterName !== filter.filterName),
      });
    } else {
      activeFilters.push(filter);
      this.setState({ activePayableFilters: activeFilters });
    }
  };

  getPropositions = ({ username, match, coordinates, area, radius, sort, activeFilters }) => {
    ApiClient.getPropositions(
      preparePropositionReqData({
        username,
        match,
        coordinates,
        area,
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
        isSearchAreaFilter: Boolean(area),
        sort,
        loadingCampaigns: false,
        loading: false,
      });
    });
  };

  resetMapFilter = () => {
    const { username, match } = this.props;
    const { radius, coordinates, sort, activeFilters } = this.state;
    this.setState({ loadingCampaigns: true });
    this.getPropositions({
      username,
      match,
      coordinates: isEmpty(coordinates)
        ? [+this.props.userLocation.lat, +this.props.userLocation.lon]
        : coordinates,
      radius,
      sort,
      activeFilters,
    });
    this.setState({ isSearchAreaFilter: false });
  };

  handleSortChange = sort => {
    const { radius, coordinates, activeFilters } = this.state;
    const { username, match } = this.props;
    this.setState({ loadingCampaigns: true });
    this.getPropositions({ username, match, coordinates, radius, sort, activeFilters });
  };

  // Propositions
  assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    companyId,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    this.setState({ loadingAssignDiscard: true });
    this.props
      .assignProposition({ companyAuthor, companyPermlink, objPermlink, resPermlink, appName })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully',
            defaultMessage: 'Assigned successfully',
          }),
        );
        const updatedPropositions = this.updateProposition(
          companyId,
          true,
          objPermlink,
          companyAuthor,
        );
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(() => {
        message.error(
          this.props.intl.formatMessage({
            id: 'cannot_reserve_company',
            defaultMessage: 'You cannot reserve the campaign at the moment',
          }),
        );
        this.setState({ loadingAssignDiscard: false });
      });
  };

  // eslint-disable-next-line consistent-return
  updateProposition = (propsId, isAssign, objPermlink, companyAuthor) => {
    const newPropos = this.state.propositions.map(proposition => {
      if (proposition._id === propsId) {
        proposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            // eslint-disable-next-line no-param-reassign
            proposition.objects[index].assigned = isAssign;
          } else {
            // eslint-disable-next-line no-param-reassign
            proposition.objects[index].assigned = null;
          }
        });
      }
      if (proposition.guide.name === companyAuthor && proposition._id !== propsId) {
        // eslint-disable-next-line no-param-reassign
        proposition.isReservedSiblingObj = true;
      }
      return proposition;
    });
    return newPropos;
  };

  discardProposition = ({
    companyAuthor,
    companyPermlink,
    companyId,
    objPermlink,
    unreservationPermlink,
    reservationPermlink,
  }) => {
    this.setState({ loadingAssignDiscard: true });
    this.props
      .declineProposition({
        companyAuthor,
        companyPermlink,
        companyId,
        objPermlink,
        unreservationPermlink,
        reservationPermlink,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'discarded_successfully',
            defaultMessage: 'Reservation released',
          }),
        );
        const updatedPropositions = this.updateProposition(companyId, false, objPermlink);
        this.props.history.push(`/rewards/active`);
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(e => {
        console.log(e.toString());
        message.error(
          this.props.intl.formatMessage({
            id: 'cannot_reject_campaign',
            defaultMessage: 'You cannot reject the campaign at the moment',
          }),
        );
        this.setState({ loadingAssignDiscard: false });
      });
  };
  // END Propositions

  campaignsLayoutWrapLayout = (IsRequiredObjectWrap, filterKey, userName) => {
    const { propositions, loadingAssignDiscard } = this.state;
    const { intl } = this.props;
    if (size(propositions) !== 0) {
      if (IsRequiredObjectWrap) {
        return map(
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

      return map(propositions, proposition =>
        map(
          proposition.objects,
          wobj =>
            wobj.object &&
            wobj.object.author_permlink && (
              <Proposition
                guide={proposition.guide}
                proposition={proposition}
                wobj={wobj.object}
                assignCommentPermlink={wobj.permlink}
                assignProposition={this.assignPropositionHandler}
                discardProposition={this.discardProposition}
                authorizedUserName={userName}
                loading={loadingAssignDiscard}
                key={`${wobj.object.author_permlink}`}
                assigned={wobj.assigned}
              />
            ),
        ),
      );
    }
    return `${intl.formatMessage({
      id: 'noProposition',
      defaultMessage: `No reward matches the criteria`,
    })}`;
  };

  goToCampaign = WobjPermlink => {
    this.props.history.push(`/rewards/active/${WobjPermlink}`);
  };

  handleLoadMore = () => {
    const { propositions, hasMore, radius, coordinates, sort, activeFilters } = this.state;
    const { username, match } = this.props;
    if (hasMore && username) {
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

  render() {
    const { location, intl, match, username, cryptosPriceHistory, user } = this.props;
    const {
      sponsors,
      campaignsTypes,
      activeFilters,
      isSearchAreaFilter,
      hasMore,
      loading,
      propositions,
      activePayableFilters,
      sort,
      loadingCampaigns,
    } = this.state;

    const IsRequiredObjectWrap = !match.params.campaignParent;
    const filterKey = match.params.filterKey;
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    const isCreate = location.pathname === '/rewards/create';
    const currentSteemPrice =
      cryptosPriceHistory && cryptosPriceHistory.STEEM && cryptosPriceHistory.STEEM.priceDetails
        ? cryptosPriceHistory.STEEM.priceDetails.currentUSDPrice
        : 0;

    const renderedRoutes = renderRoutes(this.props.route.routes, {
      user,
      currentSteemPrice,
      hasMore,
      IsRequiredObjectWrap,
      loading,
      filterKey,
      userName: username,
      match,
      propositions,
      intl,
      isSearchAreaFilter,
      resetMapFilter: this.resetMapFilter,
      sort,
      handleSortChange: this.handleSortChange,
      loadingCampaigns,
      campaignsLayoutWrapLayout: this.campaignsLayoutWrapLayout,
      handleLoadMore: this.handleLoadMore,
      filterData: activePayableFilters,
    });

    return (
      <div className="Rewards">
        <div className="shifted">
          <Helmet>
            <title>Waivio</title>
            <meta
              property="og:title"
              content={`${intl.formatMessage({
                id: 'rewards',
                defaultMessage: 'Rewards',
              })} - Waivio`}
            />
            <meta property="og:type" content="article" />
            <meta
              property="og:image"
              content={
                'https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png'
              }
            />
            <meta property="og:site_name" content="Waivio" />
            <meta name="robots" content={robots} />
          </Helmet>
          <ScrollToTop />
          <ScrollToTopOnMount />
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <div className="center">
              <MobileNavigation />
              {renderedRoutes}
            </div>
            {(match.path === '/rewards/payables' || match.path === '/rewards/receivables') && (
              <Affix className="rightContainer leftContainer__user" stickPosition={77}>
                <div className="right">
                  <RewardsFiltersPanel
                    campaignsTypes={campaignsTypes}
                    sponsors={sponsors}
                    activeFilters={activeFilters}
                    activePayableFilters={activePayableFilters}
                    setFilterValue={this.setFilterValue}
                    setPayablesFilterValue={this.setPayablesFilterValue}
                    location={location}
                  />
                </div>
              </Affix>
            )}
            {match.path === '/rewards/:filterKey/:campaignParent?' && (
              <Affix className="rightContainer leftContainer__user" stickPosition={77}>
                <div className="right">
                  {!isEmpty(this.props.userLocation) && !isCreate && (
                    <MapWrap
                      setMapArea={this.setMapArea}
                      wobjects={this.getRequiredObjects()}
                      userLocation={this.props.userLocation}
                      onMarkerClick={this.goToCampaign}
                      getAreaSearchData={this.getAreaSearchData}
                    />
                  )}
                  {!isEmpty(sponsors) && !isCreate && (
                    <RewardsFiltersPanel
                      campaignsTypes={campaignsTypes}
                      sponsors={sponsors}
                      activeFilters={activeFilters}
                      activePayableFilters={activePayableFilters}
                      setFilterValue={this.setFilterValue}
                      setPayablesFilterValue={this.setPayablesFilterValue}
                      location={location}
                    />
                  )}
                </div>
              </Affix>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Rewards.propTypes = {
  route: PropTypes.shape().isRequired,
};

export default Rewards;
