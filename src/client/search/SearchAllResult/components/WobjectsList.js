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
import { getWobjectsPoint } from '../../../../store/websiteStore/websiteSelectors';
import { getIsSocial } from '../../../../store/appStore/appSelectors';

const WobjectsList = React.memo(props => {
  const objects = props.isSocial ? props.socialWobjects : props.searchResult;

  if (props.loading) return <Loading />;
  if (isEmpty(objects)) {
    return (
      <div className="SearchAllResult__empty">
        <FormattedMessage id="search_no_result" />
      </div>
    );
  }

  return map(uniqBy(objects, '_id'), obj => {
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
  searchResult: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  socialWobjects: PropTypes.arrayOf(PropTypes.shape()),
  loading: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool.isRequired,
  handleHoveredCard: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
};

export default connect(state => ({
  searchResult: getWebsiteSearchResult(state),
  isSocial: getIsSocial(state),
  socialWobjects: getWobjectsPoint(state),
  loading: getWebsiteSearchResultLoading(state),
}))(WobjectsList);
