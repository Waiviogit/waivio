import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './NearByCard.less';

const NearByCard = props => (
  <Link to={`/map?${props.route}&type=dish&showPanel=true`} className="NearByCard">
    <h5 className="NearByCard__title">{props.name}</h5>
    <img src={props.image} className="NearByCard__image" alt={props.name} />
  </Link>
);

export default NearByCard;

NearByCard.propTypes = {
  route: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
