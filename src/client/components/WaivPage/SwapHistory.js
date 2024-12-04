import React, { useEffect } from 'react';
import { getWaivSwapTokensHistory } from '../../../waivioApi/ApiClient';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../Icon/Loading';
import SwapTokenCartForHistory from '../../wallet/TransfersCards/SwapTokenCard/SwapTokenCartForHistory';

const SwapHistory = () => {
  const [swapHistory, setSwapHistory] = React.useState([]);
  const [swapHistoryLoading, setSwapHistoryLoading] = React.useState(true);

  useEffect(() => {
    getWaivSwapTokensHistory(0, 20).then(res => {
      setSwapHistory(res);
      setSwapHistoryLoading(false);
    });
  }, []);

  const handleLoadMore = () => {
    getWaivSwapTokensHistory(swapHistory.result.length, 20).then(res => {
      setSwapHistory({
        result: [...swapHistory.result, ...res.result],
        hasMore: res.hasMore,
      });
    });
  };

  return (
    <div>
      <h2>Trade history</h2>
      {swapHistoryLoading ? (
        <Loading />
      ) : (
        <ReduxInfiniteScroll
          // className={transversClassList}
          loadMore={handleLoadMore}
          hasMore={swapHistory?.hasMore}
          elementIsScrollable={false}
          threshold={300}
          loader={<Loading />}
        >
          {swapHistory?.result.map(transaction => (
            <SwapTokenCartForHistory
              key={transaction._id}
              timestamp={transaction.timestamp}
              symbolTo={transaction.symbolOut}
              quantityTo={transaction.symbolOutQuantity}
              symbolFrom={transaction.symbolIn}
              quantityFrom={transaction.symbolInQuantity}
              from={transaction.account}
            />
          ))}
        </ReduxInfiniteScroll>
      )}
    </div>
  );
};

export default SwapHistory;
