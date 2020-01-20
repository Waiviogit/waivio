import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';

import BallotTimer from '../BallotTimer';
import USDDisplay from '../../../../client/components/Utils/USDDisplay';
import DynamicPrice from '../DynamycPrice';
import GraphicCaller from '../GraphicCaller';

import './QuickForecastCard.less';

const QuickForecastCard = ({forecast, answerForecast, predictionObjectName, timerData, id, avatar, timerCallback, counter, intl}) => {
  // flags
  const pendingStatus = forecast.status === 'pending';
  const winner = forecast.status === 'guessed';
  const lose = forecast.status === 'finished';
  const side = forecast.side === 'up'
    ? intl.formatMessage({defaultMessage: 'Yes', id: 'forecast_answer_rise'})
    : intl.formatMessage({defaultMessage: 'No', id: 'forecast_answer_fall'});

  // messages
  const forecastFinishMessage = winner
    ? (
      <h2>
        {
          intl.formatMessage({
            id: 'forecast_winner_message',
            defaultMessage: 'You Win!!!'
          })
        }
      </h2>
    ) : (
      <h2>
        {
          intl.formatMessage({
            id: 'forecast_lose_message',
            defaultMessage: 'Try again!!!'
          })
        }
      </h2>
    );

  // classLists
  const forecastCardClassList = classNames('ForecastCard', {
    "ForecastCard--toLose": lose,
    "ForecastCard--win": winner,
  });
  const sideClassList = classNames({
    'green': side === 'Yes',
    'red': side === 'No',
  });

  const handleClick = answer => {
    const expiredTime = Date.now() + timerData;
    answerForecast(forecast.author, forecast.permlink, answer, id, forecast.security, expiredTime, counter);
  };
  const time = timerData * 0.001 / 60;

  return (
    <div className={forecastCardClassList}>
      <div className="ForecastCard__info">
        {
          !forecast.active ? (
            <div className="ForecastCard__to-vote-card-container">
              <div className="ForecastCard__val">
                <div>
                  {
                    intl.formatMessage({
                      id: 'was',
                      defaultMessage: 'Was'
                    })
                  }
                </div>
                <USDDisplay value={+forecast.postPrice}/>
              </div>
              <div className="ForecastCard__flex-container-vertical">
                {
                  pendingStatus ? (
                    <h2 className="ForecastCard__title">
                      <p className="ForecastCard__title-row">
                        <img className="ForecastCard__img ForecastCard__img--little"
                             src={avatar}
                             alt={predictionObjectName}
                        /> {predictionObjectName}
                      </p>
                      <p className="green">
                        {
                          intl.formatMessage({
                            id: 'rise',
                            defaultMessage: 'Rise'
                          })
                        }: <span className={sideClassList}>{side}</span>
                      </p>
                    </h2>
                  ) : forecastFinishMessage
                }
                <div className="ForecastCard__forecast-timer">
                  <BallotTimer
                    endTimerTime={forecast.quickForecastExpiredAt}
                    willCallAfterTimerEnd={timerCallback}
                  />
                </div>
              </div>
              <DynamicPrice
                postPrice={forecast.postPrice}
                secur={forecast.security}
                closedPrice={forecast.endPrice}
              />
            </div>
          ) : (
            <React.Fragment>
              <div className="ForecastCard__top-block">
                <img className="ForecastCard__img" src={avatar} alt={predictionObjectName}/>&#160;
                <p className="ForecastCard__title">
                  {
                    intl.formatMessage({
                        id: 'forecast_question',
                        defaultMessage: '{predictionObjectName} will rise in {time} min?'
                      },
                      {
                        predictionObjectName,
                        time
                      },
                    )
                  }
                </p>
              </div>
              <div className="ballotButton__container">
                <div className="ballotButton__button-container">
                  <button disabled={!forecast.active} onClick={() => handleClick('up', forecast.permlink)}
                          className='ballotButton ballotButton__positive'>
                    {
                      intl.formatMessage({
                        id: 'forecast_answer_rise',
                        defaultMessage: 'Yes'
                      })
                    }
                  </button>
                  <button disabled={!forecast.active} onClick={() => handleClick('down', forecast.permlink)}
                          className='ballotButton ballotButton__negative'>
                    {
                      intl.formatMessage({
                        id: 'forecast_answer_fall',
                        defaultMessage: 'No'
                      })
                    }
                  </button>
                </div>
              </div>
            </React.Fragment>
          )
        }
      </div>
      <GraphicCaller id={forecast.security}/>
    </div>
  )
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
  }).isRequired,
  id: PropTypes.number.isRequired,
  answerForecast: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  timerCallback: PropTypes.func.isRequired,
  predictionObjectName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  timerData: PropTypes.number.isRequired,
  counter: PropTypes.number.isRequired,
};

export default injectIntl(QuickForecastCard);
