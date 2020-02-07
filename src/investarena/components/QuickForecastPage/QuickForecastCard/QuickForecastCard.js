import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, message } from 'antd';
import { Link } from 'react-router-dom';

import {
  answerForQuickForecast,
  getForecastStatistic,
  getForecastStatus,
  getForecastWinners,
  loadingForecast,
} from '../../../redux/actions/forecastActions';
import BallotTimer from '../BallotTimer';
import USDDisplay from '../../../../client/components/Utils/USDDisplay';
import ChartIcon from '../ChartIcon';
import DynamicPriceWrapper from '../DynamicPriceWrapper';
import Loading from '../../../../client/components/Icon/Loading';

import './QuickForecastCard.less';

const QuickForecastCard = ({
  forecast,
  predictionObjectName,
  timerData,
  avatar,
  counter,
  intl,
  handleAuthorization,
  disabled,
  link,
}) => {
  const [intervalId, setIntervalId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!forecast.active && !forecast.isLoaded && forecast.status === 'pending' && disabled && !intervalId) {
      const interval = setInterval(() => {
        dispatch(getForecastStatus(forecast.permlink));
      },2000);
      setIntervalId(interval);
    }

    if (forecast.status !== 'pending' && !disabled && intervalId) {
      if (forecast.status === 'guessed') {
        dispatch(getForecastStatistic());
        dispatch(getForecastWinners(5, 0));
      }

      clearInterval(intervalId);
      setIntervalId(null);
    }
  });

  useEffect(() => clearInterval(intervalId), []);

  const pendingStatus = forecast.status === 'pending';
  const winner = forecast.status === 'guessed';
  const lose = forecast.status === 'finished';
  const side =
    forecast.side === 'up' ? (
      <FormattedMessage id="forecast_answer_rise" defaultMessage="Yes" />
    ) : (
      <FormattedMessage id="forecast_answer_fall" defaultMessage="No" />
    );

  const forecastFinishMessage = winner ? (
    <FormattedMessage id="forecast_winner_message" defaultMessage="You Win!!!" />
  ) : (
    <FormattedMessage id="forecast_lose_message" defaultMessage="Try again!!!" />
  );
  const sideClassList = classNames({
    green: forecast.side === 'up',
    red: forecast.side === 'down',
  });
  const forecastsMessage = classNames({
    green: winner,
    red: lose,
  });
  const messageActiveForecast = pendingStatus ? (
    <p className="green">
      <FormattedMessage id="rise" defaultMessage="Rise: " />
      <span className={sideClassList}>{side}</span>
    </p>
  ) : (
    <span className={forecastsMessage}>{forecastFinishMessage}</span>
  );

  // classLists
  const forecastCardClassList = classNames('ForecastCard', {
    'ForecastCard--toLose': lose,
    'ForecastCard--win': winner,
  });
  const handleFinishTimer = () => {
    dispatch(loadingForecast(forecast.id));
  };

  const handleClick = answer => {
    dispatch(
      answerForQuickForecast(
        forecast.author,
        forecast.permlink,
        forecast.expiredAt,
        answer,
        forecast.security,
        forecast.id,
        timerData,
      ),
    )
      .then(() => {
        message.success(
          `${intl.formatMessage({
            id: 'forecast_info_message',
            defaultMessage: 'Forecasts remaining in current round:',
          })} ${4 - counter}`,
        );
      })
      .catch(() =>
        message.error(
          'Not enough RC: you need to replenish the SP or wait until the RC (recovers 20% per day)',
        ),
      );
  };
  const handleAnswerClick = answer => handleAuthorization(() => handleClick(answer));
  const time = (timerData * 0.001) / 60;

  return (
    <div className={forecastCardClassList}>
      <div className="ForecastCard__info">
        {!forecast.active ? (
          <div className="ForecastCard__to-vote-card-container">
            <div className="ForecastCard__val">
              <div>
                <FormattedMessage id="was" defaultMessage="Was" />
              </div>
              <span title={forecast.postPrice}>
                <USDDisplay value={+forecast.postPrice} />
              </span>
            </div>
            <div className="ForecastCard__flex-container-vertical">
              <h2 className="ForecastCard__title">
                <p className="ForecastCard__title-row">
                  <Link className="ForecastCard__link" to={`/object/${link}`}>
                    <img
                      className="ForecastCard__img ForecastCard__img--little"
                      src={avatar}
                      alt={predictionObjectName}
                    />
                    &nbsp;
                    {predictionObjectName}
                  </Link>
                </p>
                {!forecast.isLoaded ? <Loading /> : messageActiveForecast}
              </h2>
              <div className="ForecastCard__forecast-timer">
                <Icon type="clock-circle" />
                &nbsp;
                <BallotTimer
                  endTimerTime={forecast.quickForecastExpiredAt}
                  willCallAfterTimerEnd={handleFinishTimer}
                  isFinish
                />
              </div>
            </div>
            <DynamicPriceWrapper
              postPrice={forecast.postPrice}
              secur={forecast.security}
              closedPrice={forecast.endPrice}
            />
          </div>
        ) : (
          <React.Fragment>
            <div className="ForecastCard__top-block">
              <p className="ForecastCard__title ForecastCard__title-row">
                <Link className="ForecastCard__link" to={`/object/${link}`}>
                  <img
                    className="ForecastCard__img ForecastCard__img--little"
                    src={avatar}
                    alt={predictionObjectName}
                  />
                  &nbsp;
                  {predictionObjectName}
                </Link>
                &nbsp;
                {intl.formatMessage(
                  {
                    id: 'forecast_question',
                    defaultMessage: 'will rise in {time} min?',
                  },
                  { time },
                )}
              </p>
            </div>
            {!forecast.isLoaded && <Loading />}
            <div className="ballotButton__container">
              <div className="ballotButton__button-container">
                <button
                  disabled={disabled}
                  onClick={() => handleAnswerClick('up')}
                  className="ballotButton ballotButton__positive"
                >
                  <FormattedMessage id="forecast_answer_rise" defaultMessage="Yes" />
                </button>
                <button
                  disabled={disabled}
                  onClick={() => handleAnswerClick('down')}
                  className="ballotButton ballotButton__negative"
                >
                  <FormattedMessage id="forecast_answer_fall" defaultMessage="No" />
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <ChartIcon id={forecast.security} />
    </div>
  );
};

QuickForecastCard.propTypes = {
  forecast: PropTypes.shape({
    status: PropTypes.string,
    author: PropTypes.string,
    recommend: PropTypes.string,
    security: PropTypes.string,
    permlink: PropTypes.string,
    endPrice: PropTypes.number,
    quickForecastExpiredAt: PropTypes.number,
    active: PropTypes.bool,
    postPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    side: PropTypes.string,
    expiredAt: PropTypes.string,
    isLoaded: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  handleAuthorization: PropTypes.func.isRequired,
  predictionObjectName: PropTypes.string,
  avatar: PropTypes.string,
  link: PropTypes.string,
  timerData: PropTypes.number.isRequired,
  counter: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

QuickForecastCard.defaultProps = {
  disabled: false,
  avatar: '',
  predictionObjectName: '',
  link: '',
};

export default injectIntl(QuickForecastCard);
