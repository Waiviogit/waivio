import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ObjectAvatar from '../ObjectAvatar';
import { getField } from '../../objects/WaivioObject';
import FollowButton from '../../widgets/FollowButton';
import './ObjectComponent.less';
// import WeightTag from '../WeightTag';

const ObjectComponent = ({ item }) => {
  const name = getField(item, 'name');
  const pathName = `/object/${item.author_permlink}/${item.default_name || ''}`;
  return (
    <div key={item.author_permlink} className="Object">
      <div className="Object__top">
        <div className="Object__links">
          <Link to={{ pathname: pathName }} title={name}>
            <ObjectAvatar item={item} size={34} />
          </Link>
          <Link to={{ pathname: pathName }} title={name} className="Object__name">
            <span className="username">{name}</span>
          </Link>
          {/* <WeightTag weight={item.weight} /> */}
        </div>
        <div className="Object__follow">
          <FollowButton following={item.author_permlink} followingType="wobject" secondary />
        </div>
      </div>
      <div className="Object__divider" />
    </div>
  );
};

ObjectComponent.propTypes = {
  item: PropTypes.shape().isRequired,
};

export default ObjectComponent;
