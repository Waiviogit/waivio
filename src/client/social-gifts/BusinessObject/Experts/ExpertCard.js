import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import CustomImage from '../../../components/Image/Image';

const ExpertCard = ({ expert }) => {
  const history = useHistory();

  return (
    <div className={'ExpertCard'}>
      <CustomImage
        className={'Avatar'}
        onClick={() => history.push(`/@${expert.name}`)}
        src={expert.image}
      />
      <br />
      <Link to={`/@${expert.name}`}>{expert.name}</Link>
    </div>
  );
};

ExpertCard.propTypes = {
  expert: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default ExpertCard;
