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
import {
  getSocialSearchResult,
  getSocialSearchResultLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import { getIsSocial } from '../../../../store/appStore/appSelectors';

const WobjectsList = React.memo(props => {
  const objects = props.isSocial ? props.socialWobjects : props.searchResult;
  const loading = props.isSocial ? props.socialLoading : props.websiteLoading;

  if (isEmpty(objects) && !loading) {
    return (
      <div className="SearchAllResult__empty">
        <FormattedMessage id="search_no_result" />
      </div>
    );
  }

  return loading ? (
    <Loading />
  ) : (
    map(uniqBy(objects, '_id'), obj => {
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
    })
  );
});

WobjectsList.propTypes = {
  searchResult: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  socialWobjects: PropTypes.arrayOf(PropTypes.shape()),
  websiteLoading: PropTypes.bool,
  socialLoading: PropTypes.bool,
  isSocial: PropTypes.bool.isRequired,
  handleHoveredCard: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
};

export default connect(state => ({
  searchResult: getWebsiteSearchResult(state),
  isSocial: getIsSocial(state),
  socialWobjects: getSocialSearchResult(state),
  websiteLoading: getWebsiteSearchResultLoading(state),
  socialLoading: getSocialSearchResultLoading(state),
}))(WobjectsList);
