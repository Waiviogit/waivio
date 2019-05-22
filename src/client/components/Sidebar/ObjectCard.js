import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import './ObjectCard.less';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';

const ObjectCard = ({ wobject, alt, showFollow, isNewWindow, withLinks }) => {
  const name = getFieldWithMaxWeight(wobject, 'name');
  const pathname = `/object/${wobject.author_permlink}`;

  return (
    <div key={wobject.author_permlink} className="ObjectCard">
      <div className="ObjectCard__top">
        {withLinks ? (
          <div className="ObjectCard__links">
            <Link to={{ pathname }} title={name} target={isNewWindow ? '_blank' : null}>
              <ObjectAvatar item={wobject} size={34} />
            </Link>
            <Link
              to={{ pathname }}
              title={name}
              className={`ObjectCard__name ${showFollow ? 'ObjectCard__name-short' : ''}`}
            >
              <span className="username">{name}</span>
            </Link>
          </div>
        ) : (
          <div className="ObjectCard__links">
            <ObjectAvatar item={wobject} size={34} />
            <div className={`ObjectCard__name ${showFollow ? 'ObjectCard__name-short' : ''}`}>
              <span className="username">{name}</span>
            </div>
          </div>
        )}
        {alt && <span className="ObjectCard__alt">{alt}</span>}
      </div>
      <div className="ObjectCard__follow">
        {showFollow && (
          <FollowButton following={wobject.author_permlink} followingType="wobject" secondary />
        )}
      </div>
    </div>
  );
};

ObjectCard.propTypes = {
  wobject: PropTypes.shape().isRequired,
  alt: PropTypes.node,
  showFollow: PropTypes.bool,
  withLinks: PropTypes.bool,
  isNewWindow: PropTypes.bool,
};

ObjectCard.defaultProps = {
  alt: '',
  showFollow: true,
  isNewWindow: false,
  withLinks: true,
};

export default ObjectCard;
