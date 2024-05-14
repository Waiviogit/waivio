import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';

import {
  searchExpertsForMap,
  searchExpertsForMapLoadingMore,
  searchObjectsAutoCompeteLoadingMore,
  searchWebsiteObjectsAutoCompete,
  setShowSearchResult,
} from '../../../store/searchStore/searchActions';
import Loading from '../../components/Icon/Loading';
import ViewMapButton from '../../widgets/ViewMapButton';
import {
  getAllSearchLoadingMore,
  getHasMoreExpertsUsersResults,
  getHasMoreObjectsForWebsite,
  getSearchFiltersTagCategory,
  getSearchUsersResultsQuantity,
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchResultQuantity,
  getWebsiteSearchString,
} from '../../../store/searchStore/searchSelectors';
import SearchMapFilters from './components/SearchMapFilters';
import UsersList from './components/UsersList';
import WobjectsList from './components/WobjectsList';
import ReloadButton from './components/ReloadButton';

import './SearchAllResult.less';
import { isMobile } from '../../../common/helpers/apiHelpers';
import {
  setSocialSearchResults,
  setMapInitialised,
} from '../../../store/websiteStore/websiteActions';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import {
  getSocialSearchResult,
  getSocialSearchResultLoading,
} from '../../../store/websiteStore/websiteSelectors';
import useUpdateEffect from '../../../hooks/useUpdateEffect';

