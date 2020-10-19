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
import { HBD, HIVE } from '../../common/constants/cryptos';
import {
  getAuthenticatedUser,
  getAllUsers,
  getAuthenticatedUserName,
  getCryptosPriceHistory,
  getObjectsMap,
  getIsLoaded,
  getUserLocation,
  getIsMapModalOpen,
  getSuitableLanguage,
  getPendingUpdate,
  getIsAuthenticated,
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
import { getCryptoPriceHistory } from '../app/appActions';
import RewardsFiltersPanel from './RewardsFiltersPanel/RewardsFiltersPanel';
import { getPropositions } from '../../waivioApi/ApiClient';
import {
  preparePropositionReqData,
  getActiveFilters,
  getSortChanged,
  getSort,
} from './rewardsHelper';
import {
  MESSAGES,
  HISTORY,
  GUIDE_HISTORY,
  PATH_NAME_RECEIVABLES,
  PATH_NAME_PAYABLES,
  IS_RESERVED,
  FRAUD_DETECTION,
  IS_ALL,
  IS_ACTIVE,
  PAYABLES,
  RECEIVABLES,
} from '../../common/constants/rewards';
import Proposition from './Proposition/Proposition';
import Campaign from './Campaign/Campaign';
import MapWrap from '../components/Maps/MapWrap/MapWrap';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
// eslint-disable-next-line import/extensions
import * as apiConfig from '../../waivioApi/config';
import { getRewardsGeneralCounts } from '../rewards/rewardsActions';
import { setUpdatedFlag, getPropositionsForMap } from '../components/Maps/mapActions';
import { RADIUS } from '../../common/constants/map';
import { getZoom, getParsedMap } from '../components/Maps/mapHelper';

@withRouter
@injectIntl
@connect(
  state => ({
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
    userLocation: getUserLocation(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    user: getAuthenticatedUser(state),
    users: getAllUsers(state),
    wobjects: getObjectsMap(state),
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
    pendingUpdate: getPendingUpdate(state),
    authenticated: getIsAuthenticated(state),
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
    getCryptoPriceHistory,
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
    authenticated: PropTypes.bool,
    users: PropTypes.shape(),
    getCryptoPriceHistory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    username: '',
    userLocation: {},
    wobjects: [],
    pendingUpdate: false,
    location: {},
    authenticated: false,
    users: {},
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
    sortFraudDetection: 'reservation',
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
    messagesCampaigns: [],
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
      messagesCampaigns: [],
    },
    url: '',
  };

  async componentDidMount() {
    const {
      userLocation,
      match,
      username,
      authenticated,
      getCryptoPriceHistory: getCryptoPriceHistoryAction,
    } = this.props;
    const { sortAll, sortEligible, sortReserved, url, activeFilters } = this.state;
    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);

    if (!size(userLocation)) {
      try {
        const coords = await this.props.getCoordinates();
        const { lat, lon } = coords.value;
        // eslint-disable-next-line react/no-did-mount-set-state
        await this.setState({ area: [+lat, +lon] });
      } catch (e) {
        message.error(e.error_description);
      }
    }

    const { area } = this.state;
    if (username && !url) this.getPropositionsByStatus({ username, sort, area });
    if (!authenticated && match.params.filterKey === 'all')
      this.getPropositions({ username, match, activeFilters, sort, area });
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    const { username, authenticated } = this.props;
    const { sortAll, sortEligible, sortReserved, url, area } = this.state;
    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    if (username !== nextProps.username) {
      const userName = username || nextProps.username;

      this.getPropositionsByStatus({ username: userName, sort, area });
    } else if (!authenticated && url && this.props.match.params.filterKey !== 'all') {
      this.props.history.push(`/rewards/all`);
    }

    if (match.path !== this.props.match.path) this.setState({ activePayableFilters: [] });
    if (match.params.filterKey !== 'reserved') this.setState({ propositionsReserved: [] });
    else this.setState({ propositions: [] });
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

    if (!isSecondaryObjectsCards || (isSecondaryObjectsCards && !firstMapLoad)) {
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
      case HISTORY:
        return this.setState({ sortHistory: sort });
      case MESSAGES:
        return this.setState({ sortMessages: sort });
      case GUIDE_HISTORY:
        return this.setState({ sortGuideHistory: sort });
      case FRAUD_DETECTION:
        return this.setState({ sortFraudDetection: sort });
      default:
        return this.setState({ sortAll: sort });
    }
  };

  setFilterValue = (filterValue, key) => {
    const activeFilters = { ...this.state.activeFilters };
    if (includes(activeFilters[key], filterValue)) {
      remove(activeFilters[key], f => f === filterValue);
    } else {
      activeFilters[key].push(filterValue);
    }
    if (!this.state.url) {
      this.setState({ activeFilters, url: this.props.match.url });
    } else {
      this.setState({ activeFilters });
    }
  };

  setFilters = (filterKey, activeFilters) => {
    if (filterKey === HISTORY) {
      this.setState({ activeHistoryFilters: activeFilters });
    } else if (filterKey === GUIDE_HISTORY) {
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
      case HISTORY:
        activeFilters = this.state.activeHistoryFilters;
        break;
      case GUIDE_HISTORY:
        activeFilters = this.state.activeGuideHistoryFilters;
        break;
      default:
        activeFilters = this.state.activeMessagesFilters;
    }
    switch (key) {
      case 'rewards':
      case 'messagesSponsors':
      case 'messagesCampaigns':
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
  setMessagesCampaigns = messagesCampaigns => this.setState({ messagesCampaigns });

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

  getPropositionsByStatus = ({ username, sort, area }) => {
    const { pendingUpdate, match } = this.props;
    this.setState({ loadingCampaigns: true });
    this.props.getRewardsGeneralCounts({ userName: username, sort, match, area }).then(data => {
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
      const filterKey = match.params.filterKey;
      if (
        !pendingUpdate &&
        filterKey &&
        filterKey !== PAYABLES &&
        filterKey !== RECEIVABLES &&
        !match.params.campaignParent
      ) {
        if (match.params.filterKey !== rewardsTab[tabType]) {
          this.props.history.push(`/rewards/${rewardsTab[tabType]}/`);
        }
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
    { username, match, area, sort, radius, activeFilters, limit, isRequestWithoutRequiredObject },
    isMap,
    firstMapLoad,
  ) => {
    const { usedLocale } = this.props;
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
        isRequestWithoutRequiredObject,
        locale: usedLocale,
      }),
    ).then(data => {
      this.props.setUpdatedFlag();
      const sponsors = sortBy(data.sponsors);
      this.setState({
        area,
        radius,
        loading: false,
        fetched: false,
        sponsors,
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
          campaignsTypes: data.campaigns_types,
          area,
          radius,
          hasMore: data.hasMore,
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
    const isReserved = match.params.filterKey === IS_RESERVED;

    let propositionsUniq;
    if (isReserved) {
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
        messages.error(error);
      }
    };
    const { intl, user, users } = this.props;
    if (size(actualPropositions) !== 0) {
      if (IsRequiredObjectWrap && isEmpty(propositionsReserved) && !isReserved && !pendingUpdate) {
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
                users={users}
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
      area,
      activeFilters,
      radius,
      isSearchAreaFilter,
      sortAll,
      sortEligible,
      sortReserved,
    } = this.state;
    const { username, match, usedLocale } = this.props;
    const path = match.params.filterKey;
    const sortChanged = getSortChanged({ path, sortAll, sortEligible, sortReserved });
    if (hasMore) {
      this.setState(
        {
          loading: true,
        },
        () => {
          const reqData = preparePropositionReqData({
            username,
            match,
            sort: sortChanged,
            area,
            usedLocale,
            ...activeFilters,
          });
          reqData.skip = propositions.length;
          if (isSearchAreaFilter) reqData.radius = radius;
          getPropositions(reqData).then(newPropositions =>
            this.setState({
              loading: false,
              hasMore: newPropositions.campaigns && newPropositions.hasMore,
              propositions: this.state.propositions.concat(newPropositions.campaigns),
              sponsors: sortBy(newPropositions.sponsors),
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
    const { match } = this.props;
    const newPropositions = !isEmpty(propositions) ? propositions : propositionsReserved;
    const secondaryObjects = flatten(
      map(newPropositions, proposition => map(proposition.objects, object => object.object)),
    );
    const secondaryObjectsForMap = uniqBy(secondaryObjects, 'author_permlink');
    const primaryObjectForMap =
      !isEmpty(secondaryObjectsForMap) && match.params.filterKey !== 'reserved'
        ? get(newPropositions, ['0', 'required_object'])
        : {};
    const secondaryObjectsWithUniqueCoordinates = filter(secondaryObjectsForMap, object => {
      const parent = object.parent;
      const objMap = getParsedMap(object || parent);
      const primaryObjectMap = getParsedMap(primaryObjectForMap);

      return !isEqual(objMap, primaryObjectMap) ? object : '';
    });

    return match.params.filterKey === 'reserved'
      ? map(newPropositions, proposition => {
          const propositionObject = get(proposition, ['objects', '0', 'object']);
          const propositionObjectMap = get(proposition, ['objects', '0', 'object', 'map']);
          return !isEmpty(propositionObjectMap) ? propositionObject : proposition.required_object;
        })
      : [primaryObjectForMap, ...secondaryObjectsWithUniqueCoordinates];
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
      messagesCampaigns,
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
      sortFraudDetection,
    } = this.state;
    const mapWobjects = map(wobjects, wobj => wobj.required_object);
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
      usedLocale,
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
      setMessagesCampaigns: this.setMessagesCampaigns,
      messagesSponsors,
      messagesCampaigns,
      sortHistory,
      sortMessages,
      sortFraudDetection,
      sortGuideHistory,
      setActiveMessagesFilters: this.setActiveMessagesFilters,
      propositionsReserved,
      activeGuideHistoryFilters,
      url,
    });

    const campaignParent = get(match, ['params', 'campaignParent']);
    const isReserved = match.params.filterKey === IS_RESERVED;
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
            {(match.url === PATH_NAME_PAYABLES || match.url === PATH_NAME_RECEIVABLES) && (
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
            {(filterKey === IS_RESERVED || filterKey === IS_ALL || filterKey === IS_ACTIVE) && (
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
                        messagesCampaigns={messagesCampaigns}
                        setActiveMessagesFilters={this.setActiveMessagesFilters}
                      />
                    )}
                </div>
              </Affix>
            )}
            {(includes(match.url, HISTORY) ||
              includes(match.url, GUIDE_HISTORY) ||
              includes(match.url, MESSAGES)) && (
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
                    messagesCampaigns={messagesCampaigns}
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
