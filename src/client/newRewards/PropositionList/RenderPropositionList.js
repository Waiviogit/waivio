import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObject } from '../../../waivioApi/ApiClient';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Proposition from '../reuseble/Proposition/Proposition';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import RewardsFilters from '../Filters/Filters';
import { getPropositionsKey } from '../../../common/helpers/newRewardsHelper';
import FiltersForMobile from '../Filters/FiltersForMobile';

import './PropositionList.less';
import SortSelector from '../../components/SortSelector/SortSelector';

const filterConfig = [
  { title: 'Rewards for', type: 'type' },
  { title: 'Sponsors', type: 'sponsors' },
];
const sortConfig = [
  { key: 'default', title: 'default' },
  { key: 'payout', title: 'payout' },
  { key: 'reward', title: 'amount' },
  { key: 'date', title: 'expiry' },
  { key: 'proximity', title: 'proximity' },
];

const RenderPropositionList = ({
  getProposition,
  tab,
  getPropositionFilters,
  customFilterConfig,
  disclaimer,
  withoutFilters,
  intl,
  customSortConfig,
  defaultSort,
}) => {
  const { requiredObject } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const location = useLocation();
  const [propositions, setPropositions] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [sort, setSort] = useState(defaultSort);
  const [visible, setVisible] = useState(false);
  const search = location.search.replace('?', '&');

  const getFilters = () => {
    if (!withoutFilters) return getPropositionFilters(requiredObject, authUserName);

    return null;
  };

  const getPropositionList = async () => {
    if (requiredObject && requiredObject !== parent?.author_permlink) {
      const campParent = await getObject(requiredObject);

      setParent(campParent);
    }

    const res = await getProposition(requiredObject, authUserName, 0, search, sort);

    setPropositions(res.rewards);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    getPropositionList();
  }, [requiredObject, location.search, sort]);

  const handleLoadingMoreRewardsList = async () => {
    setLoading(true);
    try {
      const res = await getProposition(
        requiredObject,
        authUserName,
        propositions?.length,
        search,
        sort,
      );

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
            {intl.formatMessage({ id: `${tab}_rewards_new` })}
          </Link>
          {requiredObject && (
            <div className="PropositionList__parent">
              <span className="PropositionList__icon">&#62;</span>{' '}
              <span>{getObjectName(parent)}</span>
            </div>
          )}
        </div>
        {disclaimer && (
          <p className="PropositionList__disclaimer">
            <b>Disclaimer: </b>
            {disclaimer}
          </p>
        )}
        <SortSelector sort={sort} onChange={setSort}>
          {customSortConfig.map(item => (
            <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
          ))}
        </SortSelector>
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
      {!withoutFilters && (
        <div className={'PropositionList__left'}>
          <RewardsFilters
            title={'Filter rewards'}
            getFilters={getFilters}
            config={customFilterConfig}
            visible={visible}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
};

RenderPropositionList.propTypes = {
  getProposition: PropTypes.func.isRequired,
  getPropositionFilters: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
  disclaimer: PropTypes.string,
  defaultSort: PropTypes.string,
  withoutFilters: PropTypes.bool,
  customFilterConfig: PropTypes.shape({}).isRequired,
  customSortConfig: PropTypes.arrayOf({}).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

RenderPropositionList.defaultProps = {
  customFilterConfig: filterConfig,
  customSortConfig: sortConfig,
  disclaimer: '',
  defaultSort: 'default',
  withoutFilters: false,
};

export default injectIntl(RenderPropositionList);
