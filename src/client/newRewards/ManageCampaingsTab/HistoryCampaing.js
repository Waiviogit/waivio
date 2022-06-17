import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCampaingHistoryList } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configHistoryTableHeader } from '../constants/historyTableConfig';

const HistoryCampaing = ({ guideName }) => {
  const [historyList, setHistoryList] = useState();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getCampaingHistoryList(guideName).then(res => {
      setHistoryList(res.campaigns);
      setHasMore(res.hasMore);
    });
  }, []);

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
  guideName: PropTypes.string.isRequired,
};

export default HistoryCampaing;
