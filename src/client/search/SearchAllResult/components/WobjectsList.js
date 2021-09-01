import { map, uniqBy, isEmpty } from 'lodash';
import WobjCardSwitcher from './WobjCardSwitcher';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  getWebsiteSearchResult,
  getWebsiteSearchResultLoading,
} from '../../../../store/searchStore/searchSelectors';
import Loading from '../../../components/Icon/Loading';

const WobjectsList = React.memo(props => {
  if (props.loading) return <Loading />;
  if (isEmpty(props.searchResult)) {
    return (
      <div className="SearchAllResult__empty">
        <FormattedMessage id="search_no_result" />
      </div>
    );
  }
  console.log(props.searchResult);
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
});

export default connect(state => ({
  searchResult: getWebsiteSearchResult(state),
  loading: getWebsiteSearchResultLoading(state),
}))(WobjectsList);
