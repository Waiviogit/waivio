import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  getMoreUserStatusCards,
  getUserStatusCards,
} from '../../../store/referralStore/ReferralActions';
import ReferralStatusView from './ReferralStatusView';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import {
  getCurrentUserCards,
  getIsErrorLoadingUserCards,
  getIsHasMoreCards,
  getIsLoadingMoreUserCards,
} from '../../../store/referralStore/referralSelectors';

import './ReferralStatus.less';

const ReferralStatus = props => {
  const {
    match,
    isAuthenticated,
    getUserCards,
    currentUserCards,
    hasMore,
    isErrorLoading,
    isLoadingMoreUserCards,
    getMoreUserCards,
    history,
  } = props;
  const name = match.params.userName;

  const [sortBy, setSortBy] = useState('recency');

  useEffect(() => {
    getUserCards(name, sortBy);
  }, [sortBy]);

  const propsData = {
    username: name,
    isAuthUser: isAuthenticated,
    currentUserCards,
    hasMore,
    isErrorLoading,
    isLoadingMoreUserCards,
    getMoreUserCards,
    sortBy,
    setSortBy,
    history,
  };

  return <ReferralStatusView propsData={propsData} />;
};

ReferralStatus.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  getUserCards: PropTypes.func,
  getMoreUserCards: PropTypes.func,
  currentUserCards: PropTypes.shape(),
  hasMore: PropTypes.bool,
  isErrorLoading: PropTypes.bool,
  isLoadingMoreUserCards: PropTypes.bool,
  history: PropTypes.shape(),
  match: PropTypes.shape(),
};

ReferralStatus.defaultProps = {
  getUserCards: () => {},
  getMoreUserCards: () => {},
  currentUserCards: [],
  hasMore: false,
  isErrorLoading: false,
  isLoadingMoreUserCards: false,
  history: {},
  match: {},
};

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  currentUserCards: getCurrentUserCards(state),
  hasMore: getIsHasMoreCards(state),
  isErrorLoading: getIsErrorLoadingUserCards(state),
  isLoadingMoreUserCards: getIsLoadingMoreUserCards(state),
});

export default connect(mapStateToProps, {
  getUserCards: getUserStatusCards,
  getMoreUserCards: getMoreUserStatusCards,
})(injectIntl(ReferralStatus));
