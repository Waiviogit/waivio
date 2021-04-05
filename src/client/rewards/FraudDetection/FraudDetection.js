import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, map, size } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  getAuthenticatedUserName,
  getHasMoreFraudSuspicionData,
  getFraudSuspicionDataState,
  getAuthenticatedUser,
} from '../../store/reducers';
import { getBlacklist, getFraudSuspicion } from '../rewardsActions';
import Proposition from '../Proposition/Proposition';
import SortSelector from '../../components/SortSelector/SortSelector';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import './FraudDetection.less';

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
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
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
  const sortRef = useRef('');

  useEffect(() => {
    if (userName && sortFraudDetection) {
      const requestData = {
        fraudSuspicion: true,
        sort: sortFraudDetection,
      };

      getBlacklistUsers(userName).then(data => {
        const blacklist = get(data, ['value', 'blackList', 'blackList']);
        const blacklistNames = map(blacklist, blacklistUser => blacklistUser.name);

        setBlacklistUsers(blacklistNames);
      });
      setLoadingCampaigns(true);
      if (sortRef.current !== sortFraudDetection) {
        getFraudSuspicionData(requestData).then(() => {
          setLoadingCampaigns(false);
          setLoading(false);
        });
      }
    }
  }, [userName, getFraudSuspicionData, sortFraudDetection, getBlacklistUsers, sort, sortRef]);

  const handleLoadMore = () => {
    if (hasMoreFraudSuspicionData) {
      const requestData = {
        guideName: userName,
        fraudSuspicion: true,
        sort: sortFraudDetection,
        skip: size(fraudSuspicionData),
      };

      getFraudSuspicionData(requestData).then(() => {
        setLoading(false);
      });
    }
  };

  const handleSortChange = useCallback(
    sortChanged => {
      setSortValue(sortChanged);
      sortRef.current = sortChanged;
      const requestData = {
        guideName: userName,
        fraudSuspicion: true,
        sort: sortChanged,
        skip: size(fraudSuspicionData),
      };

      getFraudSuspicionData(requestData).then(() => {
        setLoadingCampaigns(false);
        setLoading(false);
      });
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
      {loadingCampaigns ? (
        <Loading />
      ) : (
        <React.Fragment>
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
              {map(fraudSuspicionData, proposition => {
                const fraudNumbers = get(proposition.users[0], ['fraudCodes'], []);

                return map(
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
                        sortFraudDetection={sortFraudDetection}
                        fraudNumbers={fraudNumbers}
                      />
                    ),
                );
              })}
            </ReduxInfiniteScroll>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

FraudDetection.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
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
