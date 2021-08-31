import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map, size, uniqBy } from 'lodash';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';

import { getActiveItemClassList } from '../helpers';
import {
  searchObjectsAutoCompeteLoadingMore,
  searchUsersAutoCompeteLoadingMore,
  setShowSearchResult,
  setWebsiteSearchType,
} from '../../../store/searchStore/searchActions';
import Loading from '../../components/Icon/Loading';
import ViewMapButton from '../../widgets/ViewMapButton';
import {
  getAllSearchLoadingMore,
  getHasMoreObjectsForWebsite,
  getHasMoreUsers,
  getShowSearchResult,
  getWebsiteSearchString,
} from '../../../store/searchStore/searchSelectors';
import SearchMapFilters from './components/SearchMapFilters';
import UsersList from './components/UsersList';
import './SearchAllResult.less';
import WobjectsList from './components/WobjectsList';

const SearchAllResult = props => {
  const [isScrolled, setIsScrolled] = useState(false);
  const filterTypes = ['restaurant', 'dish', 'drink', 'Users'];
  const isUsersSearch = props.searchType === 'Users';
  const resultList = useRef();
  const searchResultClassList = classNames('SearchAllResult', {
    SearchAllResult__show: props.isShowResult,
  });

  const handleItemClick = wobj => {
      localStorage.setItem('scrollTop', resultList.current.scrollTop);
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

  return (
    <div className={searchResultClassList}>
      <div
        className="SearchAllResult__toggle-button"
        role="presentation"
        onClick={toggleSearchResultPanel}
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
            <SearchMapFilters />
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
  deleteShowPanel: PropTypes.func.isRequired,
  setQueryInLocalStorage: PropTypes.func.isRequired,
  searchUsersAutoCompeteLoadingMore: PropTypes.func.isRequired,
  searchObjectsAutoCompeteLoadingMore: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}),
  searchByUser: PropTypes.arrayOf(PropTypes.shape({})),
  searchResult: PropTypes.arrayOf(PropTypes.shape({})),
  searchType: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  hasMoreUsers: PropTypes.bool,
  loadingMore: PropTypes.bool.isRequired,
  isShowResult: PropTypes.bool.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  reloadSearchList: PropTypes.func.isRequired,
  handleUrlWithChangeType: PropTypes.func.isRequired,
  setQueryFromSearchList: PropTypes.func.isRequired,
  showReload: PropTypes.bool,
  handleHoveredCard: PropTypes.func,
};

SearchAllResult.defaultProps = {
  userLocation: {},
  hasMoreUsers: false,
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
    hasMoreUsers: getHasMoreUsers(state),
  }),
  {
    searchUsersAutoCompeteLoadingMore,
    setWebsiteSearchType,
    searchObjectsAutoCompeteLoadingMore,
    setShowSearchResult,
  },
)(injectIntl(SearchAllResult));
