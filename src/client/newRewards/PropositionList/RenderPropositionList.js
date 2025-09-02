import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useRouteMatch } from 'react-router';
import { isEmpty, noop } from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObject, getObjectsRewards } from '../../../waivioApi/ApiClient';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import EmptyCampaing from '../../statics/EmptyCampaign';
import Proposition from '../reuseble/Proposition/Proposition';
import {
  getObjectMap,
  getObjectMapInArray,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import RewardsFilters from '../Filters/Filters';
import { getPropositionsKey } from '../../../common/helpers/newRewardsHelper';
import FiltersForMobile from '../Filters/FiltersForMobile';
import SortSelector from '../../components/SortSelector/SortSelector';
import RewardsMap from '../Map';
import ViewMapButton from '../../widgets/ViewMapButton';
import { getAccount } from '../../../common/helpers/apiHelpers';

import './PropositionList.less';

const filterConfig = [
  { title: 'Rewards for', type: 'type' },
  { title: 'Sponsors', type: 'sponsors' },
];
const sortConfig = [
  { key: 'default', title: 'Default' },
  { key: 'payout', title: 'Payout' },
  { key: 'reward', title: 'Amount' },
  { key: 'date', title: 'Expiry' },
  { key: 'proximity', title: 'Proximity' },
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
  withoutSort,
  withMap,
  emptyMessage,
}) => {
  const { requiredObject } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const location = useLocation();
  const match = useRouteMatch();
  const [propositions, setPropositions] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [sort, setSort] = useState(defaultSort);
  const [visible, setVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const search = location.search.replace('?', '&');
  const isLocation = match.params[0] === 'local';
  const isJudges = tab === 'judges';
  const reqObj = requiredObject?.replace('@', '');

  const getFilters = () => {
    if (!withoutFilters && !isJudges)
      return getPropositionFilters(requiredObject, authUserName, match.params[0]);
    if (isJudges) return getPropositionFilters(authUserName, requiredObject);

    return null;
  };

  const getPropositionList = async () => {
    if (reqObj && reqObj !== parent?.author_permlink) {
      const campParent = requiredObject.includes('@')
        ? await getAccount(reqObj)
        : await getObject(requiredObject);
      const campInfo = await getObjectsRewards(requiredObject, authUserName);

      setParent({ ...campParent, maxReward: campInfo?.main?.maxReward });
    }

    const res = await getProposition(
      requiredObject,
      authUserName,
      0,
      search,
      sort,
      match.params[0],
    );

    setPropositions(res.rewards);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  const getPoints = async () => ({
    rewards: propositions
      .map(propos => ({
        ...propos,
        ...propos.object,
        map: getObjectMap(propos.object) || getObjectMap(propos.requiredObject),
        avatar: propos.object?.avatar || propos.requiredObject?.avatar,
      }))
      .filter(propos => propos.map),
  });

  useEffect(() => {
    getPropositionList();
  }, [requiredObject, location.search, sort]);

  const handleLoadingMoreRewardsList = async () => {
    setLoading(true);
    try {
      const res = await getProposition(
        reqObj,
        authUserName,
        propositions?.length,
        search,
        sort,
        match.params[0],
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
  let parentLink = `/rewards/${tab}`;

  if (['all', 'eligible'].includes(tab)) {
    parentLink =
      tab === 'all' ? `/rewards/${match.params[0]}?showAll=true` : `/rewards/${match.params[0]}`;
  }

  return (
    <div className="PropositionList">
      <div className="PropositionList__feed">
        <FiltersForMobile setVisible={setVisible} />
        <div className="PropositionList__breadcrumbs">
          <Link className="PropositionList__page" to={parentLink}>
            {intl.formatMessage({ id: isJudges ? 'judges' : `${tab}_rewards_new` })}
          </Link>
          {requiredObject && (
            <div className="PropositionList__parent">
              <span className="PropositionList__icon">&#62;</span>{' '}
              <span>{getObjectName(parent)}</span>
            </div>
          )}
        </div>
        <ViewMapButton handleClick={() => setShowMap(true)} />
        {disclaimer && (
          <p className="PropositionList__disclaimer">
            <b>Disclaimer: </b>
            {disclaimer}
          </p>
        )}
        {!withoutSort && (
          <SortSelector sort={sort} onChange={setSort}>
            {customSortConfig.map(item => (
              <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
            ))}
          </SortSelector>
        )}
        {isEmpty(propositions) ? (
          <EmptyCampaing emptyMessage={emptyMessage} />
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
      {(!withoutFilters || isJudges) && (
        <div className={'PropositionList__left'}>
          {withMap && isLocation && (
            <RewardsMap
              getPoints={getPoints}
              parent={parent}
              defaultCenter={getObjectMapInArray(parent)}
              visible={showMap}
              onClose={() => setShowMap(false)}
            />
          )}
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
  emptyMessage: PropTypes.string,
  withoutFilters: PropTypes.bool,
  withoutSort: PropTypes.bool,
  withMap: PropTypes.bool,
  customFilterConfig: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  customSortConfig: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

RenderPropositionList.defaultProps = {
  customFilterConfig: filterConfig,
  customSortConfig: sortConfig,
  getPoints: noop,
  disclaimer: '',
  defaultSort: 'default',
  withoutFilters: false,
  withoutSort: false,
  withMap: false,
};

export default injectIntl(RenderPropositionList);
