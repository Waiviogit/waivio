import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import CustomImage from '../../../components/Image/Image';
import { parseJSON } from '../../../../common/helpers/parseJSON';
import { getProxyImageURL } from '../../../../common/helpers/image';
import { getAvatarURL } from '../../../components/Avatar';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import { getUser } from '../../../../store/usersStore/usersSelectors';

const ExpertCard = ({ expert }) => {
  const history = useHistory();
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const authUser = useSelector(state => getUser(state, authenticatedUser.name));

  let url = getAvatarURL(expert.name, 130, authenticatedUser);

  if (expert.name === authUser?.name) {
    const profileImage = parseJSON(authUser?.posting_json_metadata)?.profile?.profile_image;
    const proxyProfileImage = profileImage?.includes('images.hive.blog')
      ? profileImage
      : getProxyImageURL(profileImage);

    url = profileImage ? proxyProfileImage : url;
  }

  return (
    <div className={'ExpertCard'}>
      <CustomImage
        className={'Avatar'}
        onClick={() => history.push(`/@${expert.name}`)}
        src={url}
        alt={''}
      />
      <br />
      <Link to={`/@${expert.name}`}>{expert.name}</Link>
    </div>
  );
};

ExpertCard.propTypes = {
  expert: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ExpertCard;
