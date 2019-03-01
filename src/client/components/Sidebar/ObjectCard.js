import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ObjectAvatar from '../ObjectAvatar';
import { getField } from '../../objects/WaivioObject';
import FollowButton from '../../widgets/FollowButton';
import './ObjectCard.less';

const ObjectCard = ({ wobject, alt }) => {
  const name = getField(wobject, 'name');
  const pathname = `/object/${wobject.author_permlink}`;

  return (
    <div key={wobject.author_permlink} className="Object">
      <div className="ObjectCard__top">
        <div className="ObjectCard__links">
          <Link to={{ pathname }} title={name}>
            <ObjectAvatar item={wobject} size={34} />
          </Link>
          <Link to={{ pathname }} title={name} className="ObjectCard__name">
            <span className="username">{name}</span>
          </Link>
          {alt && <div className="ObjectCard__alt">{alt}</div>}
        </div>
        <div className="ObjectCard__follow">
          <FollowButton following={wobject.author_permlink} followingType="wobject" secondary />
        </div>
      </div>
      <div className="ObjectCard__divider" />
    </div>
  );
};

ObjectCard.propTypes = {
  wobject: PropTypes.shape().isRequired,
  alt: PropTypes.node,
};

ObjectCard.defaultProps = {
  alt: '',
};

export default ObjectCard;
