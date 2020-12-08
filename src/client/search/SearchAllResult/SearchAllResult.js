import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, size } from 'lodash';

import UserCard from '../../components/UserCard';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectName } from '../../helpers/wObjectHelper';
import {
  getSearchUsersResults,
  getWebsiteSearchResult,
  getWebsiteSearchType,
} from '../../reducers';
import { getActiveItemClassList } from '../helpers';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import {searchUsersAutoCompeteLoadingMore, setWebsiteSearchType} from "../searchActions";

import './SearchAllResult.less';

const SearchAllResult = props => {
  const filterTypes = ['restaurant', 'dish', 'drink', 'user'];
  const isUsersSearch = props.searchType === 'user';
  const listResults = isUsersSearch ? props.searchByUser : props.searchResult;
  const hasMore = !(size(listResults) % 15);

  const currRenderList = isUsersSearch
      ? props.searchByUser &&
      props.searchByUser.map(user => (
        <UserCard key={user.account} user={{ ...user, name: user.account }} />
      ))
      : props.searchResult.map(obj => (
        <ObjectCardView wObject={obj} key={getObjectName(obj)} />
      ));

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
      {isEmpty(currRenderList )
        ? <div>List is empty</div>
        : <ReduxInfiniteScroll
        className="Feed"
        loadMore={() => {
          props.searchUsersAutoCompeteLoadingMore('su');
          console.log('gogogo')
        }}
        loader={<Loading/>}
        loadingMore={false}
        hasMore={hasMore}
        elementIsScrollable={false}
        threshold={1500}
      >
        {currRenderList}
      </ReduxInfiniteScroll>}
    </div>
  );
};

SearchAllResult.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  searchUsersAutoCompeteLoadingMore: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}).isRequired,
  searchByUser: PropTypes.arrayOf.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  searchType: PropTypes.string.isRequired,
};

export default connect(state => ({
  searchType: getWebsiteSearchType(state),
  searchResult: getWebsiteSearchResult(state),
  searchByUser: getSearchUsersResults(state),
}), {
  searchUsersAutoCompeteLoadingMore,
  setWebsiteSearchType,
})(SearchAllResult);
