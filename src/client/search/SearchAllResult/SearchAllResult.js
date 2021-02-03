import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map, size, get } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Dropdown, Icon, Menu } from 'antd';
import classNames from 'classnames';

import UserCard from '../../components/UserCard';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectName } from '../../helpers/wObjectHelper';
import {
  getHasMoreObjects,
  getHasMoreUsers,
  getIsStartSearchUser,
  getSearchFilters,
  getSearchFiltersTagCategory,
  getSearchSort,
  getSearchUsersResults,
  getWebsiteSearchResult,
  getWebsiteSearchResultLoading,
  getWebsiteSearchString,
  getWebsiteSearchType,
} from '../../reducers';
import { getActiveItemClassList } from '../helpers';
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
import Loading from '../../components/Icon/Loading';

const SearchAllResult = props => {
  const [isScrolled, setIsScrolled] = useState(false);
  const filterTypes = ['restaurant', 'dish', 'drink', 'Users'];
  const isUsersSearch = props.searchType === 'Users';

  useEffect(() => {
    if (filterTypes.includes(props.searchType) && !isUsersSearch)
      props.getFilterForSearch(props.searchType);
  }, [props.searchType]);

  useEffect(() => {
    if (isScrolled) {
      switch (props.searchType) {
        case 'Users':
          props.searchUsersAutoCompeteLoadingMore(props.searchString, size(props.searchByUser));
          break;
        default:
          props.searchObjectsAutoCompeteLoadingMore(
            props.searchString,
            props.searchType,
            size(props.searchResult),
          );
      }
    }
  }, [isScrolled]);

  const currentListState = () => {
    switch (props.searchType) {
      case 'Users':
        return {
          list: map(props.searchByUser, user => (
            <UserCard key={user.account} user={{ ...user, name: user.account }} />
          )),
          hasMore: props.hasMoreUsers,
          loading: props.usersLoading,
        };

      default:
        return {
          list: map(props.searchResult, obj => (
            <ObjectCardView wObject={obj} key={getObjectName(obj)} />
          )),
          hasMore: props.hasMore,
          loading: props.loading,
        };
    }
  };

  const getEndScroll = e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const currRenderListState = currentListState();

  const getCurrentName = category => {
    const currentActiveCategory = props.activeFilters.find(item => item.categoryName === category);

    return get(currentActiveCategory, 'tags', [])[0];
  };

  const menu = filter => {
    const currentTagCheck = tag => getCurrentName(filter.tagCategory) === tag;
    const menuItemClassList = tag =>
      classNames({
        'SearchAllResult__active-tag': currentTagCheck(tag),
      });

    return (
      <Menu onClick={e => props.setWebsiteSearchFilter(filter.tagCategory, e.key)}>
        <Menu.Item key={'all'}>show all</Menu.Item>
        {map(filter.tags, tag => (
          <Menu.Item className={menuItemClassList(tag)} key={tag}>
            {tag}
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  const currentList = isEmpty(currRenderListState.list) ? (
    <div>
      {props.intl.formatMessage({
        id: 'search_no_result',
        defaultMessage: 'No results were found for this request',
      })}
    </div>
  ) : (
    currRenderListState.list
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
      <div className="SearchAllResult__main-wrap" onScroll={getEndScroll}>
        {!isUsersSearch && (
          <React.Fragment>
            <div className="SearchAllResult__filters">
              {map(props.filters, filter => (
                <Dropdown key={filter.tagCategory} overlay={menu(filter)} trigger={['click']}>
                  <Button>
                    {getCurrentName(filter.tagCategory) || filter.tagCategory} <Icon type="down" />
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
        {currRenderListState.loading ? <Loading /> : currentList}
      </div>
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
  activeFilters: PropTypes.arrayOf.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  searchType: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  hasMoreUsers: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  usersLoading: PropTypes.bool.isRequired,
  filters: PropTypes.arrayOf.isRequired,
  sort: PropTypes.string.isRequired,
  setMapFullscreenMode: PropTypes.func.isRequired,
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
    activeFilters: getSearchFiltersTagCategory(state),
    loading: getWebsiteSearchResultLoading(state),
    usersLoading: getIsStartSearchUser(state),
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
