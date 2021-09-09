import { map, uniqBy, isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import WobjCardSwitcher from './WobjCardSwitcher';
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

WobjectsList.propTypes = {
  searchResult: PropTypes.arrayOf().isRequired,
  loading: PropTypes.bool.isRequired,
  handleHoveredCard: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
};

export default connect(state => ({
  searchResult: getWebsiteSearchResult(state),
  loading: getWebsiteSearchResultLoading(state),
}))(WobjectsList);
