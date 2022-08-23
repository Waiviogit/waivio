import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCampaingHistoryList } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configHistoryTableHeader } from '../constants/historyTableConfig';

const HistoryCampaing = ({ guideName, setLoading, loading }) => {
  const [historyList, setHistoryList] = useState();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (loading) {
      getCampaingHistoryList(guideName).then(res => {
        setHistoryList(res.campaigns);
        setHasMore(res.hasMore);
        setHasMore(res.setLoading);
        setLoading(false);
      });
    }
  }, [loading]);

  const handleLoadMore = () =>
    getCampaingHistoryList(guideName, historyList?.length).then(res => {
      setHistoryList([...historyList, ...res.campaigns]);
      setHasMore(res.hasMore);
    });

  return (
    <div>
      <h2>History</h2>
      <DynamicTbl
        header={configHistoryTableHeader}
        bodyConfig={historyList}
        showMore={hasMore}
        handleShowMore={handleLoadMore}
      />
    </div>
  );
};

HistoryCampaing.propTypes = {
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  guideName: PropTypes.string.isRequired,
};

export default HistoryCampaing;
