import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import './ObjectComponent.less';
import WeightTag from '../WeightTag';

const getObjectUrl = item => {
  const o = _.find(item.fields, ['name', 'avatarImage']);
  return o ? o.body : null;
};

const ObjectComponent = ({ item }) => (
  <div key={item.tag} className="Object">
    <div className="Object__top">
      <div className="Object__links">
        <Link to={`/@${item.tag}`}>
          <ObjectAvatar url={getObjectUrl(item)} size={34} />
        </Link>
        <Link to={`/@${item.tag}`} title={item.tag} className="Object__name">
          <span className="username">{item.tag}</span>
        </Link>
        <WeightTag weight={item.weight} />
      </div>
      <div className="Object__follow">
        <FollowButton username={item.tag} secondary />
      </div>
    </div>
    <div className="Object__divider" />
  </div>
);

ObjectComponent.propTypes = {
  item: PropTypes.shape({ tag: PropTypes.string.isRequired }).isRequired,
};

export default ObjectComponent;
