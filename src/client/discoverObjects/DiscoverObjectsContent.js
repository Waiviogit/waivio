import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, omit, map, trimEnd } from 'lodash';
import { connect } from 'react-redux';
import { Button, Modal, Tag } from 'antd';
import {
  changeUrl,
  isNeedFilters,
  parseTagsFilters,
  parseUrl,
  updateActiveFilters,
  updateActiveTagsFilters,
  parseDiscoverQuery,
  buildCanonicalSearch,
} from './helper';
import {
  getObjectTypeByStateFilters,
  clearType,
  setFiltersAndLoad,
  changeSortingAndLoad,
  changeSorting,
  getObjectTypeMap,
  setActiveFilters,
  setTagsFiltersAndLoad,
  setActiveTagsFilters,
  setObjectSortType,
  getTagCategories,
  resetObjects,
} from '../../store/objectTypeStore/objectTypeActions';
import { setMapFullscreenMode } from '../../store/mapStore/mapActions';
import Loading from '../components/Icon/Loading';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import DiscoverObjectsFilters from './DiscoverFiltersSidebar/FiltersContainer';
import SidenavDiscoverObjects from './SidenavDiscoverObjects';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import DiscoverSorting from './DiscoverSorting/DiscoverSorting';

import { getCoordinates } from '../../store/userStore/userActions';
import { RADIUS, ZOOM } from '../../common/constants/map';
import { getCryptoPriceHistory } from '../../store/appStore/appActions';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import {
  getActiveFilters,
  getActiveFiltersTags,
  getAvailableFilters,
  getFilteredObjects,
  getFiltersTags,
  getHasMap,
  getHasMoreRelatedObjects,
  getObjectTypeLoading,
  getObjectTypeSorting,
  getObjectTypeState,
} from '../../store/objectTypeStore/objectTypeSelectors';
import { getIsMapModalOpen } from '../../store/mapStore/mapSelectors';
import ObjectCardSwitcher from '../objectCard/ObjectCardSwitcher';

const modalName = {
  FILTERS: 'filters',
  OBJECTS: 'objects',
};

export const SORT_OPTIONS = {
  WEIGHT: 'weight',
  PROXIMITY: 'proximity',
};

