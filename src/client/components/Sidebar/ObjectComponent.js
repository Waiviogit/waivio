import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import './ObjectComponent.less';

const ObjectComponent = ({ item }) => (
  <div key={item.name} className="Object">
    <div className="Object__top">
      <div className="Object__links">
        <Link to={`/@${item.name}`}>
          <Avatar username={item.name} size={34} />
        </Link>
        <Link to={`/@${item.name}`} title={item.name} className="Object__name">
          <span className="username">{item.name}</span>
        </Link>
      </div>
      <div className="Object__follow">
        <FollowButton username={item.name} secondary />
      </div>
    </div>
    <div className="Object__divider" />
  </div>
);

ObjectComponent.propTypes = {
  item: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

export default ObjectComponent;
