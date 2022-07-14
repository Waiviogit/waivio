import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { capitalize, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObject } from '../../../waivioApi/ApiClient';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Proposition from '../reuseble/Proposition/Proposition';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

import './PropositionList.less';

const RenderPropositionList = ({ getProposition, tab }) => {
  const { requiredObject } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const [propositions, setPropositions] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);

  const getPropositionList = async () => {
    if (requiredObject) {
      const campParent = await getObject(requiredObject);

      setParent(campParent);
    }

    const res = await getProposition(requiredObject, authUserName);

    setPropositions(res.rewards);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    getPropositionList();
  }, [requiredObject]);

  const handleLoadingMoreRewardsList = async () => {
    setLoading(true);
    try {
      const res = await getProposition(requiredObject, authUserName, propositions?.length);

      setPropositions([...propositions, ...res.rewards]);
      setHasMore(res.hasMore);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  if (loading && isEmpty(propositions)) return <Loading />;

  return (
    <div>
      <div className="PropositionList__breadcrumbs">
        <Link className="PropositionList__parent" to={`/rewards-new/${tab}`}>
          {capitalize(tab)} rewards
        </Link>
        {requiredObject && (
          <div className="PropositionList__parent">
            <span className="PropositionList__icon">&#62;</span>{' '}
            <span>{getObjectName(parent)}</span>
          </div>
        )}
      </div>
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
              type={tab}
            />
          ))}
        </ReduxInfiniteScroll>
      )}
    </div>
  );
};

RenderPropositionList.propTypes = {
  getProposition: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
};

export default RenderPropositionList;
