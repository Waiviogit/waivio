import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map, size, get, uniqBy } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Dropdown, Icon, Menu } from 'antd';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';

import UserCard from '../../components/UserCard';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getActiveItemClassList } from '../helpers';
import {
  followSearchUser,
  searchObjectsAutoCompeteLoadingMore,
  searchUsersAutoCompeteLoadingMore,
  setShowSearchResult,
  setWebsiteSearchFilter,
  setWebsiteSearchType,
  unfollowSearchUser,
} from '../../../store/searchStore/searchActions';
import Loading from '../../components/Icon/Loading';
import Campaign from '../../rewards/Campaign/Campaign';
import Proposition from '../../rewards/Proposition/Proposition';
import { assignProposition, declineProposition } from '../../../store/userStore/userActions';
import ViewMapButton from '../../widgets/ViewMapButton';
import {
  getAllSearchLoadingMore,
  getHasMoreObjectsForWebsite,
  getHasMoreUsers,
  getIsStartSearchUser,
  getSearchFilters,
  getSearchFiltersTagCategory,
  getSearchUsersResults,
  getShowSearchResult,
  getWebsiteSearchResult,
  getWebsiteSearchResultLoading,
  getWebsiteSearchString,
} from '../../../store/searchStore/searchSelectors';

import './SearchAllResult.less';

