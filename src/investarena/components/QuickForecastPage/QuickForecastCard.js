import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BallotButton from './BallotButton';
import GraphicCaller from './GraphicCaller';

import './QuickForecastCard.less';

const QuickForecastCard = ({ wObject, answerForecast }) => {
  const [onClick, setClick] = useState();

  const disabled = onClick || wObject.wasClicked;
  const cardClassList = classNames("forecastCard", {
    "forecastCard__disabled": disabled,
  });
  const handleClick = answer => {
    answerForecast(answer);
    setClick(true);
  };

  return (
      <div className={cardClassList}>
        <img src={wObject.avatar} className="forecastCard__image" alt={wObject.name}/>
        <div className="forecastCard__info">
          <div className="forecastCard__top-block">
            <h2>{wObject.name}</h2>
            <GraphicCaller disabled={disabled} id={wObject.chartid}/>
          </div>
          <p className="forecastCard__title">{wObject.title}</p>
          <BallotButton disabled={disabled} permlink={wObject.permlink} onClickCB={handleClick}/>
        </div>
      </div>
    )};

QuickForecastCard.propTypes = {
  wObject: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    author_permlink: PropTypes.string,
    chartid: PropTypes.string,
    permlink: PropTypes.string,
    wasClicked: PropTypes.bool,
  }).isRequired,
  answerForecast: PropTypes.func.isRequired,
};

export default QuickForecastCard;
