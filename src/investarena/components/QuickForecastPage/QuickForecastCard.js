import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BallotButton from './BallotButton';
import GraphicCaller from './GraphicCaller';

import './QuickForecastCard.less';

const QuickForecastCard = ({ wObject, answerForecast, predictionObject }) => {
  const [onClick, setClick] = useState();
  const disabled = onClick || wObject.active;
  const cardClassList = classNames("forecastCard", {
    "forecastCard__disabled": disabled,
  });
  const handleClick = answer => {
    answerForecast(wObject.author, wObject.permlink, answer);
    setClick(true);
  };
  const predictionText = (prediction) => {
    if(prediction === 'Sell') {
      return `${predictionObject} will fall?`;
    }

      return `${predictionObject} will rise?`;
  };

  return (
      <div className={cardClassList}>
        {/* <img src={wObject.avatar} className="forecastCard__image" alt={wObject.name}/> */}
        <div className="forecastCard__info">
          <div className="forecastCard__top-block">
            <h2 className="forecastCard__title">{ predictionText(wObject.recommend) }</h2>
            <GraphicCaller disabled={disabled} id={wObject.security}/>
          </div>
          <BallotButton disabled={disabled} permlink={wObject.permlink} onClickCB={handleClick}/>
        </div>
      </div>
    )};

QuickForecastCard.propTypes = {
  wObject: PropTypes.shape({
    avatar: PropTypes.string,
    author: PropTypes.string,
    recommend: PropTypes.string,
    security: PropTypes.string,
    permlink: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  answerForecast: PropTypes.func.isRequired,
  predictionObject: PropTypes.string.isRequired,
};

export default QuickForecastCard;
