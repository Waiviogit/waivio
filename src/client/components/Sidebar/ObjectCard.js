import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import './ObjectCard.less';

const ObjectCard = ({
  wobject,
  showFollow,
  isNewWindow,
  unfollow,
  alt,
  follow,
  parent,
  isModal,
}) => {
  if (!isEmpty(wobject)) {
    const updatedWObject = { ...wobject };

    if (!wobject.avatar && isEmpty(wobject.parent)) updatedWObject.avatar = parent.avatar;
    const name = getObjectName(wobject);
    const pathname = wobject.defaultShowLink;
    const objectCardClassnames = classnames('ObjectCard__name', {
      'ObjectCard__name-long': isModal,
      'ObjectCard__name-full': isMobile(),
    });

    return (
      <div key={wobject.author_permlink} className="ObjectCard">
        <div className="ObjectCard__top">
          <div className="ObjectCard__links">
            <Link to={pathname} title={name} target={isNewWindow ? '_blank' : null}>
              <ObjectAvatar item={updatedWObject} size={34} />
            </Link>
            <Link to={pathname} title={name} className={objectCardClassnames}>
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
  parent: PropTypes.shape({
    avatar: PropTypes.string,
  }),
  wobject: PropTypes.shape({
    avatar: PropTypes.string,
    defaultShowLink: PropTypes.string,
    author_permlink: PropTypes.string,
    youFollows: PropTypes.bool,
    parent: PropTypes.string,
    count_posts: PropTypes.number,
    menuItems: PropTypes.arrayOf(PropTypes.shape()),
    menuItem: PropTypes.arrayOf(PropTypes.shape()),
  }),
  showFollow: PropTypes.bool,
  alt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isModal: PropTypes.bool,
  isNewWindow: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
};

ObjectCard.defaultProps = {
  showFollow: true,
  isNewWindow: false,
  isSocialProduct: false,
  unfollow: () => {},
  follow: () => {},
  wobject: {},
  parent: {},
};

export default ObjectCard;
