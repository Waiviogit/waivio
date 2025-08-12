import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCampaingHistoryList } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { getCampaignType } from '../../rewards/rewardsHelper';
import { configHistoryTableHeader } from '../constants/historyTableConfig';
import GiveawayDetailsModal from './GiveawayDetailsModal/GiveawayDetailsModal';

const HistoryCampaing = ({ guideName, setLoading, loading }) => {
  const [historyList, setHistoryList] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [showGiveawayDetails, setShowGiveawayDetails] = useState(false);

  useEffect(() => {
    if (loading) {
      getCampaingHistoryList(guideName).then(res => {
        setHistoryList(res.campaigns);
        setHasMore(res.hasMore);
        setLoading(false);
      });
    }
  }, [loading]);

  const handleLoadMore = () =>
    getCampaingHistoryList(guideName, historyList?.length).then(res => {
      setHistoryList([...historyList, ...res.campaigns]);
      setHasMore(res.hasMore);
    });
  const getCustomLink = (name, item) => {
    if (item?.type === 'giveaways')
      return <a onClick={() => setShowGiveawayDetails(item)}>{name}</a>;

    return <a href={`/rewards/details/${item._id}`}>{name}</a>;
  };

  return (
    <div>
      <h2>History</h2>
      <DynamicTbl
        header={configHistoryTableHeader}
        bodyConfig={historyList}
        showMore={hasMore}
        handleShowMore={handleLoadMore}
        getCustomLink={getCustomLink}
        buttons={{ type: item => getCampaignType(item.type) }}
      />
      {showGiveawayDetails && (
        <GiveawayDetailsModal
          visible={Boolean(showGiveawayDetails)}
          onCancel={setShowGiveawayDetails}
          proposition={showGiveawayDetails}
        />
      )}
    </div>
  );
};

HistoryCampaing.propTypes = {
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  guideName: PropTypes.string.isRequired,
};

export default HistoryCampaing;
