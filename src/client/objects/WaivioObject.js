import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import urlParse from 'url-parse';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import ObjectAvatar from '../components/ObjectAvatar';
import WeightTag from '../components/WeightTag';

const getField = (item, field) => {
  const wo = _.find(item.fields, ['name', field]);
  return wo ? wo.body : null;
};

const WaivioObject = ({ wobj }) => {
  let website = getField(wobj, 'link');
  const location = getField(wobj, 'location');

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }

  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  return (
    <div key={wobj.tag} className="Discover__user">
      <div className="Discover__user__content">
        <div className="Discover__user__links">
          <Link to={`object/@${wobj.tag}`}>
            <ObjectAvatar item={wobj} size={34} />
          </Link>
          <div className="Discover__user__profile">
            <div className="Discover__user__profile__header">
              <Link to={`object/@${wobj.tag}`}>
                <span className="Discover__user__name">
                  <span className="username">{wobj.tag}</span>
                </span>
                <WeightTag weight={wobj.weight} />
              </Link>
              <div className="Discover__user__follow">
                <FollowButton username={wobj.tag} />
              </div>
            </div>
            <div className="Discover__user__location">
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
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="Discover__user__divider" />
    </div>
  );
};

WaivioObject.propTypes = {
  wobj: PropTypes.shape().isRequired,
};

export default WaivioObject;
