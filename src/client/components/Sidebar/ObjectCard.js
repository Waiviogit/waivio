import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

import './ObjectCard.less';

const ObjectCard = ({ wobject, alt, showFollow, isNewWindow, unfollow, follow }) => {
  if (!isEmpty(wobject)) {
    const name = getObjectName(wobject);
    const pathname = wobject.defaultShowLink;

    return (
      <div key={wobject.author_permlink} className="ObjectCard">
        <div className="ObjectCard__top">
          <div className="ObjectCard__links">
            <Link to={pathname} title={name} target={isNewWindow ? '_blank' : null}>
              <ObjectAvatar item={wobject} size={34} />
            </Link>
            <Link
              to={pathname}
              title={name}
              className={`ObjectCard__name ${showFollow ? 'ObjectCard__name-short' : ''}`}
            >
              {name}
            </Link>
          </div>
          {alt && <span className="ObjectCard__alt">{alt}</span>}
        </div>
        <div className="ObjectCard__follow">
          {showFollow && (
            <FollowButton
              wobj={wobject}
              following={wobject.youFollows}
              followingType="wobject"
              unfollowObject={unfollow}
              followObject={follow}
              secondary
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};

ObjectCard.propTypes = {
  wobject: PropTypes.shape(),
  alt: PropTypes.node,
  showFollow: PropTypes.bool,
  isNewWindow: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
};

ObjectCard.defaultProps = {
  alt: '',
  showFollow: true,
  isNewWindow: false,
  unfollow: () => {},
  follow: () => {},
  wobject: {},
};

export default ObjectCard;
