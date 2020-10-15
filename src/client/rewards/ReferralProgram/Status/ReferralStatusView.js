import React from 'react';
import { ReferralStatusContent } from '../ReferralTextHelper';
import { handleLoadMoreUserStatusCards, handleStatusDaysLeft } from '../ReferralHelper';
import ReferralStatusSort from './ReferralStatusSort/ReferralStatusSort';
import ReduxInfiniteScroll from '../../../vendor/ReduxInfiniteScroll';
import Loading from '../../../components/Icon/Loading';
import ReferralUserCard from './UserStatusCard/ReferralUserStatusCard';

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
    history,
  } = propsData;
  const data = { username, currentUserCards };

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

export default ReferralStatusView;
