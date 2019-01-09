import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import WeightTag from '../components/WeightTag';
import FollowButton from '../widgets/FollowButton';
import ObjectAvatar from '../components/ObjectAvatar';
import './WaivioObject.less';

export const getField = (item, field) => {
  const wo = _.find(item.fields, ['name', field]);
  return wo ? wo.body : null;
};

const WaivioObject = ({ wobj }) => {
  let website = getField(wobj, 'link');
  const location = getField(wobj, 'locationCity');
  const name = getField(wobj, 'name');

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const pathName = `/object/${wobj.author_permlink}/${wobj.default_name || ''}`;
  return (
    <div key={wobj.author_permlink} className="WaivioObject__user">
      <div className="WaivioObject__user__content">
        <div className="WaivioObject__user__links">
          <Link to={{ pathname: pathName }} title={name}>
            <ObjectAvatar item={wobj} size={34} />
          </Link>
          <div className="WaivioObject__user__profile">
            <div className="WaivioObject__user__profile__header">
              <Link to={{ pathname: pathName }}>
                <span className="WaivioObject__user__name">
                  <span className="username">{name}</span>
                </span>
                <WeightTag weight={wobj.weight} />
              </Link>
            </div>
            <div className="WaivioObject__user__location">
              {location && (
                <span>
                  <i className="iconfont icon-coordinates text-icon" />
                  {`${location} `}
                </span>
              )}
              {website && (
                <span>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    Link to website
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className="WaivioObject__user__users_weight">
            {wobj.users &&
              _.map(wobj.users, user => (
                <div className="User__links" key={user.name}>
                  <Link to={`/@${user.name}`}>
                    <Avatar username={user.name} size={32} />
                  </Link>
                </div>
              ))}
            <div className="WaivioObject__user__follow">
              <FollowButton following={wobj.author_permlink} followingType="wobject" />
            </div>
          </div>
        </div>
      </div>
      <div className="WaivioObject__user__divider" />
    </div>
  );
};

WaivioObject.propTypes = {
  wobj: PropTypes.shape().isRequired,
};

export default WaivioObject;
