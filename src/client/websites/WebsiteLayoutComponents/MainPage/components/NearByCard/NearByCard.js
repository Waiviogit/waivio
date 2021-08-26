import React from 'react';

import './NearByCard.less';

const NearByCard = props => (
  <div className="NearByCard">
    <h5 className="NearByCard__title">{props.name}</h5>
    <img
      src={
        'https://images.unsplash.com/photo-1615366105533-5b8f3255ea5d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80'
      }
      className="NearByCard__image"
    />
  </div>
);

export default NearByCard;
