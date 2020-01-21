import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

import QuickForecastCard from './QuickForecastCard/QuickForecastCard';
import Loading from '../../../client/components/Icon/Loading';
import BallotTimer from './BallotTimer';
import TopPredictors from './TopPredictions/TopPredictors';
import USDDisplay from '../../../client/components/Utils/USDDisplay';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import { marketNames } from '../../constants/objectsInvestarena';
import {
  answerForQuickForecast,
  getDataForQuickForecast,
  getForecastRoundRewards,
  getForecastStatistic,
  getForecastWinners,
} from '../../redux/actions/forecastActions';

import './QuickForecastPage.less';

const QuickForecastPage = props => {
  const [sortBy, setSort] = useState();
  const [isLoading, pageLoading] = useState(false);
  const [currentTime, setTime] = useState();
  const winnersLimit = 5;

  useEffect(() => {
    props.getDataForQuickForecast();
    props.getForecastStatistic();
    props.getForecastWinners(winnersLimit, 0);
    props.getForecastRoundRewards();
    setTime(Date.now());

    setTimeout(() => pageLoading(true), 3000);
  }, []);

  const getSortItemKey = type => (type.name === 'Reset' ? '' : type.name);

  const filtersType = [
    {
      name: 'Reset',
      key: '',
      intl: {
        id: 'reset_filter',
        defaultMessage: 'Reset',
      },
    },
    ...marketNames,
  ];

  function handleSort(sort) {
    setSort(sort);
  }

  function handleFinishTimer() {
    pageLoading(false);

    setTimeout(() => {
      props.getDataForQuickForecast();
      props.getForecastRoundRewards();
      pageLoading(true);
    }, 1000);

    if (props.hasMore) {
      props.getForecastWinners(winnersLimit, props.winners.length);
    }
  }
  const filterForecastList = props.quickForecastDataList.filter(
    obj => obj.market === sortBy && obj.active,
  );
  const answeredForecastList = props.quickForecastDataList.filter(forecast => !forecast.active);
  const forecastList = sortBy
    ? [...answeredForecastList, ...filterForecastList]
    : props.quickForecastDataList;
  const currentForecastList =
    answeredForecastList.length === 5 ? answeredForecastList : forecastList;
  const secondsInMilliseconds = sec => sec / 0.001;
  const finishRoundTime = props.roundTime && currentTime + secondsInMilliseconds(props.roundTime);

  return (
    <div className="shifted">
      <div className="feed-layout container">
        <h1 className="head-title">
          Guess and get money
          <br />
          absolutely
          <span className="free"> FREE</span>
        </h1>
        <div className="leftContainer">
          <div className="rules" title={
            props.intl.formatMessage({
              id: 'how_it_work',
              defaultMessage: 'How it works?',
            })
          }>
            <Link to="#" className="rules__link">
              {props.intl.formatMessage({
                id: 'how_it_work',
                defaultMessage: 'How it works?',
              })}
              &#160;
            </Link>
            <Icon type="question-circle" />
          </div>
          <TopPredictors userList={props.usersList} title="Top 5 Users" activeUser={props.user} />
        </div>
        <div className="center">
          {isLoading ? (
            <React.Fragment>
              <div className="timer-container">
                <BallotTimer
                  endTimerTime={finishRoundTime}
                  willCallAfterTimerEnd={() => handleFinishTimer()}
                />
              </div>
              <SortSelector caption="Filter" sort={sortBy} onChange={sort => handleSort(sort)}>
                {filtersType.map(type => (
                  <SortSelector.Item key={getSortItemKey(type)}>
                    {props.intl.formatMessage({
                      id: type.intl.id,
                      defaultMessage: type.intl.defaultMessage,
                    })}
                  </SortSelector.Item>
                ))}
              </SortSelector>
              {currentForecastList.map((obj, index) => (
                <QuickForecastCard
                  forecast={obj}
                  key={Math.random()}
                  predictionObjectName={
                    props.quotesSett[obj.security] && props.quotesSett[obj.security].name
                  }
                  avatar={
                    props.quotesSett[obj.security] &&
                    props.quotesSett[obj.security].wobjData.avatarlink
                  }
                  answerForecast={props.answerForQuickForecast}
                  getForecast={props.getDataForQuickForecast}
                  timerData={secondsInMilliseconds(props.timeForTimer)}
                  id={index}
                  timerCallback={() => handleFinishTimer()}
                  counter={answeredForecastList.length}
                />
              ))}
            </React.Fragment>
          ) : (
            <Loading />
          )}
          {isLoading && !forecastList.length && (
            <div className="no-posts">
              {props.intl.formatMessage({
                id: 'no_quick_forecasts',
                defaultMessage: 'There are currently no forecasts in this category',
              })}
            </div>
          )}
        </div>
        <div className="rightContainer">
          <div className="reward">
            <span className="reward__row">
              {props.intl.formatMessage({
                id: 'forecasts__rewards',
                defaultMessage: 'Rewards',
              })}
              :&#160;
              <USDDisplay value={props.roundInformation.rewards} />
            </span>
            <span className="reward__row">
              {props.intl.formatMessage({
                id: 'forecast_round',
                defaultMessage: 'Current round',
              })}
              :&#160;
              <USDDisplay value={props.roundInformation.voitingPowers} />
            </span>
          </div>
          <TopPredictors
            userList={props.winners}
            title="Current round winners"
            activeUser={props.user}
            showMore={props.hasMore}
          />
        </div>
      </div>
    </div>
  );
};

QuickForecastPage.propTypes = {
  quickForecastDataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  answerForQuickForecast: PropTypes.func.isRequired,
  getDataForQuickForecast: PropTypes.func.isRequired,
  getForecastRoundRewards: PropTypes.func.isRequired,
  getForecastWinners: PropTypes.func.isRequired,
  getForecastStatistic: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  quotesSett: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.number,
  }),
  usersList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      successful_suppose: PropTypes.number,
    }),
  ).isRequired,
  winners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hasMore: PropTypes.bool,
  roundTime: PropTypes.number,
  timeForTimer: PropTypes.number.isRequired,
  roundInformation: PropTypes.shape({
    rewards: PropTypes.number,
    voitingPowers: PropTypes.number,
  }).isRequired,
};

QuickForecastPage.defaultProps = {
  user: {
    name: '',
    successful_suppose: 0,
  },
  hasMore: false,
  roundTime: 0,
};

const mapStateToProps = state => ({
  quickForecastDataList: state.forecasts.quickForecastData,
  quotesSett: state.quotesSettings,
  usersList: state.forecasts.userStatistics,
  user: state.forecasts.current,
  winners: state.forecasts.winners,
  hasMore: state.forecasts.hasMoreStatistic,
  timeForTimer: state.forecasts.timer,
  roundInformation: state.forecasts.roundInfo,
  roundTime: state.forecasts.roundTime,
});

const mapDispatchToProps = {
  answerForQuickForecast,
  getDataForQuickForecast,
  getForecastWinners,
  getForecastStatistic,
  getForecastRoundRewards,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuickForecastPage));
