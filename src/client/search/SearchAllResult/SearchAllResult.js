import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, size } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Dropdown, Icon, Menu } from 'antd';

import UserCard from '../../components/UserCard';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getObjectName } from '../../helpers/wObjectHelper';
import {
  getSearchUsersResults,
  getTagsSite,
  getWebsiteSearchResult,
  getWebsiteSearchType,
} from '../../reducers';
import { getActiveItemClassList } from '../helpers';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import {
  searchObjectsAutoCompeteLoadingMore,
  searchUsersAutoCompeteLoadingMore,
  setWebsiteSearchType,
} from '../searchActions';
import SortSelector from '../../components/SortSelector/SortSelector';
import { SORT_OPTIONS_WOBJ } from '../../../common/constants/waivioFiltres';
import { getWebsiteTags } from '../../websites/websiteActions';

import './SearchAllResult.less';

const SearchAllResult = props => {
  const [sort, setSortType] = useState('weight');
  const filterTypes = ['restaurant', 'dish', 'drink', 'user'];
  const isUsersSearch = props.searchType === 'user';
  const listResults = isUsersSearch ? props.searchByUser : props.searchResult;
  const hasMore = !(size(listResults) % 15);

  useEffect(() => {
    // getWebsiteTags('lucyk.dining.pp.ua');
  });

  const currRenderList = isUsersSearch
    ? props.searchByUser &&
      props.searchByUser.map(user => (
        <UserCard key={user.account} user={{ ...user, name: user.account }} />
      ))
    : props.searchResult &&
      props.searchResult.map(obj => <ObjectCardView wObject={obj} key={getObjectName(obj)} />);

  const menu = (
    <Menu onClick={() => {}}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
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
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button>
                Button <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
          <SortSelector sort={sort} onChange={setSortType}>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.WEIGHT}>
              {props.intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.PROXIMITY}>
              {props.intl.formatMessage({ id: 'proximity', defaultMessage: 'Proximity' })}
            </SortSelector.Item>
          </SortSelector>
        </React.Fragment>
      )}

      {isEmpty(currRenderList) ? (
        <div>List is empty</div>
      ) : (
        <ReduxInfiniteScroll
          className="Feed"
          loadMore={() => {
            props.searchObjectsAutoCompeteLoadingMore('su');
          }}
          loader={<Loading />}
          loadingMore={false}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={1500}
        >
          {currRenderList}
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
  userLocation: PropTypes.shape({}).isRequired,
  searchByUser: PropTypes.arrayOf.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  searchType: PropTypes.string.isRequired,
  filters: PropTypes.shape({}).isRequired,
};

export default connect(
  state => ({
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    filters: getTagsSite(state),
  }),
  {
    searchUsersAutoCompeteLoadingMore,
    setWebsiteSearchType,
    searchObjectsAutoCompeteLoadingMore,
    getWebsiteTags,
  },
)(injectIntl(SearchAllResult));
