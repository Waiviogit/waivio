import React from 'react';

import './DistrictsCard.less';

const DistrictsCard = props => (
  <div className="DistrictsCard">
    <h5 className="DistrictsCard__city">{props.city}</h5>
    <div className="DistrictsCard__counter">{props.counter} restaurants</div>
  </div>
);

export default DistrictsCard;
