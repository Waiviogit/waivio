import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { isEmpty } from 'lodash';

import { getObject, getPropositionByCampaingObjectPermlink } from '../../../waivioApi/ApiClient';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Proposition from '../reuseble/Proposition/Proposition';

const PropositionList = () => {
  const { requiredObject } = useParams();
  const [propositions, setPropositions] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState(null);

  const getPropositionList = async () => {
    const res = await getPropositionByCampaingObjectPermlink(requiredObject);
    const campParent = await getObject(requiredObject);

    setPropositions(res.rewards);
    setHasMore(res.hasMore);
    setLoading(false);
    setParent(campParent);
  };

  useEffect(() => {
    getPropositionList();
  }, [requiredObject]);

  const handleLoadingMoreRewardsList = async () => {
    setLoading(true);
    try {
      const res = await getPropositionByCampaingObjectPermlink(
        requiredObject,
        propositions?.length,
      );

      setPropositions([...propositions, ...res.rewards]);
      setHasMore(res.hasMore);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>All rewards</h2>
      {isEmpty(propositions) ? (
        <EmptyCampaing />
      ) : (
        <ReduxInfiniteScroll
          loadMore={handleLoadingMoreRewardsList}
          loader={<Loading />}
          loadingMore={loading}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={500}
        >
          {propositions?.map(proposition => (
            <Proposition
              key={proposition?._id}
              proposition={{ ...proposition, object: { ...proposition.object, parent } }}
            />
          ))}
        </ReduxInfiniteScroll>
      )}
    </div>
  );
};

export default PropositionList;
