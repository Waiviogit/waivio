import React from 'react';
import { map, get } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import WeightTag from '../components/WeightTag';
import FollowButton from '../widgets/FollowButton';
import ObjectAvatar from '../components/ObjectAvatar';
import { addressFields, objectFields, websiteFields } from '../../common/constants/listOfFields';
import { parseWobjectField } from '../helpers/wObjectHelper';

import './WaivioObject.less';

const WaivioObject = ({ wobj, unfollow, follow }) => {
  const { default_name: defaultName, name } = wobj;
  const address = parseWobjectField(wobj, 'address');
  const website = parseWobjectField(wobj, 'website');

  const objectName = name || defaultName;
  const websiteTitle = get(website, [websiteFields.title]) || objectFields.website;
  let websiteLink = get(website, [websiteFields.link]);
  if (
    websiteLink &&
    websiteLink.indexOf('http://') === -1 &&
    websiteLink.indexOf('https://') === -1
  ) {
    websiteLink = `http://${websiteLink}`;
  }
  const location = get(address, [addressFields.city]);
  const pathName = `/object/${wobj.author_permlink}`;

  return (
    <div key={wobj.author_permlink} className="WaivioObject__user">
      <div className="WaivioObject__user__content">
        <div className="WaivioObject__user__links">
          <Link to={{ pathname: pathName }} title={objectName}>
            <ObjectAvatar item={wobj} size={34} />
          </Link>
          <div className="WaivioObject__user__profile">
            <div className="WaivioObject__user__profile__header">
              <Link to={{ pathname: pathName }}>
                <span className="WaivioObject__user__name">
                  <span className="username">{objectName}</span>
                </span>
              </Link>
              <WeightTag weight={wobj.weight} />
            </div>
            <div className="WaivioObject__user__location">
              {location && (
                <span>
                  <i className="iconfont icon-coordinates text-icon" />
                  {`${location} `}
                </span>
              )}
              {websiteLink && (
                <span>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={websiteLink}>
                    {websiteTitle}
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className="WaivioObject__user__users_weight">
            {wobj.users &&
              map(wobj.users, user => (
                <div className="User__links" key={user.name}>
                  <Link to={`/@${user.name}`}>
                    <Avatar username={user.name} size={32} />
                  </Link>
                </div>
              ))}
            <div className="WaivioObject__user__follow">
              <FollowButton
                wobj={wobj}
                following={wobj.youFollows}
                unfollowObject={unfollow}
                followObject={follow}
                followingType="wobject"
              />
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
  unfollow: PropTypes.func,
  follow: PropTypes.func,
};

WaivioObject.defaultProps = {
  unfollow: () => {},
  follow: () => {},
};

export default WaivioObject;
