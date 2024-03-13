import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../../../components/Avatar';

const ExpertCard = ({ expert }) => (
  <div className={'ExpertCard'}>
    <Link to={`/@${expert.name}`}>
      <Avatar username={expert.name} isSquare={false} size={130} />
    </Link>
    <br />
    <Link to={`/@${expert.name}`}>{expert.name}</Link>
  </div>
);

ExpertCard.propTypes = {
  expert: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ExpertCard;
