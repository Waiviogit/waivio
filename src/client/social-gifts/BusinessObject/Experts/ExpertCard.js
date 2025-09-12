import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomImage from '../../../components/Image/Image';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../../../common/constants/waivio';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';

const ExpertCard = ({ expert }) => {
  const history = useHistory();
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const lastAccountUpdate = !isEmpty(authenticatedUser)
    ? moment(authenticatedUser.updatedAt || authenticatedUser.last_account_update).unix()
    : '';
  const defaultUrl =
    expert.name && (expert.name?.includes(GUEST_PREFIX) || expert.name?.includes(BXY_GUEST_PREFIX))
      ? `https://waivio.nyc3.digitaloceanspaces.com/avatar/${expert.name}?${lastAccountUpdate}`
      : `https://images.hive.blog/u/${expert.name}/avatar`;

  return (
    <div className={'ExpertCard'}>
      <CustomImage
        className={'Avatar'}
        onClick={() => history.push(`/@${expert.name}`)}
        src={isEmpty(expert.image) ? defaultUrl : expert.image}
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
