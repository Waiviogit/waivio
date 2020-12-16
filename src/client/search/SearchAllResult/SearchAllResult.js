import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map, size } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Dropdown, Icon, Menu } from 'antd';

import UserCard from '../../components/UserCard';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectName } from '../../helpers/wObjectHelper';
import {
  getHasMoreObjects,
  getHasMoreUsers,
  getSearchFilters,
  getSearchSort,
  getSearchUsersResults,
  getWebsiteSearchResult,
  getWebsiteSearchString,
  getWebsiteSearchType,
} from '../../reducers';
import { getActiveItemClassList } from '../helpers';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import {
  getFilterForSearch,
  searchObjectsAutoCompeteLoadingMore,
  searchUsersAutoCompeteLoadingMore,
  setSearchSortType,
  setWebsiteSearchFilter,
  setWebsiteSearchType,
} from '../searchActions';
import SortSelector from '../../components/SortSelector/SortSelector';
import { SORT_OPTIONS_WOBJ } from '../../../common/constants/waivioFiltres';
import { setMapFullscreenMode } from '../../components/Maps/mapActions';

import './SearchAllResult.less';

const SearchAllResult = props => {
  const filterTypes = ['restaurant', 'dish', 'drink', 'Users'];
  const isUsersSearch = props.searchType === 'Users';

  useEffect(() => {
    if (filterTypes.includes(props.searchType) && !isUsersSearch)
      props.getFilterForSearch(props.searchType);
  }, [props.searchType]);

  const currentListState = () => {
    switch (props.searchType) {
      case 'Users':
        return {
          list: map(props.searchByUser, user => (
            <UserCard key={user.account} user={{ ...user, name: user.account }} />
          )),
          loadingMore: () =>
            props.searchUsersAutoCompeteLoadingMore(props.searchString, size(props.searchByUser)),
          hasMore: false,
        };

      default:
        return {
          list: map(props.searchResult, obj => (
            <ObjectCardView wObject={obj} key={getObjectName(obj)} />
          )),
          loadingMore: () =>
            props.searchObjectsAutoCompeteLoadingMore(
              props.searchString,
              props.searchType,
              size(props.searchResult),
            ),
          hasMore: props.hasMore,
        };
    }
  };

  const currRenderListState = currentListState();

  const menu = filter => (
    <Menu onClick={e => props.setWebsiteSearchFilter(filter.tagCategory, e.key)}>
      <Menu.Item key={null}>show all</Menu.Item>
      {map(filter.tags, tag => (
        <Menu.Item key={tag}>{tag}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="SearchAllResult">
      <div className="SearchAllResult__type-wrap">
        {filterTypes.map(type => (
          <span
            role="presentation"
            className={getActiveItemClassList(type, props.searchType, 'SearchAllResult__type')}
            onClick={() => props.setWebsiteSearchType(type)}
            key={type}
          >
            {type}
          </span>
        ))}
      </div>
      {!isUsersSearch && (
        <React.Fragment>
          <div className="SearchAllResult__filters">
            {map(props.filters, filter => (
              <Dropdown key={filter.tagCategory} overlay={menu(filter)} trigger={['click']}>
                <Button>
                  {filter.tagCategory} <Icon type="down" />
                </Button>
              </Dropdown>
            ))}
          </div>
          <SortSelector sort={props.sort} onChange={props.setSearchSortType}>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.WEIGHT}>
              {props.intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.RECENCY}>
              {props.intl.formatMessage({ id: 'recency', defaultMessage: 'Recency' })}
            </SortSelector.Item>
          </SortSelector>
        </React.Fragment>
      )}
      <div className="SearchAllResult__buttonWrap">
        <Button
          icon="compass"
          size="large"
          className="map-btn"
          onClick={() => props.setMapFullscreenMode(true)}
        >
          {props.intl.formatMessage({ id: 'view_map', defaultMessage: 'View map' })}
        </Button>
      </div>
      {isEmpty(currRenderListState.list) ? (
        <div>List is empty</div>
      ) : (
        <ReduxInfiniteScroll
          className="Feed"
          loadMore={currRenderListState.loadingMore}
          loader={<Loading />}
          loadingMore={false}
          hasMore={currRenderListState.hasMore}
          elementIsScrollable={false}
          threshold={1500}
        >
          {currRenderListState.list}
        </ReduxInfiniteScroll>
      )}
    </div>
  );
};

SearchAllResult.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  searchUsersAutoCompeteLoadingMore: PropTypes.func.isRequired,
  searchObjectsAutoCompeteLoadingMore: PropTypes.func.isRequired,
  setSearchSortType: PropTypes.func.isRequired,
  getFilterForSearch: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}).isRequired,
  searchByUser: PropTypes.arrayOf.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  searchType: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  filters: PropTypes.arrayOf.isRequired,
  sort: PropTypes.string.isRequired,
  setMapFullscreenMode: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  setWebsiteSearchFilter: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    hasMore: getHasMoreObjects(state),
    hasMoreUsers: getHasMoreUsers(state),
    filters: getSearchFilters(state),
    searchString: getWebsiteSearchString(state),
    sort: getSearchSort(state),
  }),
  {
    searchUsersAutoCompeteLoadingMore,
    setWebsiteSearchType,
    searchObjectsAutoCompeteLoadingMore,
    getFilterForSearch,
    setWebsiteSearchFilter,
    setSearchSortType,
    setMapFullscreenMode,
  },
)(injectIntl(SearchAllResult));
