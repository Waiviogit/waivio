import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import {Icon} from 'antd';
import {Link} from 'react-router-dom';

import BallotTimer from '../BallotTimer';
import USDDisplay from '../../../../client/components/Utils/USDDisplay';
import GraphicIcon from '../GraphicIcon';
import DynamicPriceWrapper from '../DynamicPriceWrapper';
import Loading from '../../../../client/components/Icon/Loading';

import './QuickForecastCard.less';

const QuickForecastCard = ({
  forecast,
  answerForecast,
  predictionObjectName,
  timerData,
  id,
  avatar,
  timerCallback,
  counter,
  intl,
  handleAuthorization
}) => {
  // flags
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if(forecast.isLoading) {
      setDisabled(false);
    }
  },);

  const pendingStatus = forecast.status === 'pending';
  const winner = forecast.status === 'guessed';
  const lose = forecast.status === 'finished';
  const side =
    forecast.side === 'up'
      ? intl.formatMessage({ defaultMessage: 'Yes', id: 'forecast_answer_rise' })
      : intl.formatMessage({ defaultMessage: 'No', id: 'forecast_answer_fall' });

  // messages
  const forecastFinishMessage = winner
    ? intl.formatMessage({
        id: 'forecast_winner_message',
        defaultMessage: 'You Win!!!',
      })
   : intl.formatMessage({
        id: 'forecast_lose_message',
        defaultMessage: 'Try again!!!',
      });

  // classLists
  const forecastCardClassList = classNames('ForecastCard', {
    'ForecastCard--toLose': lose,
    'ForecastCard--win': winner,
  });
  const sideClassList = classNames({
    'green': side === 'up',
    'red': side === 'down',
  });
  const forecastsMessage = classNames({
    'green': winner,
    'red': lose,
  });

  const handleClick = answer => {
    setDisabled(true);
    answerForecast(
      forecast.author,
      forecast.permlink,
      forecast.expiredAt,
      answer,
      id,
      forecast.security,
      timerData,
      counter,
    );
  };
  const handleAnswerClick = (answer) => handleAuthorization(() => handleClick(answer));
  const time = (timerData * 0.001) / 60;

  return (
    <div className={forecastCardClassList}>
      <div className="ForecastCard__info">
        {!forecast.active ? (
          <div className="ForecastCard__to-vote-card-container">
            <div className="ForecastCard__val">
              <div>
                {intl.formatMessage({
                  id: 'was',
                  defaultMessage: 'Was',
                })}
              </div>
              <USDDisplay value={+forecast.postPrice} />
            </div>
            <div className="ForecastCard__flex-container-vertical">
                <Link to={`/object/${predictionObjectName}`} className="ForecastCard__title">
                  <p className="ForecastCard__title-row">
                    <img
                      className="ForecastCard__img ForecastCard__img--little"
                      src={avatar}
                      alt={predictionObjectName}
                    />&#160;
                    {predictionObjectName}
                  </p>
                  {pendingStatus ? (
                    <p className="green">
                      {intl.formatMessage({
                        id: 'rise',
                        defaultMessage: 'Rise',
                      })}
                      : <span className={sideClassList}>{side}</span>
                    </p>
                  ) : (
                    <span className={forecastsMessage}>
                      {forecastFinishMessage}
                    </span>
                  )}
                </Link>
              <div className="ForecastCard__forecast-timer">
                <Icon type="clock-circle" />
                &#160;
                <BallotTimer
                  endTimerTime={forecast.quickForecastExpiredAt}
                  willCallAfterTimerEnd={timerCallback}
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
                <img
                  className="ForecastCard__img ForecastCard__img--little"
                  src={avatar}
                  alt={predictionObjectName}
                />
                &#160;
                {intl.formatMessage(
                  {
                    id: 'forecast_question',
                    defaultMessage: '{predictionObjectName} will rise in {time} min?',
                  },
                  {
                    predictionObjectName,
                    time,
                  },
                )}
              </p>
            </div>
            {!forecast.isLoading && disabled && <Loading />}
            <div className="ballotButton__container">
              <div className="ballotButton__button-container">
                <button
                  disabled={disabled}
                  onClick={() => handleAnswerClick('up')}
                  className="ballotButton ballotButton__positive"
                >
                  {intl.formatMessage({
                    id: 'forecast_answer_rise',
                    defaultMessage: 'Yes',
                  })}
                </button>
                <button
                  disabled={disabled}
                  onClick={() => handleAnswerClick('down')}
                  className="ballotButton ballotButton__negative"
                >
                  {intl.formatMessage({
                    id: 'forecast_answer_fall',
                    defaultMessage: 'No',
                  })}
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <GraphicIcon id={forecast.security} />
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
    isLoading: PropTypes.bool
  }).isRequired,
  id: PropTypes.number.isRequired,
  answerForecast: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  timerCallback: PropTypes.func.isRequired,
  handleAuthorization: PropTypes.func.isRequired,
  predictionObjectName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  timerData: PropTypes.number.isRequired,
  counter: PropTypes.number.isRequired,
};

export default injectIntl(QuickForecastCard);
