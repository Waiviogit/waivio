import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  getCurrentUserCards,
  getIsAuthenticated,
  getIsErrorLoadingUserCards,
  getIsHasMoreCards,
  getIsLoadingMoreUserCards,
} from '../../../reducers';
import { ReferralStatusContent } from '../ReferralTextHelper';
import { getMoreUserStatusCards, getUserStatusCards } from '../ReferralActions';
import ReferralUserCard from './UserStatusCard/ReferralUserStatusCard';
import ReduxInfiniteScroll from '../../../vendor/ReduxInfiniteScroll';
import Loading from '../../../components/Icon/Loading';
import { handleLoadMoreUserStatusCards } from '../ReferralHelper';

import './ReferralStatus.less';
import ReferralStatusSort from './ReferralStatusSort/ReferralStatusSort';

const ReferralStatusView = propsData => {
  const {
    username,
    isAuthUser,
    currentUserCards,
    hasMore,
    isErrorLoading,
    isLoadingMoreUserCards,
    getMoreUserCards,
    sortBy,
    setSortBy,
  } = propsData;
  const data = { username };

  const { statusTitle, statusDescription, statusCount, statusPaymentText } = ReferralStatusContent(
    data,
  );

  const handleLoadMore = () => {
    const values = {
      username,
      currentUserCards,
      isLoadingMoreUserCards,
      getMoreUserCards,
    };
    return handleLoadMoreUserStatusCards(values);
  };

  return (
    <React.Fragment>
      {isAuthUser && (
        <div className="ReferralStatus">
          <h2 className="ReferralStatus__title">{statusTitle}</h2>
          <div className="ReferralStatus__description">{statusDescription}</div>
          <div className="ReferralStatus__container">
            <span className="ReferralStatus__container__total-count">{statusCount}</span>
            <span className="ReferralStatus__container__sort-by">
              <ReferralStatusSort handleSortChange={setSortBy} sortBy={sortBy} />
            </span>
          </div>
          <div className="ReferralStatus__user-cards">
            {currentUserCards && (
              <ReduxInfiniteScroll
                loadMore={handleLoadMore}
                hasMore={hasMore}
                elementIsScrollable={false}
                threshold={500}
                loader={
                  !isErrorLoading && (
                    <div className="WalletTable__loader">
                      <Loading />
                    </div>
                  )
                }
              >
                {currentUserCards.map(userCard => (
                  <ReferralUserCard
                    key={`${userCard.name}${userCard.started}`}
                    alias={userCard.alias}
                    username={userCard.name}
                    daysLeft={userCard.daysLeft}
                  />
                ))}
              </ReduxInfiniteScroll>
            )}
          </div>
          <div className="ReferralStatus__payment-text">{statusPaymentText}</div>
        </div>
      )}
    </React.Fragment>
  );
};

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
  } = props;
  const name = match.params.name;

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
  };
  return ReferralStatusView(propsData);
};

ReferralStatus.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  getUserCards: PropTypes.func,
  getMoreUserCards: PropTypes.func,
  currentUserCards: PropTypes.shape(),
  hasMore: PropTypes.bool,
  isErrorLoading: PropTypes.bool,
  isLoadingMoreUserCards: PropTypes.bool,
};

ReferralStatus.defaultProps = {
  getUserCards: () => {},
  getMoreUserCards: () => {},
  currentUserCards: [],
  hasMore: false,
  isErrorLoading: false,
  isLoadingMoreUserCards: false,
};

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  currentUserCards: getCurrentUserCards(state),
  hasMore: getIsHasMoreCards(state),
  isErrorLoading: getIsErrorLoadingUserCards(state),
  isLoadingMoreUserCards: getIsLoadingMoreUserCards(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getUserCards: getUserStatusCards,
    getMoreUserCards: getMoreUserStatusCards,
  })(ReferralStatus),
);
