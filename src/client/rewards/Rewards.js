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
  sortBy,
} from 'lodash';
import { HBD } from '../../common/constants/cryptos';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getCryptosPriceHistory,
  getObjectsMap,
  getIsLoaded,
  getUserLocation,
  getIsMapModalOpen,
  getSuitableLanguage,
  getPendingUpdate,
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
import { getPropositions } from '../../waivioApi/ApiClient';
import {
  preparePropositionReqData,
  getActiveFilters,
  getSortChanged,
  getSort,
} from './rewardsHelper';
import Proposition from './Proposition/Proposition';
import Campaign from './Campaign/Campaign';
import MapWrap from '../components/Maps/MapWrap/MapWrap';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
// eslint-disable-next-line import/extensions
import * as apiConfig from '../../waivioApi/config';
import { getRewardsGeneralCounts } from '../rewards/rewardsActions';
import { setUpdatedFlag, getPropositionsForMap } from '../components/Maps/mapActions';
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
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
    pendingUpdate: getPendingUpdate(state),
  }),
  {
    assignProposition,
    declineProposition,
    getCoordinates,
    activateCampaign,
    getObjectsMap,
    setUpdatedFlag,
    getPropositionsForMap,
    getRewardsGeneralCounts,
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
    location: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    setUpdatedFlag: PropTypes.func.isRequired,
    getPropositionsForMap: PropTypes.func.isRequired,
    wobjects: PropTypes.arrayOf(PropTypes.shape()),
    getRewardsGeneralCounts: PropTypes.func.isRequired,
    pendingUpdate: PropTypes.bool,
  };

  static defaultProps = {
    username: '',
    userLocation: {},
    wobjects: [],
    pendingUpdate: false,
    location: {},
  };

  state = {
    loading: false,
    loadingCampaigns: false,
    loadingAssignDiscard: false,
    hasMore: false,
    propositions: [],
    propositionsReserved: [],
    sponsors: [],
    sortHistory: 'reservation',
    sortGuideHistory: 'reservation',
    sortMessages: 'inquiryDate',
    sortAll: 'proximity',
    sortEligible: 'proximity',
    sortReserved: 'proximity',
    radius: RADIUS,
    area: [],
    campaignsTypes: [],
    objectDetails: {},
    activeFilters: { guideNames: [], types: [] },
    activePayableFilters: [],
    isSearchAreaFilter: false,
    isAssign: false,
    messagesSponsors: [],
    messages: [],
    zoomMap: 0,
    fetched: true,
    activeMessagesFilters: {
      caseStatus: '',
      rewards: [],
    },
    activeHistoryFilters: {
      rewards: [],
      messagesSponsors: [],
    },
    activeGuideHistoryFilters: {
      rewards: [],
      messagesSponsors: [],
    },
    url: '',
  };

  componentDidMount() {
    const { userLocation, match, username } = this.props;
    const { sortAll, sortEligible, sortReserved, url } = this.state;
    const sort = getSort(match, sortAll, sortEligible, sortReserved);
    if (username && !url) {
      this.getPropositionsByStatus({ username, sort });
    } else if (match.params.filterKey !== 'all') {
      history.push(`/rewards/all`);
    }
    if (!size(userLocation)) {
      this.props.getCoordinates();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    if (match.path !== this.props.match.path) {
      this.setState({ activePayableFilters: [] });
    }
    if (match.params.filterKey !== 'reserved') {
      this.setState({ propositionsReserved: [] });
    }
    if (match.params.filterKey === 'reserved') {
      this.setState({ propositions: [] });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ url: this.props.match.url });
    }
  }

  setMapArea = ({ radius, coordinates, isMap, isSecondaryObjectsCards, firstMapLoad }) => {
    const { username, match, isFullscreenMode } = this.props;
    const limit = isFullscreenMode ? 200 : 50;
    const { activeFilters } = this.state;
    if (!isSecondaryObjectsCards) {
      this.getPropositions(
        { username, match, area: coordinates, radius, activeFilters, limit },
        isMap,
        firstMapLoad,
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

  setSortValue = sort => {
    const { match } = this.props;
    const key = get(match, ['params', 'filterKey']) || get(match, ['params', '0']);
    switch (key) {
      case 'active':
        return this.setState({ sortEligible: sort });
      case 'reserved':
        return this.setState({ sortReserved: sort });
      case 'history':
        return this.setState({ sortHistory: sort });
      case 'messages':
        return this.setState({ sortMessages: sort });
      case 'guideHistory':
        return this.setState({ sortGuideHistory: sort });
      default:
        return this.setState({ sortAll: sort });
    }
  };

  setFilterValue = (filterValue, key) => {
    const activeFilters = this.state.activeFilters;
    if (includes(activeFilters[key], filterValue)) {
      remove(activeFilters[key], f => f === filterValue);
    } else {
      activeFilters[key].push(filterValue);
    }
    this.setState({ loadingCampaigns: true, activeFilters });
  };

  setFilters = (filterKey, activeFilters) => {
    if (filterKey === 'history') {
      this.setState({ activeHistoryFilters: activeFilters });
    } else if (filterKey === 'guideHistory') {
      this.setState({ activeGuideHistoryFilters: activeFilters });
    } else {
      this.setState({ activeMessagesFilters: activeFilters });
    }
  };

  setActiveMessagesFilters = (filterValue, key) => {
    const { match } = this.props;
    const paramsKey = match.params[0];
    let activeFilters;
    switch (paramsKey) {
      case 'history':
        activeFilters = this.state.activeHistoryFilters;
        break;
      case 'guideHistory':
        activeFilters = this.state.activeGuideHistoryFilters;
        break;
      default:
        activeFilters = this.state.activeMessagesFilters;
    }
    switch (key) {
      case 'rewards':
      case 'messagesSponsors':
        if (includes(activeFilters[key], filterValue)) {
          remove(activeFilters[key], f => f === filterValue);
        } else {
          activeFilters[key].push(filterValue);
        }
        this.setFilters(paramsKey, activeFilters);
        break;
      case 'caseStatus':
        if (activeFilters[key] === filterValue) {
          activeFilters[key] = '';
        } else {
          activeFilters[key] = filterValue;
        }
        this.setFilters(paramsKey, activeFilters);
        break;
      default:
        break;
    }
    this.setFilters(paramsKey, activeFilters);
    this.setState({ loadingCampaigns: true });
  };

  setMessagesSponsors = messagesSponsors => this.setState({ messagesSponsors });

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
      case 'otherDays':
      default:
        if (findIndex(activeFilters, { filterName: filterValue.filterName }) === -1) {
          activeFilters = filter(
            activeFilters,
            item =>
              item.filterName !== 'days' &&
              item.filterName !== 'moreDays' &&
              item.filterName !== 'otherDays',
          );
          activeFilters.push(filterValue);
        } else {
          remove(activeFilters, { filterName: filterValue.filterName });
        }
        this.setState({ activePayableFilters: activeFilters });
    }
  };

  getPropositionsByStatus = ({ username, sort }) => {
    const { pendingUpdate, match } = this.props;
    this.setState({ loadingCampaigns: true });
    this.props.getRewardsGeneralCounts({ userName: username, sort }).then(data => {
      // eslint-disable-next-line camelcase
      const { sponsors, hasMore, campaigns_types, campaigns, tabType } = data.value;
      const newSponsors = sortBy(sponsors);
      const rewardsTab = {
        reserved: 'reserved',
        eligible: 'active',
        all: 'all',
      };
      this.setState({
        sponsors: newSponsors,
        hasMore,
        campaignsTypes: campaigns_types,
        loadingCampaigns: false,
      });
      if (!pendingUpdate && match.params.filterKey) {
        this.props.history.push(`/rewards/${rewardsTab[tabType]}/`);
        if (tabType === 'reserved') {
          this.setState({
            propositionsReserved: campaigns,
          });
        } else {
          this.setState({
            propositions: campaigns,
          });
        }
      } else {
        this.setState({ url: this.props.match.url });
      }
    });
  };

  getPropositions = (
    { username, match, area, sort, radius, activeFilters, limit },
    isMap,
    firstMapLoad,
  ) => {
    this.setState({ loadingCampaigns: !isMap });
    getPropositions(
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
        firstMapLoad: !!isMap && firstMapLoad,
        isMap,
      }),
    ).then(data => {
      this.props.setUpdatedFlag();
      this.setState({
        campaignsTypes: data.campaigns_types,
        area,
        radius,
        loading: false,
        fetched: false,
        hasMore: data.hasMore,
      });
      if (isMap) {
        this.props.getPropositionsForMap(data.campaigns);
      } else if (match.params.filterKey === 'reserved') {
        this.setState({
          propositionsReserved: data.campaigns,
          loadingCampaigns: false,
        });
      } else {
        this.setState({
          propositions: data.campaigns,
          loadingCampaigns: false,
        });
        const sponsors = sortBy(data.sponsors);
        this.setState({
          sponsors,
          propositions: data.campaigns,
        });
      }
      if (isMap && firstMapLoad) {
        const zoomMap = getZoom(data.radius);
        this.setState({
          zoomMap,
        });
      }
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
    userName,
    currencyId,
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
        userName,
        currencyId,
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
      if (updatedProposition._id && updatedProposition._id === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            updatedProposition.objects[index].assigned = isAssign;
          } else {
            updatedProposition.objects[index].assigned = null;
          }
        });
      } else {
        return updatedProposition;
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
    type,
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
        type,
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

  campaignsLayoutWrapLayout = (
    IsRequiredObjectWrap,
    filterKey,
    userName,
    match,
    messages,
    getHistory,
    blacklistUsers,
  ) => {
    const { pendingUpdate } = this.props;
    const {
      propositions,
      loadingAssignDiscard,
      isAssign,
      fetched,
      propositionsReserved,
    } = this.state;
    let propositionsUniq;
    if (!isEmpty(propositionsReserved)) {
      propositionsUniq = propositionsReserved;
    } else if (match.params.campaignParent) {
      propositionsUniq = uniqBy(propositions, '_id');
    } else {
      propositionsUniq = uniqBy(propositions, 'required_object._id');
    }
    const actualPropositions = isEmpty(messages) ? propositionsUniq : messages;

    const getMessageHistory = async () => {
      const path = match.params[0];
      const {
        activeHistoryFilters,
        activeMessagesFilters,
        activeGuideHistoryFilters,
        sortHistory,
        sortMessages,
        sortGuideHistory,
      } = this.state;
      try {
        const activeFilters = getActiveFilters({
          path,
          activeHistoryFilters,
          activeMessagesFilters,
          activeGuideHistoryFilters,
        });
        const sortChanged = getSortChanged({ path, sortHistory, sortMessages, sortGuideHistory });
        await getHistory(userName, sortChanged, activeFilters, false);
      } catch (error) {
        console.log(error);
      }
    };
    const { intl, user } = this.props;
    if (size(actualPropositions) !== 0) {
      if (IsRequiredObjectWrap && isEmpty(propositionsReserved) && !pendingUpdate) {
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
                user={user}
                match={this.props.match}
                getMessageHistory={getMessageHistory}
                blacklistUsers={blacklistUsers}
              />
            ),
        ),
      );
    } else if (!fetched && isEmpty(actualPropositions)) {
      return `${intl.formatMessage({
        id: 'noProposition',
        defaultMessage: `No reward matches the criteria`,
      })}`;
    }
    return '';
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
          getPropositions(reqData).then(newPropositions =>
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
    const { propositions, propositionsReserved } = this.state;
    const newPropositions = !isEmpty(propositions) ? propositions : propositionsReserved;
    const secondaryObjects = flatten(
      map(newPropositions, proposition => map(proposition.objects, object => object.object)),
    );
    const secondaryObjectsForMap = uniqBy(secondaryObjects, 'author_permlink');
    const primaryObjectForMap = !isEmpty(secondaryObjectsForMap)
      ? get(newPropositions, ['0', 'required_object'])
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
      messagesSponsors,
      fetched,
      area,
      radius,
      sortEligible,
      sortAll,
      sortReserved,
      activeMessagesFilters,
      activeHistoryFilters,
      sortHistory,
      sortMessages,
      loadingAssignDiscard,
      propositionsReserved,
      sortGuideHistory,
      activeGuideHistoryFilters,
      url,
    } = this.state;
    const mapWobjects = map(wobjects, wobj => getClientWObj(wobj.required_object, usedLocale));
    const IsRequiredObjectWrap = !match.params.campaignParent;
    const filterKey = match.params.filterKey;
    const robots = location.pathname === 'index,follow';
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
      loadingAssignDiscard,
      campaignsLayoutWrapLayout: this.campaignsLayoutWrapLayout,
      handleLoadMore: this.handleLoadMore,
      filterData: activePayableFilters,
      userLocation,
      sponsors,
      campaignsTypes,
      activeFilters,
      fetched,
      setFilterValue: this.setFilterValue,
      setPayablesFilterValue: this.setPayablesFilterValue,
      area,
      radius,
      getPropositions: this.getPropositions,
      getPropositionsByStatus: this.getPropositionsByStatus,
      setSortValue: this.setSortValue,
      sortEligible,
      sortAll,
      sortReserved,
      activeMessagesFilters,
      activeHistoryFilters,
      setMessagesSponsors: this.setMessagesSponsors,
      messagesSponsors,
      sortHistory,
      sortMessages,
      sortGuideHistory,
      setActiveMessagesFilters: this.setActiveMessagesFilters,
      propositionsReserved,
      activeGuideHistoryFilters,
      url,
    });

    const campaignParent = get(match, ['params', 'campaignParent']);
    const isReserved = match.params.filterKey === 'reserved';
    const campaignsObjectsForMap =
      campaignParent || isReserved ? this.getCampaignsObjectsForMap() : [];
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
                  {!isEmpty(userLocation) && !isCreate && (
                    <MapWrap
                      setMapArea={this.setMapArea}
                      userLocation={userLocation}
                      wobjects={campaignParent || isReserved ? campaignsObjectsForMap : mapWobjects}
                      onMarkerClick={this.goToCampaign}
                      getAreaSearchData={this.getAreaSearchData}
                      match={match}
                      primaryObjectCoordinates={primaryObjectCoordinates}
                      zoomMap={zoomMap}
                    />
                  )}
                  {!isEmpty(sponsors) &&
                    (!isEmpty(propositions) || !isEmpty(propositionsReserved)) &&
                    !isCreate && (
                      <RewardsFiltersPanel
                        campaignsTypes={campaignsTypes}
                        sponsors={sponsors}
                        activeFilters={activeFilters}
                        activePayableFilters={activePayableFilters}
                        setFilterValue={this.setFilterValue}
                        setPayablesFilterValue={this.setPayablesFilterValue}
                        location={location}
                        activeMessagesFilters={activeMessagesFilters}
                        activeHistoryFilters={activeHistoryFilters}
                        activeGuideHistoryFilters={activeGuideHistoryFilters}
                        messagesSponsors={messagesSponsors}
                        setActiveMessagesFilters={this.setActiveMessagesFilters}
                      />
                    )}
                </div>
              </Affix>
            )}
            {(includes(match.url, 'history') ||
              includes(match.url, 'guideHistory') ||
              includes(match.url, 'messages')) && (
              <Affix className="rightContainer leftContainer__user" stickPosition={77}>
                <div className="right">
                  <RewardsFiltersPanel
                    campaignsTypes={campaignsTypes}
                    setFilterValue={this.setFilterValue}
                    location={location}
                    activeMessagesFilters={activeMessagesFilters}
                    activeHistoryFilters={activeHistoryFilters}
                    activeGuideHistoryFilters={activeGuideHistoryFilters}
                    messagesSponsors={messagesSponsors}
                    setActiveMessagesFilters={this.setActiveMessagesFilters}
                  />
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
