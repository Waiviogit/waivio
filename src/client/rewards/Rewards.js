/* eslint-disable no-underscore-dangle */
import { message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import {
  isEmpty,
  map,
  size,
  includes,
  remove,
  flatten,
  uniqBy,
  get,
  filter,
  isEqual,
  findIndex,
} from 'lodash';
import { HBD } from '../../common/constants/cryptos';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getCryptosPriceHistory,
  getObjectsMap,
  getIsLoaded,
  getUserLocation,
  getPendingUpdate,
  getIsMapModalOpen,
  getSuitableLanguage,
  getUpdatedMap,
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
  pendingUpdateSuccess,
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
import {
  setUpdatedFlag,
  resetUpdatedFlag,
  getPropositionsForMap,
} from '../components/Maps/mapActions';
import { delay } from './rewardsHelpers';
import { RADIUS } from '../../common/constants/map';
import { getClientWObj } from '../adapters';
import { getWobjectsWithMaxWeight } from '../object/wObjectHelper';
import { getZoom } from '../components/Maps/mapHelper';

@withRouter
@injectIntl
@connect(
  state => ({
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
    userLocation: getUserLocation(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    user: getAuthenticatedUser(state),
    wobjects: getObjectsMap(state),
    pendingUpdate: getPendingUpdate(state),
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
    updated: getUpdatedMap(state),
  }),
  {
    assignProposition,
    declineProposition,
    getCoordinates,
    activateCampaign,
    getObjectsMap,
    pendingUpdateSuccess,
    resetUpdatedFlag,
    setUpdatedFlag,
    getPropositionsForMap,
  },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
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
    pendingUpdate: PropTypes.bool.isRequired,
    pendingUpdateSuccess: PropTypes.func.isRequired,
    resetUpdatedFlag: PropTypes.func,
    setUpdatedFlag: PropTypes.func.isRequired,
    getPropositionsForMap: PropTypes.func.isRequired,
    wobjects: PropTypes.arrayOf(PropTypes.shape()),
    updated: PropTypes.bool,
  };

  static defaultProps = {
    username: '',
    userLocation: {},
    wobjects: [],
    resetUpdatedFlag: () => {},
    updated: false,
  };

  state = {
    loading: false,
    loadingCampaigns: false,
    loadingAssignDiscard: false,
    hasMore: false,
    propositions: [],
    sponsors: [],
    sort: 'proximity',
    radius: RADIUS,
    area: [],
    campaignsTypes: [],
    objectDetails: {},
    activeFilters: { guideNames: [], types: [] },
    activePayableFilters: [],
    activeMessagesFilters: { caseStatus: 'all', rewards: [], status: [], messagesSponsors: [] },
    isSearchAreaFilter: false,
    isAssign: false,
    messagesSponsors: [],
    messages: [],
    zoomMap: 0,
  };

  componentDidMount() {
    const { username, match, userLocation, history } = this.props;
    const { area, activeFilters, sort } = this.state;
    if (!size(userLocation)) {
      this.props.getCoordinates();
    }
    if (!isEmpty(userLocation) && !isEmpty(match.params)) {
      this.getPropositions({
        username,
        match,
        area: [+userLocation.lat, +userLocation.lon],
        sort,
        activeFilters,
      });
    }
    if (!username) {
      this.getPropositions({ username, match, area, sort, activeFilters });
      if (!match.params.campaignParent || match.params.filterKey !== 'all') {
        history.push(`/rewards/all`);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match, userLocation } = nextProps;
    const { username } = this.props;
    const { area, activeFilters, activeMessagesFilters } = this.state;
    const needPropositions =
      isEqual(this.props.match, match) &&
      !isEmpty(match.params) &&
      !isEmpty(this.props.match.params);
    let sort = this.state.sort;
    if (match.params.filterKey === 'messages') sort = 'inquiryDate';
    if (match.params.filterKey === 'history') sort = 'reservation';
    if (
      (this.props.match.params.filterKey === 'messages' &&
        match.params.filterKey !== 'history' &&
        match.params.filterKey !== 'messages') ||
      (this.props.match.params.filterKey === 'history' &&
        match.params.filterKey !== 'messages' &&
        match.params.filterKey !== 'history')
    )
      sort = 'reward';

    if (isEmpty(this.props.userLocation) && !isEmpty(userLocation) && needPropositions) {
      this.getPropositions({
        username,
        match,
        area: [+userLocation.lat, +userLocation.lon],
        sort,
        activeFilters,
      });
    }
    if (match.path !== this.props.match.path) {
      this.setState({ activePayableFilters: [] });
    }
    if (
      match.path !== this.props.match.path ||
      match.params.filterKey !== this.props.match.params.filterKey
    ) {
      this.props.resetUpdatedFlag();
    }
    if (
      match.params.filterKey === 'all' ||
      match.params.filterKey === 'active' ||
      match.params.filterKey === 'reserved' ||
      match.params.filterKey === 'history'
    ) {
      if (
        (match.params.filterKey !== this.props.match.params.filterKey &&
          match.params.filterKey !== 'messages' &&
          match.params.filterKey !== 'history') ||
        nextProps.match.params.campaignParent !== this.props.match.params.campaignParent
      ) {
        this.setState({ loadingCampaigns: true }, () => {
          this.getPropositions({
            username: nextProps.username,
            match,
            area,
            sort,
            activeFilters,
          });
        });
      }
    } else this.setState({ propositions: [{}], zoomMap: 0 }); // for map, not equal propositions
    if (match.params.filterKey === 'history' || match.params.filterKey === 'messages') {
      this.getMessages({ username, sort, activeMessagesFilters });
    }
  }

  componentDidUpdate(prevProps) {
    const { username, match, pendingUpdate } = this.props;
    const { area, sort, activeFilters } = this.state;
    if (prevProps.username !== username && !username) {
      this.getPropositions({ username, match, area, sort, activeFilters });
      this.props.history.push(`/rewards/all`);
    }
    if (
      pendingUpdate &&
      prevProps.match.params.filterKey !== match.params.filterKey &&
      prevProps.match !== this.props.match
    ) {
      this.props.pendingUpdateSuccess();
      delay(6000).then(() => {
        this.getPropositions({ username, match, area, sort, activeFilters });
      });
    }
  }

  setMapArea = ({ radius, coordinates, isMap, isSecondaryObjectsCards }) => {
    const { username, match, isFullscreenMode, updated } = this.props;
    const { radiusMap } = this.state;
    const newRadius = !updated ? radius : radiusMap;
    const limit = isFullscreenMode ? 200 : 50;
    const { activeFilters } = this.state;
    if (!isSecondaryObjectsCards) {
      this.getPropositions(
        { username, match, area: coordinates, radius: newRadius, activeFilters, limit },
        isMap,
        updated,
      );
    }
  };

  getRequiredObjects = () =>
    this.state.propositions &&
    this.state.propositions
      .filter(proposition => proposition.required_object)
      .map(proposition => ({ ...proposition.required_object, campaigns: {} })); // add 'campaigns' prop to display objects on the map with proper marker

  getAreaSearchData = ({ radius, coordinates }) => {
    this.setState({ isSearchAreaFilter: true, loadingCampaigns: true });
    const { username, match } = this.props;
    const { sort, activeFilters } = this.state;
    this.getPropositions({ username, match, area: coordinates, radius, sort, activeFilters });
  };

  setFilterValue = (filterValue, key) => {
    const { username, match } = this.props;
    const { area, sort } = this.state;
    const activeFilters = this.state.activeFilters;
    const activeMessagesFilters = this.state.activeMessagesFilters;
    if (key === 'types' || key === 'guideNames') {
      if (includes(activeFilters[key], filterValue)) {
        remove(activeFilters[key], f => f === filterValue);
      } else {
        activeFilters[key].push(filterValue);
      }
    }
    if (key === 'rewards' || key === 'caseStatus' || key === 'messagesSponsors') {
      if (includes(activeMessagesFilters[key], filterValue)) {
        remove(activeMessagesFilters[key], f => f === filterValue);
      } else if (key === 'caseStatus') {
        activeMessagesFilters[key] = filterValue;
      } else {
        activeMessagesFilters[key].push(filterValue);
      }
    }
    this.setState({ loadingCampaigns: true });
   if (
      this.props.match.params.filterKey !== 'messages' &&
      this.props.match.params.filterKey !== 'history'
    )
      this.getPropositions({ username, match, area, sort, activeFilters });
    this.getMessages({ sort, activeMessagesFilters });
  };

  setPayablesFilterValue = filterValue => {
    let activeFilters = [...this.state.activePayableFilters];
    switch (filterValue.filterName) {
      case 'payable':
        if (findIndex(activeFilters, { filterName: 'payable' }) === -1) {
          activeFilters.push(filterValue);
        } else {
          remove(activeFilters, { filterName: 'payable' });
        }
        this.setState({ activePayableFilters: activeFilters });
        break;
      case 'days':
      case 'moreDays':
      default:
        if (findIndex(activeFilters, { filterName: filterValue.filterName }) === -1) {
          activeFilters = filter(
            activeFilters,
            item => item.filterName !== 'days' && item.filterName !== 'moreDays',
          );
          activeFilters.push(filterValue);
        } else {
          remove(activeFilters, { filterName: filterValue.filterName });
        }
        this.setState({ activePayableFilters: activeFilters });
    }
  };

  getPropositions = (
    { username, match, area, radius, sort, activeFilters, limit },
    isMap,
    updated,
  ) => {
    ApiClient.getPropositions(
      preparePropositionReqData({
        username,
        match,
        area,
        radius,
        sort,
        guideNames: activeFilters.guideNames,
        types: activeFilters.types,
        limit,
        simplified: !!isMap,
        firstMapLoad: !!isMap && !updated,
      }),
    ).then(data => {
      this.props.setUpdatedFlag();
      this.setState({
        sponsors: data.sponsors,
        campaignsTypes: data.campaigns_types,
        area,
        radius,
        loading: false,
      });
      if (isMap) {
        this.props.getPropositionsForMap(data.campaigns);
      } else {
        this.setState({
          propositions: data.campaigns,
          hasMore: data.hasMore,
          loadingCampaigns: false,
        });
      }
      if (!!isMap && !updated) {
        const zoomMap = getZoom(data.radius);
        this.setState({
          zoomMap,
        });
      }
    });
  };

  getMessages = ({ username, sort, activeMessagesFilters }) => {
    const requestData = {
      onlyWithMessages: true,
      sort,
      caseStatus: activeMessagesFilters.caseStatus,
      rewards: activeMessagesFilters.rewards,
      status: activeMessagesFilters.status,
      guideNames: activeMessagesFilters.messagesSponsors,
    };
    if (sort === 'reservation') {
      requestData.userName = username;
    } else {
      requestData.guideName = username;
    }
    this.setState({ loadingCampaigns: true });
    ApiClient.getMessages(requestData).then(data => {
      const sponsors = map(uniqBy(data.campaigns, 'guideName'), campaign => campaign.guideName);
      this.setState({
        messages: data.campaigns,
        sort,
        messagesSponsors: sponsors,
        loading: false,
        loadingCampaigns: false,
      });
    });
  };

  resetMapFilter = () => {
    const { username, match } = this.props;
    const { area, sort, activeFilters } = this.state;
    this.setState({ loadingCampaigns: true });
    this.getPropositions({
      username,
      match,
      area: isEmpty(area) ? [+this.props.userLocation.lat, +this.props.userLocation.lon] : area,
      sort,
      activeFilters,
    });
    this.setState({ isSearchAreaFilter: false });
  };

  handleSortChange = sort => {
    const { radius, area, activeFilters, activeMessagesFilters } = this.state;
    const { username, match } = this.props;
    this.setState({ loadingCampaigns: true, sort });
    if (match.params.filterKey !== 'messages' && match.params.filterKey !== 'history') {
      this.getPropositions({ username, match, radius, area, sort, activeFilters });
    }
    this.getMessages({ sort, activeMessagesFilters });
  };

  // Propositions
  assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    companyId,
    primaryObjectName,
    secondaryObjectName,
    amount,
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
        primaryObjectName,
        secondaryObjectName,
        amount,
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

  // eslint-disable-next-line consistent-return
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
    requiredObjectName,
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
        requiredObjectName,
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
        console.log(e.toString());
        message.error(e.error_description);
        this.setState({ loadingAssignDiscard: false, isAssign: true });
      });
  };
  // END Propositions

  campaignsLayoutWrapLayout = (IsRequiredObjectWrap, filterKey, userName, match) => {
    const { propositions, loadingAssignDiscard, isAssign, messages } = this.state;
    const actualPropositions = match.params.filterKey !== 'history' ? propositions : messages;
    const { intl } = this.props;
    if (size(actualPropositions) !== 0) {
      if (IsRequiredObjectWrap) {
        return map(
          actualPropositions,
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

      return map(actualPropositions, proposition =>
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
                history={this.props.history}
                isAssign={isAssign}
                match={this.props.match}
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

  goToCampaign = wobjPermlink => {
    const { match } = this.props;
    const campaignParent = get(match, ['params', 'campaignParent']);
    const filterKey = get(match, ['params', 'filterKey']);
    this.props.history.push(
      campaignParent ? `/object/${wobjPermlink}` : `/rewards/${filterKey}/${wobjPermlink}`,
    );
  };

  handleLoadMore = () => {
    const {
      propositions,
      hasMore,
      sort,
      area,
      activeFilters,
      radius,
      isSearchAreaFilter,
    } = this.state;
    const { username, match } = this.props;
    if (hasMore) {
      this.setState(
        {
          loading: true,
        },
        () => {
          const reqData = preparePropositionReqData({
            username,
            match,
            sort,
            area,
            ...activeFilters,
          });
          reqData.skip = propositions.length;
          if (isSearchAreaFilter) reqData.radius = radius;
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

  getCampaignsObjectsForMap = () => {
    const { propositions } = this.state;
    const secondaryObjects = flatten(
      map(propositions, proposition => map(proposition.objects, object => object.object)),
    );
    const secondaryObjectsForMap = uniqBy(secondaryObjects, 'author_permlink');
    const primaryObjectForMap = !isEmpty(secondaryObjectsForMap)
      ? get(propositions, ['0', 'required_object'])
      : {};
    const secondaryObjectsWithUniqueCoordinates = filter(
      secondaryObjectsForMap,
      object => object.map && !isEqual(object.map, primaryObjectForMap.map),
    );
    const secondaryObjectsWithWeight = getWobjectsWithMaxWeight(
      secondaryObjectsWithUniqueCoordinates,
    );
    const campaignsObjectsForMap = [primaryObjectForMap, ...secondaryObjectsWithWeight];

    return campaignsObjectsForMap;
  };

  moveToCoordinates = objects => {
    const { userLocation } = this.props;

    if (!isEmpty(objects)) {
      return get(objects, ['0', 'map', 'coordinates']) || get(objects, ['1', 'map', 'coordinates']);
    }
    if (userLocation.lat && userLocation.lon) {
      return [Number(userLocation.lon), Number(userLocation.lat)];
    }
    return [];
  };

  render() {
    const {
      location,
      intl,
      match,
      username,
      cryptosPriceHistory,
      user,
      userLocation,
      wobjects,
      usedLocale,
    } = this.props;
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
      zoomMap,
      activeMessagesFilters,
      messagesSponsors,
    } = this.state;

    const mapWobjects = map(wobjects, wobj => getClientWObj(wobj.required_object, usedLocale));
    const IsRequiredObjectWrap =
      !match.params.campaignParent && match.params.filterKey !== 'history';
    const filterKey = match.params.filterKey;
    const robots = location.pathname === 'index,follow';
    const isMessages = filterKey === 'messages';
    const isCreate =
      includes(location.pathname, 'create') ||
      includes(location.pathname, 'createDuplicate') ||
      includes(location.pathname, 'details');
    const currentSteemPrice =
      cryptosPriceHistory &&
      cryptosPriceHistory[HBD.coinGeckoId] &&
      cryptosPriceHistory[HBD.coinGeckoId].usdPriceHistory &&
      cryptosPriceHistory[HBD.coinGeckoId].usdPriceHistory.usd
        ? cryptosPriceHistory[HBD.coinGeckoId].usdPriceHistory.usd
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
      userLocation,
      sponsors,
      campaignsTypes,
      activeFilters,
      setFilterValue: this.setFilterValue,
      setPayablesFilterValue: this.setPayablesFilterValue,
    });

    const campaignParent = get(match, ['params', 'campaignParent']);
    const campaignsObjectsForMap = campaignParent ? this.getCampaignsObjectsForMap() : [];
    const primaryObjectCoordinates = this.moveToCoordinates(campaignsObjectsForMap);

    return (
      <div className="Rewards">
        <div className="shifted">
          <Helmet>
            <title>Waivio</title>
            <meta
              name="og:title"
              property="og:title"
              content={`${intl.formatMessage({
                id: 'rewards',
                defaultMessage: 'Rewards',
              })} - Waivio`}
            />
            <meta name="og:type" property="og:type" content="article" />
            <meta
              name="og:image"
              property="og:image"
              content={
                'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79'
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
                    activePayableFilters={activePayableFilters}
                    setPayablesFilterValue={this.setPayablesFilterValue}
                    location={location}
                  />
                </div>
              </Affix>
            )}
            {match.path === '/rewards/:filterKey/:campaignParent?' && (
              <Affix className="rightContainer leftContainer__user" stickPosition={77}>
                <div className="right">
                  {!isEmpty(this.props.userLocation) && !isCreate && !isMessages && (
                    <MapWrap
                      setMapArea={this.setMapArea}
                      userLocation={userLocation}
                      wobjects={campaignParent ? campaignsObjectsForMap : mapWobjects}
                      onMarkerClick={this.goToCampaign}
                      getAreaSearchData={this.getAreaSearchData}
                      match={match}
                      primaryObjectCoordinates={primaryObjectCoordinates}
                      zoomMap={zoomMap}
                    />
                  )}
                  {!isEmpty(propositions) && (
                    <RewardsFiltersPanel
                      campaignsTypes={campaignsTypes}
                      activeFilters={activeFilters}
                      activeMessagesFilters={activeMessagesFilters}
                      setFilterValue={this.setFilterValue}
                      location={location}
                      sponsors={sponsors}
                      messagesSponsors={messagesSponsors}
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
  isFullscreenMode: PropTypes.bool,
  usedLocale: PropTypes.string,
};

Rewards.defaultProps = {
  isFullscreenMode: false,
  usedLocale: 'en-US',
};

export default Rewards;
