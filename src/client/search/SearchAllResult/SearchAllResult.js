import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has, isEmpty } from 'lodash';
import Cookie from 'js-cookie';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Modal } from 'antd';
import { useHistory } from 'react-router';
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
import { isMobile } from '../../../common/helpers/apiHelpers';
import {
  setSocialSearchResultLoading,
  setSocialSearchResults,
  setUserSearchResults,
} from '../../../store/websiteStore/websiteActions';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import {
  getIsMapInitialised,
  getSocialSearchResult,
  getSocialSearchResultLoading,
} from '../../../store/websiteStore/websiteSelectors';
import { getBoundsParams, getMapData } from '../../../store/mapStore/mapSelectors';
import useUpdateEffect from '../../../hooks/useUpdateEffect';
import { accessTypesArr, hasDelegation, haveAccess } from '../../../common/helpers/wObjectHelper';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { getUserAdministrator } from '../../../store/appStore/appSelectors';
import { setEditMode } from '../../../store/wObjectStore/wobjActions';
import './SearchAllResult.less';
import ListDescription from '../../social-gifts/ListDescription/ListDescription';

const SearchAllResult = props => {
  const shownMapsToParse = Cookie.get('shownMaps');
  const shownMaps = shownMapsToParse ? JSON.parse(decodeURIComponent(shownMapsToParse)) : [];
  const [isScrolled, setIsScrolled] = useState(false);
  const [infoVisible, setInfoVisible] = useState(
    props.currObj?.author_permlink &&
      !shownMaps?.includes(props.currObj?.author_permlink) &&
      !isMobile(),
  );
  // const isUsersSearch = props.searchType === 'Users';
  const showInfo = has(props.currObj, 'description');
  const resultList = useRef();
  const history = useHistory();

  const accessExtend =
    (haveAccess(props.currObj, props.username, accessTypesArr[0]) && props.isAdministrator) ||
    hasDelegation(props.currObj, props.username);
  const showReload =
    props.isSocial || props.isUserMap ? props.showReload && !props.socialLoading : props.showReload;
  const searchResultClassList = classNames('SearchAllResult SearchAllResult__dining', {
    SearchAllResult__show: props.isShowResult,
    'SearchAllResult--social': props.isSocial || props.isUserMap,
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
              socialMap={props.isUserMap || props.isSocial}
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
      const perml = props.permlink || props.currObj.author_permlink;

      perml &&
        props
          .setSocialSearchResults(perml, {
            topPoint: props.searchMap.topPoint,
            bottomPoint: props.searchMap.bottomPoint,
          })
          .then(() => props.setSocialSearchResultLoading(false));
    } else if (props.isUserMap) {
      props
        .setUserSearchResults(props.user, {
          topPoint: props.searchMap.topPoint,
          bottomPoint: props.searchMap.bottomPoint,
        })
        .then(() => props.setSocialSearchResultLoading(false));
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
    if ((props.isSocial || props.isUserMap) && !isMobile()) {
      props.setShowSearchResult(true);
    }
    if (props.wobjectsCounter && localStorage.getItem('scrollTop')) {
      resultList.current.scrollTo(0, +localStorage.getItem('scrollTop'));
    }

    return () => {
      props.setSocialSearchResultLoading(true);
      localStorage.setItem('scrollTop', resultList.current.scrollTop);
    };
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
  useEffect(() => {
    setInfoVisible(
      props.currObj?.author_permlink &&
        !shownMaps?.includes(props.currObj?.author_permlink) &&
        !isMobile(),
    );
  }, [props.currObj.author_permlink]);

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
  const editObjectClick = () => {
    props.setEditMode(true);
    if (history?.location?.pathname === '/') {
      history.push(`/object/${props.currObj.author_permlink}`);
    }
  };

  const closeInfoModal = () => {
    setInfoVisible(false);
    if (!shownMaps?.includes(props.currObj?.author_permlink)) {
      shownMaps.push(props.currObj?.author_permlink.trim());

      Cookie.set('shownMaps', encodeURIComponent(JSON.stringify(shownMaps)));
    }
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
      <div className="SearchAllResult__main-wrap" ref={resultList} onScroll={getEndScroll}>
        {!props.isSocial && !props.isUserMap && <SearchMapFilters />}
        <div
          className={showReload ? 'SearchAllResult__buttons-wrap' : 'SearchAllResult__edit-wrap'}
        >
          {' '}
          {showReload && (
            <ReloadButton
              className="SearchAllResult__reload"
              reloadSearchList={props.reloadSearchList}
            />
          )}
          <div className="Breadcrumbs__edit-container">
            {accessExtend && props.authenticated && (
              <Button onClick={editObjectClick}>
                {props.intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
              </Button>
            )}
            {props.isSocial && showInfo && (
              <Icon
                type="info-circle"
                className="main-color-button info-button"
                onClick={() => setInfoVisible(true)}
              />
            )}
          </div>
        </div>
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
      {showInfo && (
        <Modal
          width={'90%'}
          title={props.currObj?.name || props.currObj?.default_name}
          onCancel={closeInfoModal}
          footer={[
            <Button key="Ok" type="primary" onClick={closeInfoModal}>
              <FormattedMessage id="ok" defaultMessage="Ok" />
            </Button>,
          ]}
          visible={infoVisible}
        >
          <ListDescription isMap wobject={props.currObj} />
        </Modal>
      )}
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
  authenticated: PropTypes.bool,
  isUserMap: PropTypes.bool,
  isAdministrator: PropTypes.bool,
  handleHoveredCard: PropTypes.func,
  setEditMode: PropTypes.func,
  setSocialSearchResults: PropTypes.func,
  setUserSearchResults: PropTypes.func,
  setSocialSearchResultLoading: PropTypes.func,
  searchWebsiteObjectsAutoCompete: PropTypes.func.isRequired,
  searchExpertsForMap: PropTypes.func.isRequired,
  permlink: PropTypes.string,
  username: PropTypes.string,
  user: PropTypes.string,
  searchMap: PropTypes.shape().isRequired,
  currObj: PropTypes.shape(),
  activeFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
    isMapInitialised: getIsMapInitialised(state),
    socialLoading: getSocialSearchResultLoading(state),
    socialWobjects: getSocialSearchResult(state),
    boundsParams: getBoundsParams(state),
    mapData: getMapData(state),
    username: getAuthenticatedUserName(state),
    authenticated: getIsAuthenticated(state),
    isAdministrator: getUserAdministrator(state),
  }),
  {
    searchExpertsForMapLoadingMore,
    searchObjectsAutoCompeteLoadingMore,
    setShowSearchResult,
    searchWebsiteObjectsAutoCompete,
    searchExpertsForMap,
    setSocialSearchResults,
    setUserSearchResults,
    setSocialSearchResultLoading,
    setEditMode,
  },
)(injectIntl(SearchAllResult));