const SearchAllResult = props => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isUsersSearch = props.searchType === 'Users';
  const resultList = useRef();
  const showReload = props.isSocial ? props.showReload && !props.socialLoading : props.showReload;
  const searchResultClassList = classNames('SearchAllResult SearchAllResult__dining', {
    SearchAllResult__show: props.isShowResult,
    'SearchAllResult--social': props.isSocial,
  });

  const handleItemClick = wobj => {
    props.setQueryFromSearchList(wobj);
    props.setQueryInLocalStorage();
  };

  const currentListState = () => {
    switch (props.searchType) {
      case 'Users':
        return {
          list: <UsersList handleItemClick={handleItemClick} />,
          hasMore: props.hasMoreUsers,
        };

      default:
        return {
          list: (
            <WobjectsList
              handleHoveredCard={props.handleHoveredCard}
              handleItemClick={handleItemClick}
            />
          ),
          hasMore: props.hasMore,
        };
    }
  };

  // eslint-disable-next-line consistent-return
  const currentSearchMethod = value => {
    localStorage.removeItem('scrollTop');
    props.reloadSearchList();
    if (props.isSocial) {
      // if (props.isMapInitialised) {
      //   props.setMapInitialised(false);
      // } else {
      const perml = props.permlink || props.currObj.author_permlink;

      perml && isEmpty(props.socialWobjects);
      props.setSocialSearchResults(perml, {
        topPoint: props.searchMap.topPoint,
        bottomPoint: props.searchMap.bottomPoint,
      });
      // }
    } else {
      switch (props.searchType) {
        case 'Users':
          return props.searchExpertsForMap(value);
        default:
          return props.searchWebsiteObjectsAutoCompete(value);
      }
    }
  };

  useUpdateEffect(() => {
    if (
      props.isShowResult &&
      !isEmpty(props.searchMap.bottomPoint) &&
      !isEmpty(props.searchMap.topPoint) &&
      !+localStorage.getItem('scrollTop')
    ) {
      currentSearchMethod(props.searchString);
    }
  }, [props.activeFilters, props.searchMap, props.searchString]);

  useEffect(() => {
    if (props.isSocial && !isMobile()) {
      props.setShowSearchResult(true);
    }
    if (props.wobjectsCounter && localStorage.getItem('scrollTop')) {
      resultList.current.scrollTo(0, +localStorage.getItem('scrollTop'));
    }

    return () => localStorage.setItem('scrollTop', resultList.current.scrollTop);
  }, []);

  const currRenderListState = currentListState();

  useEffect(() => {
    if (isScrolled && currRenderListState.hasMore && !props.showReload) {
      switch (props.searchType) {
        case 'Users':
          props.searchExpertsForMapLoadingMore(props.searchString, props.usersCounter);
          break;
        default:
          props.searchObjectsAutoCompeteLoadingMore(
            props.searchString,
            props.searchType,
            props.wobjectsCounter,
          );
      }
    }
  }, [isScrolled]);

  const getEndScroll = () => {
    const bottom =
      resultList.current.scrollHeight - resultList.current.scrollTop <=
      resultList.current.clientHeight * 2;

    localStorage.removeItem('scrollTop');

    if (bottom) setIsScrolled(true);
    else setIsScrolled(false);
  };

  const currentList = isEmpty(currRenderListState.list) ? (
    <div className="SearchAllResult__empty">
      {props.intl.formatMessage({ id: 'search_no_result' })}
    </div>
  ) : (
    currRenderListState.list
  );
  const toggleSearchResultPanel = () => {
    props.setShowSearchResult(!props.isShowResult);
    if (props.isShowResult) props.deleteShowPanel();
    if (isEmpty(currRenderListState.list)) localStorage.removeItem('scrollTop');
  };

  const setCloseResult = useCallback(() => props.setShowSearchResult(false), []);

  return (
    <div className={searchResultClassList}>
      <div
        className="SearchAllResult__toggle-button"
        role="presentation"
        onClick={toggleSearchResultPanel}
      >
        <Icon type={props.isShowResult ? 'left' : 'right'} />
      </div>
      <div className="SearchAllResult__main-wrap" ref={resultList} onScroll={getEndScroll}>
        {!isUsersSearch && !props.isSocial && <SearchMapFilters />}
        {showReload && (
          <ReloadButton
            className="SearchAllResult__reload"
            reloadSearchList={props.reloadSearchList}
          />
        )}
        <ViewMapButton handleClick={setCloseResult} />
        {currRenderListState.loading ? <Loading /> : currentList}
        {showReload ? (
          <ReloadButton
            className="SearchAllResult__listReload"
            reloadSearchList={props.reloadSearchList}
          />
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
  deleteShowPanel: PropTypes.func.isRequired,
  setQueryInLocalStorage: PropTypes.func.isRequired,
  searchExpertsForMapLoadingMore: PropTypes.func.isRequired,
  searchObjectsAutoCompeteLoadingMore: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  wobjectsCounter: PropTypes.number.isRequired,
  usersCounter: PropTypes.number.isRequired,
  hasMore: PropTypes.bool,
  hasMoreUsers: PropTypes.bool,
  isSocial: PropTypes.bool,
  loadingMore: PropTypes.bool.isRequired,
  isShowResult: PropTypes.bool.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  reloadSearchList: PropTypes.func.isRequired,
  setQueryFromSearchList: PropTypes.func.isRequired,
  showReload: PropTypes.bool,
  socialLoading: PropTypes.bool,
  handleHoveredCard: PropTypes.func,
  setSocialSearchResults: PropTypes.func,
  searchWebsiteObjectsAutoCompete: PropTypes.func.isRequired,
  searchExpertsForMap: PropTypes.func.isRequired,
  permlink: PropTypes.string,
  searchMap: PropTypes.shape().isRequired,
  currObj: PropTypes.shape(),
  activeFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  socialWobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

SearchAllResult.defaultProps = {
  hasMoreUsers: false,
  hasMore: false,
  showReload: false,
  handleHoveredCard: () => {},
  searchByUser: [],
  searchResult: [],
};

export default connect(
  state => ({
    searchString: getWebsiteSearchString(state),
    isShowResult: getShowSearchResult(state),
    loadingMore: getAllSearchLoadingMore(state),
    hasMore: getHasMoreObjectsForWebsite(state),
    hasMoreUsers: getHasMoreExpertsUsersResults(state),
    wobjectsCounter: getWebsiteSearchResultQuantity(state),
    usersCounter: getSearchUsersResultsQuantity(state),
    activeFilters: getSearchFiltersTagCategory(state),
    searchMap: getWebsiteMap(state),
    currObj: getObject(state),
    // isMapInitialised: getIsMapInitialised(state),
    socialLoading: getSocialSearchResultLoading(state),
    socialWobjects: getSocialSearchResult(state),
  }),
  {
    searchExpertsForMapLoadingMore,
    searchObjectsAutoCompeteLoadingMore,
    setShowSearchResult,
    searchWebsiteObjectsAutoCompete,
    searchExpertsForMap,
    setSocialSearchResults,
    setMapInitialised,
  },
)(injectIntl(SearchAllResult));
