import React from 'react';
import PropTypes from 'prop-types';
import { referralStatusContent } from '../ReferralTextHelper';
import { handleLoadMoreUserStatusCards, handleStatusDaysLeft } from '../ReferralHelper';
import ReferralStatusSort from './ReferralStatusSort/ReferralStatusSort';
import ReduxInfiniteScroll from '../../../vendor/ReduxInfiniteScroll';
import Loading from '../../../components/Icon/Loading';
import ReferralUserCard from './UserStatusCard/ReferralUserCard';

const ReferralStatusView = ({ propsData }) => {
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
    history,
  } = propsData;
  const data = { username, currentUserCards };
  const { statusTitle, statusDescription, statusCount, statusPaymentText } = referralStatusContent(
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
            <span className="ReferralStatus__total-count">{statusCount}</span>
            <span className="ReferralStatus__sort-by">
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
                    <div className="ReferralStatus__user-cards__loader">
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
                    daysLeft={handleStatusDaysLeft(userCard.daysLeft)}
                    history={history}
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

ReferralStatusView.propTypes = {
  propsData: PropTypes.shape({
    username: PropTypes.string,
    isAuthUser: PropTypes.bool,
    currentUserCards: PropTypes.shape(),
    hasMore: PropTypes.bool,
    isErrorLoading: PropTypes.bool,
    isLoadingMoreUserCards: PropTypes.bool,
    getMoreUserCards: PropTypes.func,
    sortBy: PropTypes.string,
    setSortBy: PropTypes.func,
    history: PropTypes.shape(),
  }),
};

ReferralStatusView.defaultProps = {
  propsData: PropTypes.shape({
    username: '',
    isAuthUser: false,
    currentUserCards: [],
    hasMore: false,
    isErrorLoading: false,
    isLoadingMoreUserCards: false,
    getMoreUserCards: () => {},
    sortBy: '',
    setSortBy: () => {},
    history: {},
  }),
};

export default ReferralStatusView;
