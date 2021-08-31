import { map, uniqBy, isEmpty } from 'lodash';
import WobjCardSwitcher from './WobjCardSwitcher';
import React from 'react';
import { connect } from 'react-redux';
import {
  getHasMoreObjectsForWebsite,
  getWebsiteSearchResult,
  getWebsiteSearchResultLoading,
} from '../../../../store/searchStore/searchSelectors';
import { followSearchUser, unfollowSearchUser } from '../../../../store/searchStore/searchActions';
import Loading from '../../../components/Icon/Loading';
import { FormattedMessage } from 'react-intl';

const WobjectsList = props => {
  if (props.loading) return <Loading />;
  if (isEmpty(props.searchResult)) {
    return (
      <div className="SearchAllResult__empty">
        <FormattedMessage id="search_no_result" />
      </div>
    );
  }

  return map(uniqBy(props.searchResult, '_id'), obj => {
    const onMouseOver = () => props.handleHoveredCard(obj.author_permlink);
    const onMouseOut = () => props.handleHoveredCard('');
    const onClick = () => props.handleItemClick(obj);

    return (
      <div
        role="presentation"
        key={obj._id}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      >
        <WobjCardSwitcher obj={obj} />
      </div>
    );
  });
};

export default connect(state => ({
  searchResult: getWebsiteSearchResult(state),
  loading: getWebsiteSearchResultLoading(state),
}))(WobjectsList);
