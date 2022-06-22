/* eslint-disable no-underscore-dangle */
import { message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
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
  every,
} from 'lodash';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getSuitableLanguage } from '../../store/reducers';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import {
  activateCampaign,
  assignProposition,
  declineProposition,
  getCoordinates,
} from '../../store/userStore/userActions';
import { getCryptoPriceHistory } from '../../store/appStore/appActions';
import RewardsFiltersPanel from './RewardsFiltersPanel/RewardsFiltersPanel';
import { getPropositions } from '../../waivioApi/ApiClient';
import {
  preparePropositionReqData,
  getActiveFilters,
  getSortChanged,
  getSort,
  handleRemoveSearchLink,
  handleAddSearchLink,
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
import {
  checkExpiredPayment,
  getRewardsGeneralCounts,
} from '../../store/rewardsStore/rewardsActions';
import {
  setUpdatedFlag,
  getPropositionsForMap,
  setMapFullscreenMode,
} from '../../store/mapStore/mapActions';
import { RADIUS } from '../../common/constants/map';
import { getZoom, getParsedMap } from '../components/Maps/mapHelper';
import {
  getAppUrl,
  getCryptosPriceHistory,
  getHelmetIcon,
  getIsWaivio,
  getWebsiteName,
} from '../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsLoaded,
} from '../../store/authStore/authSelectors';
import { getAllUsers } from '../../store/usersStore/usersSelectors';
import { getPendingUpdate, getUserLocation } from '../../store/userStore/userSelectors';
import { getIsMapModalOpen, getObjectsMap } from '../../store/mapStore/mapSelectors';
import DEFAULTS from '../object/const/defaultValues';

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
    isWaivio: getIsWaivio(state),
    helmetIcon: getHelmetIcon(state),
    siteName: getWebsiteName(state),
    appUrl: getAppUrl(state),
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
    setMapFullscreenMode,
    checkExpiredPayment,
  },
)
class Rewards extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    checkExpiredPayment: PropTypes.func.isRequired,
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
    isWaivio: PropTypes.bool,
    users: PropTypes.shape(),
    getCryptoPriceHistory: PropTypes.func.isRequired,
    setMapFullscreenMode: PropTypes.func.isRequired,
    helmetIcon: PropTypes.string.isRequired,
    appUrl: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    username: '',
    userLocation: {},
    wobjects: [],
    pendingUpdate: false,
    location: {},
    authenticated: false,
    isWaivio: true,
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
    sortAll: 'default',
    sortEligible: 'default',
    sortReserved: 'payout',
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
    currentLocation: null,
  };

  async componentDidMount() {
    const {
      userLocation,
      match,
      username,
      authenticated,
      getCryptoPriceHistory: getCryptoPriceHistoryAction,
      location,
    } = this.props;
    const { sortAll, sortEligible, sortReserved, url, activeFilters } = this.state;
    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    if (authenticated) this.props.checkExpiredPayment(username);

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ currentLocation: location.search });

    getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);

    if (!size(userLocation)) {
      try {
        const coords = await this.props.getCoordinates();
        const { latitude, longitude } = coords.value;

        // eslint-disable-next-line react/no-did-mount-set-state
        await this.setState({ area: [latitude, longitude] });
      } catch (e) {
        message.error(e.error_description);
      }
    }

    const { area } = this.state;

    if (username && !url) this.getPropositionsByStatus({ username, sort, area });

    const actualArea = !area[0] ? [] : area;

    if (match.params[0] === 'all')
      this.getPropositions({ username, match, activeFilters, sort, actualArea, authenticated });
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    const { username } = this.props;
    const { sortAll, sortEligible, sortReserved, area } = this.state;

    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    if (this.state.currentLocation !== nextProps.location.search) {
      this.setState({
        activeGuideHistoryFilters: {
          rewards: [],
          messagesCampaigns: [],
        },
        currentLocation: nextProps.location.search,
      });
    }
    if (username !== nextProps.username) {
      const userName = username || nextProps.username;

      this.getPropositionsByStatus({ username: userName, sort, area });
    }

    if (match.path !== this.props.match.path) this.setState({ activePayableFilters: [] });
    if (match.params.filterKey !== 'reserved') this.setState({ propositionsReserved: [] });
    else this.setState({ propositions: [] });
  }

  componentDidUpdate(prevProps) {
    const { match, username, authenticated, location } = this.props;
    const { activeFilters } = this.state;
    const lastLinkChar = location.pathname;

    if (!location.search && lastLinkChar.slice(-1) === '?') {
      const currLink = lastLinkChar.substring(0, lastLinkChar.length - 1);

      history.pushState('', '', currLink);
    }

    if (this.props.match.url !== prevProps.match.url) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ url: this.props.match.url });
      this.getPropositions({ username, match, authenticated, activeFilters });
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

  setFilterValue = (filterValue, key, fromUrl) => {
    const { match, username, authenticated } = this.props;
    const { sortAll, sortEligible, sortReserved } = this.state;
    const activeFilters = { ...this.state.activeFilters };

    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    if (includes(activeFilters[key], filterValue)) {
      handleRemoveSearchLink(filterValue);
      remove(activeFilters[key], f => f === filterValue);
    } else {
      activeFilters[key].push(filterValue);
      if (!fromUrl) {
        handleAddSearchLink(filterValue);
      }
    }
    if (!this.state.url) {
      this.setState({ activeFilters, url: this.props.match.url });
    } else {
      this.setState({ activeFilters });
    }

    this.getPropositions({ username, match, activeFilters, sort, actualArea: [], authenticated });
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
    const searchParams = new URLSearchParams(location.search);
    const isWidget = searchParams.get('display');
    const isReserved = searchParams.get('toReserved');

    const actualArea = !area[0] ? [] : area;

    this.setState({ loadingCampaigns: true });
    this.props
      .getRewardsGeneralCounts({ userName: username, sort, match, actualArea })
      .then(data => {
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

        if (!isWidget && !isReserved) {
          const filterKey = match.params.filterKey;
          const arrFilterKey = [PAYABLES, RECEIVABLES];

          if (
            !pendingUpdate &&
            filterKey &&
            every(arrFilterKey, key => filterKey !== key) &&
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
        } else {
          this.setState({ url: this.props.match.url });
        }
      });
  };

  getPropositions = (
    {
      username,
      match,
      area,
      sort,
      radius,
      activeFilters,
      limit,
      isRequestWithoutRequiredObject,
      authenticated,
    },
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
        authenticated,
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
      } else if (match.params[0] === 'reserved') {
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
    const { match, isWaivio } = this.props;
    const campaignParent = get(match, ['params', 'campaignParent']);
    const filterKey = get(match, ['params', 'filterKey']);
    const objUrl = `/object/${wobjPermlink}`;

    if (isWaivio || !campaignParent) {
      this.props.history.push(`/rewards/${filterKey}/${wobjPermlink}`);
    } else {
      this.props.setMapFullscreenMode(false);
      this.props.history.push(objUrl);
    }
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
      map(newPropositions, proposition =>
        map(proposition.objects, object => ({ ...object.object, reward: proposition.reward })),
      ),
    );
    const secondaryObjectsForMap = uniqBy(secondaryObjects, 'author_permlink');
    const primaryObjectForMap =
      !isEmpty(secondaryObjectsForMap) && match.params.filterKey !== 'reserved'
        ? {
            ...get(newPropositions, ['0', 'required_object'], {}),
            reward: newPropositions[0].reward,
          }
        : {};
    const secondaryObjectsWithUniqueCoordinates = filter(secondaryObjectsForMap, object => {
      const parent = object.parent;
      const objMap = getParsedMap(object || parent);
      const primaryObjectMap = getParsedMap(primaryObjectForMap);

      return !isEqual(objMap, primaryObjectMap) ? object : '';
    });

    return match.params.filterKey === 'reserved'
      ? map(newPropositions, proposition => {
          const propositionObject = {
            ...get(proposition, ['objects', '0', 'object'], {}),
            reward: proposition.reward,
          };
          const propositionObjectMap = get(proposition, ['objects', '0', 'object', 'map']);

          return !isEmpty(propositionObjectMap)
            ? propositionObject
            : { ...propositionObject, map: proposition.required_object.map };
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
    const mapWobjects = map(wobjects, wobj => ({
      ...wobj.required_object,
      reward: wobj.max_reward,
    }));
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
      setHistoryFilters: filters => this.setFilters(GUIDE_HISTORY, filters),
    });

    const campaignParent = get(match, ['params', 'campaignParent']);
    const isReserved = match.params.filterKey === IS_RESERVED;
    const campaignsObjectsForMap =
      campaignParent || isReserved ? this.getCampaignsObjectsForMap() : [];
    const primaryObjectCoordinates = this.moveToCoordinates(campaignsObjectsForMap);
    const isWidget =
      typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('isWidget') : false;
    const desc = 'Reserve the reward for a few days. Share photos of the dish and get the reward!';
    const img = DEFAULTS.FAVICON;
    const urlCurr = `${this.props.appUrl}/rewards`;
    const title = `Rewards - ${this.props.siteName}`;

    return (
      <div className="Rewards">
        <div className="shifted">
          <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={urlCurr} />
            <meta property="description" content={desc} />
            <meta name="twitter:card" content={'summary_large_image'} />
            <meta name="twitter:site" content={`@${this.props.siteName}`} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={img} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={urlCurr} />
            <meta property="og:image" content={img} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="600" />
            <meta property="og:description" content={desc} />
            <meta property="og:site_name" content={this.props.siteName} />
            <link rel="image_src" href={img} />
            <link id="favicon" rel="icon" href={this.props.helmetIcon} type="image/x-icon" />
          </Helmet>
          <ScrollToTop />
          <ScrollToTopOnMount />
          <div className={classNames('feed-layout container', { 'isWidget-container': isWidget })}>
            <Affix className={classNames('leftContainer', { isWidget })} stickPosition={77}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <div className="center">
              {!isWidget && <MobileNavigation />}
              {renderedRoutes}
            </div>
            {(match.url === PATH_NAME_PAYABLES || match.url === PATH_NAME_RECEIVABLES) && (
              <Affix className="rightContainer leftContainer__user" stickPosition={120}>
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
