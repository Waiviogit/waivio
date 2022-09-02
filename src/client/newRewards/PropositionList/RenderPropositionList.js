import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
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
import RewardsFilters from '../Filters/Filters';

import './PropositionList.less';
import { getPropositionsKey } from '../../../common/helpers/newRewardsHelper';
import FiltersForMobile from '../Filters/FiltersForMobile';

const filterConfig = [
  { title: 'Rewards for', type: 'type' },
  { title: 'Sponsors', type: 'sponsors' },
];

const RenderPropositionList = ({
  getProposition,
  tab,
  getPropositionFilters,
  customFilterConfig,
}) => {
  const { requiredObject } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const location = useLocation();
  const [propositions, setPropositions] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [visible, setVisible] = useState(false);
  const search = location.search.replace('?', '&');

  const getFilters = () => getPropositionFilters(requiredObject, authUserName);

  const getPropositionList = async () => {
    if (requiredObject || requiredObject !== parent?.author_permlink) {
      const campParent = await getObject(requiredObject);

      setParent(campParent);
    }

    const res = await getProposition(requiredObject, authUserName, 0, search);

    setPropositions(res.rewards);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    getPropositionList();
  }, [requiredObject, location.search]);

  const handleLoadingMoreRewardsList = async () => {
    setLoading(true);
    try {
      const res = await getProposition(requiredObject, authUserName, propositions?.length, search);

      setPropositions([...propositions, ...res.rewards]);
      setHasMore(res.hasMore);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onClose = () => setVisible(false);

  if (loading && isEmpty(propositions)) return <Loading />;

  return (
    <div className="PropositionList">
      <div className="PropositionList__feed">
        <FiltersForMobile setVisible={setVisible} />
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
            {propositions?.map((proposition, i) => (
              <Proposition
                key={getPropositionsKey(proposition, i)}
                proposition={{
                  ...proposition,
                  requiredObject: parent || proposition?.requiredObject,
                }}
                type={tab}
                getProposition={getPropositionList}
              />
            ))}
          </ReduxInfiniteScroll>
        )}
      </div>
      <div className={'PropositionList__left'}>
        <RewardsFilters
          title={'Filter rewards'}
          getFilters={getFilters}
          config={customFilterConfig}
          visible={visible}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

RenderPropositionList.propTypes = {
  getProposition: PropTypes.func.isRequired,
  getPropositionFilters: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
  customFilterConfig: PropTypes.shape({}).isRequired,
};

RenderPropositionList.defaultProps = {
  customFilterConfig: filterConfig,
};

export default RenderPropositionList;