const SearchAllResult = props => {
  const [isScrolled, setIsScrolled] = useState(false);
  const filterTypes = ['restaurant', 'dish', 'drink', 'Users'];
  const isUsersSearch = props.searchType === 'Users';
  const resultList = useRef();
  const searchResultClassList = classNames('SearchAllResult', {
    SearchAllResult__show: props.isShowResult,
  });

  const switcherObjectCard = obj => {
    if (!isEmpty(obj.propositions)) {
      const proposition = obj.propositions[0];

      return (
        <Proposition
          proposition={proposition}
          wobj={obj}
          assigned={proposition.assigned}
          wobjPrice={proposition.reward}
          assignProposition={props.assignProposition}
          discardProposition={props.declineProposition}
          hovered
        />
      );
    }

    if (obj.campaigns) return <Campaign proposition={obj} filterKey="all" hovered />;

    return <ObjectCardView wObject={obj} hovered />;
  };

  const handleItemClick = wobj => {
    localStorage.setItem('scrollTop', resultList.current.scrollTop);
    props.setQueryFromSearchList(wobj);
    props.setQueryInLocalStorage();
  };

  const currentListState = () => {
    switch (props.searchType) {
      case 'Users':
        return {
          list: map(props.searchByUser, user => (
            <UserCard
              user={{ ...user, name: user.account }}
              unfollow={props.unfollowSearchUser}
              follow={props.followSearchUser}
              handleClick={handleItemClick}
            />
          )),
          hasMore: props.hasMoreUsers,
          loading: props.usersLoading,
        };

      default:
        return {
          list: map(uniqBy(props.searchResult, '_id'), obj => (
            <div
              role="presentation"
              key={obj._id}
              onMouseOver={() => props.handleHoveredCard(obj.author_permlink)}
              onMouseOut={() => props.handleHoveredCard('')}
              onClick={() => handleItemClick(obj)}
            >
              {switcherObjectCard(obj)}
            </div>
          )),
          hasMore: props.hasMore,
          loading: props.loading,
        };
    }
  };

  useEffect(() => {
    if (!isEmpty(props.searchResult) && localStorage.getItem('scrollTop')) {
      resultList.current.scrollTo(0, +localStorage.getItem('scrollTop'));
    }
  }, []);

  const currRenderListState = currentListState();

  useEffect(() => {
    if (isScrolled && currRenderListState.hasMore && !props.showReload) {
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

  const getEndScroll = e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    localStorage.removeItem('scrollTop');

    if (bottom) setIsScrolled(true);
    else setIsScrolled(false);
  };

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
      <Menu
        onClick={e => {
          props.setWebsiteSearchFilter(filter.tagCategory, e.key);
          props.handleSetFiltersInUrl(filter.tagCategory, e.key);
          localStorage.removeItem('scrollTop');
        }}
        className="SearchAllResult__filter-list"
      >
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
    <div className="SearchAllResult__empty">
      {props.intl.formatMessage({
        id: 'search_no_result',
        defaultMessage: 'No results were found for this request',
      })}
    </div>
  ) : (
    currRenderListState.list
  );

  return (
    <div className={searchResultClassList}>
      <div
        className="SearchAllResult__toggle-button"
        role="presentation"
        onClick={() => {
          props.setShowSearchResult(!props.isShowResult);
          if (isEmpty(currRenderListState.list)) localStorage.removeItem('scrollTop');
        }}
      >
        <Icon type={props.isShowResult ? 'left' : 'right'} />
      </div>
      <div className="SearchAllResult__type-wrap">
        {filterTypes.map(type => (
          <span
            role="presentation"
            className={getActiveItemClassList(type, props.searchType, 'SearchAllResult__type')}
            key={type}
            onClick={() => {
              props.setWebsiteSearchType(type);
              props.handleUrlWithChangeType(type);
              localStorage.removeItem('scrollTop');
            }}
          >
            {type}
          </span>
        ))}
      </div>
      <div className="SearchAllResult__main-wrap" ref={resultList} onScroll={getEndScroll}>
        {!isUsersSearch && (
          <React.Fragment>
            <div className="SearchAllResult__filters">
              {map(props.filters, filter => (
                <Dropdown
                  key={filter.tagCategory}
                  overlay={menu(filter)}
                  trigger={['click']}
                  disabled={isEmpty(filter.tags)}
                >
                  <Button className="SearchAllResult__filters-button">
                    {getCurrentName(filter.tagCategory) || filter.tagCategory} <Icon type="down" />
                  </Button>
                </Dropdown>
              ))}
            </div>
            <div className="SearchAllResult__sortWrap">
              {props.showReload && (
                <span
                  className="SearchAllResult__reload"
                  role="presentation"
                  onClick={props.reloadSearchList}
                >
                  <ReactSVG wrapper="span" src="/images/icons/redo-alt-solid.svg" /> Reload
                </span>
              )}
            </div>
          </React.Fragment>
        )}
        <ViewMapButton handleClick={() => props.setShowSearchResult(false)} />
        {currRenderListState.loading ? <Loading /> : currentList}
        {props.showReload ? (
          <div
            className="SearchAllResult__listReload"
            role="presentation"
            onClick={props.reloadSearchList}
          >
            <ReactSVG wrapper="span" src="/images/icons/redo-alt-solid.svg" /> <span>Reload</span>
          </div>
        ) : (
          <div className="SearchAllResult__loader">{props.loadingMore && <Loading />}</div>
        )}
      </div>
    </div>
  );
};

SearchAllResult.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  setQueryInLocalStorage: PropTypes.func.isRequired,
  searchUsersAutoCompeteLoadingMore: PropTypes.func.isRequired,
  searchObjectsAutoCompeteLoadingMore: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}),
  searchByUser: PropTypes.arrayOf(PropTypes.shape({})),
  activeFilters: PropTypes.arrayOf(PropTypes.shape({})),
  searchResult: PropTypes.arrayOf(PropTypes.shape({})),
  searchType: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  hasMoreUsers: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  usersLoading: PropTypes.bool.isRequired,
  isShowResult: PropTypes.bool.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setWebsiteSearchFilter: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  unfollowSearchUser: PropTypes.func.isRequired,
  followSearchUser: PropTypes.func.isRequired,
  reloadSearchList: PropTypes.func.isRequired,
  handleUrlWithChangeType: PropTypes.func.isRequired,
  setQueryFromSearchList: PropTypes.func.isRequired,
  showReload: PropTypes.bool,
  assignProposition: PropTypes.func.isRequired,
  declineProposition: PropTypes.func.isRequired,
  handleSetFiltersInUrl: PropTypes.func.isRequired,
  handleHoveredCard: PropTypes.func,
};

SearchAllResult.defaultProps = {
  userLocation: {},
  hasMoreUsers: false,
  showReload: false,
  handleHoveredCard: () => {},
  searchByUser: [],
  activeFilters: [],
  searchResult: [],
};

export default connect(
  state => ({
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    hasMore: getHasMoreObjectsForWebsite(state),
    hasMoreUsers: getHasMoreUsers(state),
    filters: getSearchFilters(state),
    searchString: getWebsiteSearchString(state),
    activeFilters: getSearchFiltersTagCategory(state),
    loading: getWebsiteSearchResultLoading(state),
    usersLoading: getIsStartSearchUser(state),
    isShowResult: getShowSearchResult(state),
    loadingMore: getAllSearchLoadingMore(state),
  }),
  {
    searchUsersAutoCompeteLoadingMore,
    setWebsiteSearchType,
    searchObjectsAutoCompeteLoadingMore,
    setWebsiteSearchFilter,
    setShowSearchResult,
    unfollowSearchUser,
    followSearchUser,
    declineProposition,
    assignProposition,
  },
)(injectIntl(SearchAllResult));
