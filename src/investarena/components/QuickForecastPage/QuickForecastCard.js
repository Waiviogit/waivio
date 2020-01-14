import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import GraphicCaller from './GraphicCaller';

import './QuickForecastCard.less';
import BallotTimer from "./BallotTimer";
import USDDisplay from "../../../client/components/Utils/USDDisplay";

const QuickForecastCard = ({forecast, answerForecast, predictionObjectName, price}) => {
  const [onClick, setClick] = useState();
  const currentTime = Date.now();
  const finish = Date.parse(forecast.expiredAt);
  const disabled = onClick || !forecast.active;
  const cardClassList = classNames("forecastCard", {
    "forecastCard__disabled": disabled,
  });
  const handleClick = answer => {
    // answerForecast(wObject.author, wObject.permlink, answer, price);
    setClick(true);
  };

  const predictionText = (prediction) => {
    if (prediction === 'Sell') {
      return `${predictionObjectName} will fall?`;
    }

    return `${predictionObjectName} will rise?`;
  };

  let minutes = (finish - currentTime) * 0.001 / 60;
  let hours;

  if (minutes > 60) {
    hours = Math.floor(minutes / 60);
    minutes -= (hours * 60);
  }

  if (minutes < 0) {
    minutes = 0;
    hours = 0;
  }

  return (
    <div className={cardClassList}>
      {
        forecast.active && (
        <div className="forecastCard__to-vote-card">
          <div className="forecastCard__to-vote-timer">
            <BallotTimer hours={hours} minutes={minutes} replay={false} expired={finish}/>
          </div>
          <div className="forecastCard__to-vote-card-container">
            <div className="forecastCard__val">
              {/*{price}*/}
              14
            </div>
            <div className="forecastCard__val">
              {/*<USDDisplay value={+price}/>*/}
              14
            </div>
          </div>
          <div className="forecastCard__to-vote-graphic">
            <GraphicCaller disabled={disabled} id={forecast.security}/>
          </div>
        </div>
        )
      }
      <div className="forecastCard__info">
        <div className="forecastCard__top-block">
          <h2 className="forecastCard__title">{predictionText(forecast.recommend)}</h2>
          <GraphicCaller disabled={disabled} id={forecast.security}/>
        </div>
        <div className="ballotButton__container">
          <div className="ballotButton__button-container">
            <button disabled={disabled} onClick={() => handleClick('up', forecast.permlink)}
                    className='ballotButton ballotButton__positive'>
              Yes
            </button>
            <button disabled={disabled} onClick={() => handleClick('down', forecast.permlink)}
                    className='ballotButton ballotButton__negative'>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

QuickForecastCard.propTypes = {
  forecast: PropTypes.shape({
    createdAt: PropTypes.string,
    expiredAt: PropTypes.string,
    avatar: PropTypes.string,
    author: PropTypes.string,
    recommend: PropTypes.string,
    security: PropTypes.string,
    permlink: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  answerForecast: PropTypes.func.isRequired,
  predictionObjectName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

QuickForecastCard.defaultProps = {
  forecast: {
    "_id": "5e1c9f7face3080c161a91c8",
    "author_count_forecasts": 1,
    "priority_counter": 3,
    "active": true,
    "market": "Stock",
    "visible_marker": 0,
    "id": "sor31/testing",
    "author": "sor31",
    "permlink": "testing",
    "createdAt": "2020-01-13T16:48:58.000Z",
    "security": "ABBV",
    "recommend": "Sell",
    "expiredAt": "2020-01-13T17:18:58.000Z",
    "__v": 0
  },
};

export default QuickForecastCard;