@connect(
  (state, props) => ({
    availableFilters: getAvailableFilters(state),
    tagsFilters: getFiltersTags(state),
    activeFilters: getActiveFilters(state),
    sort: getObjectTypeSorting(state),
    theType: getObjectTypeState(state),
    hasMap: getHasMap(state),
    filteredObjects: getFilteredObjects(state),
    isFetching: getObjectTypeLoading(state),
    hasMoreObjects: getHasMoreRelatedObjects(state),
    searchString: new URLSearchParams(props.history.location.search).get('search'),
    userName: getAuthenticatedUserName(state),
    isFullscreenMode: getIsMapModalOpen(state),
    activeTagsFilters: getActiveFiltersTags(state),
  }),
  {
    dispatchClearObjectTypeStore: clearType,
    dispatchGetObjectType: getObjectTypeByStateFilters,
    dispatchSetActiveFilters: setFiltersAndLoad,
    dispatchChangeSorting: changeSortingAndLoad,
    changeSorting,
    dispatchSetMapFullscreenMode: setMapFullscreenMode,
    getObjectTypeMap,
    getCoordinates,
    getCryptoPriceHistoryAction: getCryptoPriceHistory,
    setActiveFilters,
    setActiveTagsFilters,
    setTagsFiltersAndLoad,
    setObjectSortType,
    getTagCategories,
    resetObjects,
  },
)
class DiscoverObjectsContent extends Component {
  static propTypes = {
    /* from connect */
    searchString: PropTypes.string,
    availableFilters: PropTypes.shape().isRequired,
    activeFilters: PropTypes.shape().isRequired,
    // sort: PropTypes.string.isRequired,
    theType: PropTypes.shape().isRequired,
    hasMap: PropTypes.bool.isRequired,
    filteredObjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired,
    hasMoreObjects: PropTypes.bool.isRequired,
    dispatchGetObjectType: PropTypes.func.isRequired,
    dispatchClearObjectTypeStore: PropTypes.func.isRequired,
    dispatchSetActiveFilters: PropTypes.func.isRequired,
    changeSorting: PropTypes.func.isRequired,
    dispatchSetMapFullscreenMode: PropTypes.func.isRequired,
    /* passed props */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    typeName: PropTypes.string,
    setObjectSortType: PropTypes.func.isRequired,
    getCryptoPriceHistoryAction: PropTypes.func.isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    resetObjects: PropTypes.func.isRequired,
    setActiveTagsFilters: PropTypes.func.isRequired,
    setTagsFiltersAndLoad: PropTypes.func.isRequired,
    getTagCategories: PropTypes.func.isRequired,
    activeTagsFilters: PropTypes.shape({}),
    tagsFilters: PropTypes.arrayOf(PropTypes.shape()),
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    searchString: '',
    typeName: '',
    userLocation: {},
    match: {},
    userName: '',
    tagsFilters: [],
    activeTagsFilters: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isTypeHasFilters: isNeedFilters(props.typeName),
      isModalOpen: false,
      modalTitle: '',
      loadingAssign: false,
      infoboxData: false,
      zoom: ZOOM,
      center: [],
      isInitial: true,
      radius: RADIUS,
      match: {},
    };
    this.lastLoadedSortRef = null;
    this.lastLoadedSearchRef = null;
  }

  componentDidMount() {
    const { dispatchGetObjectType, typeName, getCryptoPriceHistoryAction, location } = this.props;
    const activeFilters = parseUrl(location.search);
    const activeTagsFilter = parseTagsFilters(location.search);
    const query = new URLSearchParams(location.search);
    const search = query.get('search');
    const { sort } = parseDiscoverQuery(location.search);
    const searchFilters = {};

    if (search) searchFilters.searchString = trimEnd(search);

    if (activeTagsFilter) {
      if (activeFilters?.rating) searchFilters.rating = activeFilters.rating.split(',');
      if (activeFilters?.mapX)
        searchFilters.map = {
          zoom: +activeFilters.zoom,
          radius: +activeFilters.radius,
          coordinates: [+activeFilters.mapX, +activeFilters.mapY],
        };
    }

    this.props.setActiveFilters(searchFilters);

    this.props.changeSorting(sort);

    if (searchFilters.map) {
      this.props.setObjectSortType(SORT_OPTIONS.PROXIMITY);
    }
    if (!isEmpty(activeFilters)) this.props.setActiveTagsFilters(activeTagsFilter);

    this.lastLoadedSortRef = sort;
    this.lastLoadedSearchRef = location.search;
    dispatchGetObjectType(typeName, { skip: 0 });
    this.props.getTagCategories(typeName);
    getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);
  }

  componentDidUpdate(prevProps) {
    const { location, typeName, theType } = this.props;
    const { sort: prevSort } = parseDiscoverQuery(prevProps.location.search);
    const { sort } = parseDiscoverQuery(location.search);

    if (
      sort !== prevSort &&
      sort !== this.lastLoadedSortRef &&
      typeName &&
      prevProps.location.pathname === location.pathname &&
      prevProps.location.search !== location.search
    ) {
      this.props.setObjectSortType(sort);

      this.lastLoadedSortRef = sort;

      this.props.resetObjects();

      const reduxTypeName = theType?.name;
      const isEmptyType = !theType || Object.keys(theType).length === 0;
      const nameMismatch = reduxTypeName && reduxTypeName !== typeName;
      const shouldCallSetTagsFilters = isEmptyType || !reduxTypeName || nameMismatch;

      if (shouldCallSetTagsFilters) {
        const { activeTagsFilters } = this.props;

        this.props.setTagsFiltersAndLoad(activeTagsFilters, typeName);
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatchClearObjectTypeStore();
  }

  getCommonFiltersLayout = () => (
    <React.Fragment>
      {this.props.searchString && (
        <Tag
          className="filter-highlighted"
          key="search-string-filter"
          closable
          onClose={this.resetNameSearchFilter}
        >
          {this.props.searchString}
        </Tag>
      )}
      {this.props.activeFilters.map ? (
        <Tag
          className="filter-highlighted"
          key="map-search-area-filter"
          closable
          onClose={this.resetMapFilter}
        >
          {this.props.intl.formatMessage({ id: 'search_area', defaultMessage: 'Search area' })}
        </Tag>
      ) : null}
    </React.Fragment>
  );

  loadMoreRelatedObjects = () => {
    const { dispatchGetObjectType, theType, filteredObjects } = this.props;

    dispatchGetObjectType(theType.name, { skip: filteredObjects.length || 0 });
  };

  showFiltersModal = () =>
    this.setState({
      isModalOpen: true,
      modalTitle: modalName.FILTERS,
    });

  showTypesModal = () =>
    this.setState({
      isModalOpen: true,
      modalTitle: modalName.OBJECTS,
    });

  closeModal = () => this.setState({ isModalOpen: false });

  handleChangeSorting = sorting => {
    const { history, location } = this.props;
    const { search, tagsByCategory } = parseDiscoverQuery(location.search);

    this.props.setObjectSortType(sorting);

    const canonical = buildCanonicalSearch({
      search,
      tagsByCategory,
      sort: sorting,
    });

    history.push(`${location.pathname}?${canonical}`);
  };

  handleRemoveTag = (filter, filterValue) => e => {
    const {
      activeFilters,
      dispatchSetActiveFilters,
      activeTagsFilters,
      history,
      location,
    } = this.props;

    e.preventDefault();
    if (filter === 'rating') {
      const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, false);

      dispatchSetActiveFilters(updatedFilters);

      changeUrl({ ...activeTagsFilters, ...updatedFilters }, history, location);
    } else {
      const updateTagsFilter = updateActiveTagsFilters(
        activeTagsFilters,
        filterValue,
        filter,
        false,
      );

      this.props.setTagsFiltersAndLoad(updateTagsFilter);
      changeUrl({ ...activeFilters, ...updateTagsFilter }, history, location);
    }
  };

  resetMapFilter = () => {
    const { activeFilters, dispatchSetActiveFilters } = this.props;
    const updatedFilters = omit(activeFilters, ['map']);

    dispatchSetActiveFilters(updatedFilters);
  };

  resetNameSearchFilter = () => {
    const { history, activeFilters, location, dispatchSetActiveFilters, typeName } = this.props;
    const updatedFilters = { ...activeFilters };

    delete updatedFilters.searchString;
    // ensure search param is removed from URL
    changeUrl({ ...updatedFilters, searchString: '' }, history, location);

    dispatchSetActiveFilters(updatedFilters);
    this.props.getTagCategories(typeName);
  };

  showMap = () => this.props.dispatchSetMapFullscreenMode(true);

  render() {
    const { isTypeHasFilters, isModalOpen, modalTitle } = this.state;
    const {
      intl,
      isFetching,
      hasMap,
      availableFilters,
      tagsFilters,
      activeFilters: { map: mapFilters },
      filteredObjects,
      hasMoreObjects,
      activeTagsFilters,
      location,
    } = this.props;
    const { sort: urlSort } = parseDiscoverQuery(location.search);
    const sortSelector = (
      <DiscoverSorting sort={urlSort} handleSortChange={this.handleChangeSorting} />
    );

    return (
      <React.Fragment>
        <div className="discover-objects-header__selection-block">
          <MobileNavigation />
          <div className="discover-objects-header__tags-block common">
            {this.getCommonFiltersLayout()}
          </div>
          <div className="discover-objects-header__sorting">{sortSelector}</div>
        </div>
        {isTypeHasFilters ? (
          <React.Fragment>
            {!isEmpty(availableFilters) ? (
              <div className="discover-objects-header__tags-block">
                <span className="discover-objects-header__topic ttc">
                  {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
                </span>
                {this.getCommonFiltersLayout()}
                {map(activeTagsFilters, (filterValues, filterName) =>
                  map(filterValues, filterValue => (
                    <Tag
                      className="ttc"
                      key={`${filterName}:${filterValue}`}
                      closable
                      onClose={this.handleRemoveTag(filterName, filterValue)}
                    >
                      {filterValue}
                    </Tag>
                  )),
                )}
                <span
                  className="discover-objects-header__selector underline ttl"
                  role="presentation"
                  onClick={this.showFiltersModal}
                >
                  {intl.formatMessage({ id: 'add_new_proposition', defaultMessage: 'Add' })}
                </span>
              </div>
            ) : null}
            {hasMap ? (
              <div className="discover-objects-header__toggle-map tc">
                <Button
                  icon="compass"
                  size="large"
                  className={isEmpty(mapFilters) ? 'map-btn' : 'map-btn active'}
                  onClick={this.showMap}
                >
                  {intl.formatMessage({ id: 'view_map', defaultMessage: 'View map' })}
                </Button>
              </div>
            ) : null}
          </React.Fragment>
        ) : null}

        <div className="discover-objects-header__sorting-mobile">{sortSelector}</div>
        {!isEmpty(filteredObjects) ? (
          <ReduxInfiniteScroll
            className="Feed"
            loadMore={this.loadMoreRelatedObjects}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMoreObjects}
            elementIsScrollable={false}
            threshold={1500}
          >
            {filteredObjects.map(wObj => (
              <ObjectCardSwitcher key={wObj.author_permlink} wObj={wObj} />
            ))}
          </ReduxInfiniteScroll>
        ) : (
          (isFetching && <Loading />) || (
            <div className="tc">
              {intl.formatMessage({
                id: 'no_results_found_for_search',
                defaultMessage: 'No results were found for your filters.',
              })}
            </div>
          )
        )}
        {modalTitle ? (
          <Modal
            className="discover-filters-modal"
            footer={null}
            title={intl.formatMessage({
              id: modalTitle,
              defaultMessage: modalTitle,
            })}
            closable
            visible={isModalOpen}
            onCancel={this.closeModal}
          >
            {modalTitle === modalName.FILTERS && (
              <DiscoverObjectsFilters
                intl={intl}
                filters={availableFilters}
                tagsFilters={tagsFilters}
              />
            )}
            {modalTitle === modalName.OBJECTS && <SidenavDiscoverObjects withTitle={false} />}
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default DiscoverObjectsContent;
