import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  getAuthenticatedUserName,
  getHasMoreFraudSuspicionData,
  getFraudSuspicionDataState,
  getAuthenticatedUser,
} from '../../reducers';
import { getBlacklist, getFraudSuspicion } from '../rewardsActions';
import Proposition from '../Proposition/Proposition';
import './FraudDetection.less';
import SortSelector from '../../components/SortSelector/SortSelector';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';

const FraudDetection = ({
  intl,
  userName,
  getFraudSuspicionData,
  hasMoreFraudSuspicionData,
  fraudSuspicionData,
  match,
  user,
  setSortValue,
  sortFraudDetection,
  getBlacklistUsers,
  history,
}) => {
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  // const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loading, setLoading] = useState(false);
  const sort = useMemo(
    () => [
      {
        key: 'reservation',
        id: 'paymentTable_reservation',
        defaultMessage: 'Reservation',
      },
      {
        key: 'lastAction',
        id: 'action_date',
        defaultMessage: 'Action (date)',
      },
    ],
    [intl],
  );

  useEffect(() => {
    if (userName && sortFraudDetection) {
      const requestData = {
        guideName: userName,
        fraudSuspicion: true,
        sort: sortFraudDetection,
      };
      console.log('requestData', requestData);
      getBlacklistUsers(userName).then(data => {
        const blacklist = get(data, ['value', 'blackList', 'blackList']);
        const blacklistNames = map(blacklist, blacklistUser => blacklistUser.name);
        setBlacklistUsers(blacklistNames);
      });
      // setLoadingCampaigns(true);
      getFraudSuspicionData(requestData).then(() => {
        // setLoadingCampaigns(false);
        setLoading(false);
      });
    }
  }, [userName, getFraudSuspicionData, sortFraudDetection, getBlacklistUsers, sort]);

  const handleLoadMore = () => {
    if (hasMoreFraudSuspicionData) {
      setLoading(true);
      const requestData = {
        guideName: userName,
        fraudSuspicion: true,
        sort: sortFraudDetection,
        skip: fraudSuspicionData ? fraudSuspicionData.length : 0,
      };
      getFraudSuspicionData(requestData);
    }
  };

  const handleSortChange = useCallback(
    sortChanged => {
      // setLoadingCampaigns(true);
      setSortValue(sortChanged);
      getFraudSuspicionData({ userName, sortChanged });
    },
    [setSortValue, getFraudSuspicionData, userName],
  );

  return (
    <div className="FraudDetection">
      <div className="FraudDetection__title">
        {intl.formatMessage({
          id: 'fraud_detection_assistant',
          defaultMessage: 'Fraud detection assistant',
        })}
      </div>
      <div className="FraudDetection__disclaimer">
        <span>
          {intl.formatMessage({
            id: 'disclaimer',
            defaultMessage: 'Disclaimer',
          })}
        </span>
        :{' '}
        {intl.formatMessage({
          id: 'fraud_detection_disclaimer',
          defaultMessage:
            'It is an experimental service with a limited scope and is provided "as is" with no guarantee of applicability for the detection of probable fraud attempts. All submissions must always be manually verified and confirmed by the campaign sponsor.',
        })}
      </div>
      <SortSelector sort={sortFraudDetection} onChange={handleSortChange}>
        {map(sort, item => (
          <SortSelector.Item key={item.key}>
            <FormattedMessage id={item.id} defaultMessage={item.defaultMessage}>
              {msg => msg}
            </FormattedMessage>
          </SortSelector.Item>
        ))}
      </SortSelector>
      <div className="FraudDetection__data">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMoreFraudSuspicionData}
          loadMore={handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {map(fraudSuspicionData, proposition =>
            map(
              proposition.objects,
              wobj =>
                wobj.object &&
                wobj.object.author_permlink && (
                  <Proposition
                    guide={proposition.guide}
                    proposition={proposition}
                    wobj={wobj.object}
                    assignCommentPermlink={wobj.permlink}
                    authorizedUserName={userName}
                    key={`${wobj.object.author_permlink}`}
                    assigned={wobj.assigned}
                    history={history}
                    user={user}
                    match={match}
                    blacklistUsers={blacklistUsers}
                  />
                ),
            ),
          )}
        </ReduxInfiniteScroll>
      </div>
    </div>
  );
};

FraudDetection.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
  // loading: PropTypes.bool,
  fraudSuspicionData: PropTypes.arrayOf(PropTypes.shape()),
  getFraudSuspicionData: PropTypes.func,
  getBlacklistUsers: PropTypes.func,
  hasMoreFraudSuspicionData: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  setSortValue: PropTypes.func,
  sortFraudDetection: PropTypes.string,
  user: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

FraudDetection.defaultProps = {
  userName: '',
  loading: false,
  fraudSuspicionData: [],
  sortFraudDetection: 'reservation',
  hasMoreFraudSuspicionData: false,
  setSortValue: () => {},
  getFraudSuspicionData: () => {},
  getBlacklistUsers: () => {},
};

export default connect(
  state => ({
    user: getAuthenticatedUser(state),
    userName: getAuthenticatedUserName(state),
    fraudSuspicionData: getFraudSuspicionDataState(state),
    hasMoreFraudSuspicionData: getHasMoreFraudSuspicionData(state),
  }),
  {
    getFraudSuspicionData: getFraudSuspicion,
    getBlacklistUsers: getBlacklist,
  },
)(injectIntl(FraudDetection));
