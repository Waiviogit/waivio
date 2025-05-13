import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../components/Icon/Loading';
import EmptyCampaign from '../../statics/EmptyCampaign';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';

const ActiveCampaignContent = ({ isLoading, activeCampaigns, loadMore, hasMore }) => {
  if (!isLoading && isEmpty(activeCampaigns)) return <EmptyCampaign />;
  if (isLoading && isEmpty(activeCampaigns)) return <Loading />;

  return (
    <div>
      <InfiniteScroll
        loadMore={loadMore}
        initialLoad={false}
        hasMore={hasMore}
        loader={<Loading />}
      >
        <div className={'ActiveCampaignList__list'}>
          {activeCampaigns.map(camp => (
            <ShopObjectCard key={camp.id} wObject={camp} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

ActiveCampaignContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  activeCampaigns: PropTypes.arrayOf().isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

export default ActiveCampaignContent;
