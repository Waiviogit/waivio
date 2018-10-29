import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import urlParse from 'url-parse';
import { Link } from 'react-router-dom';
import ReputationTag from '../components/ReputationTag';
import FollowButton from '../widgets/FollowButton';

const WaivioObject = ({ wobj }) => {
  const parsedJSON = _.attempt(JSON.parse, wobj.json_metadata);
  const wobjJSON = _.isError(parsedJSON) ? {} : parsedJSON;
  const wobjProfile = _.has(wobjJSON, 'wobjData') ? wobjJSON.wobjData : {};
  const location = wobjProfile.location;
  const wobjName = wobjProfile.name;
  const about = wobjProfile.about;
  const avatar = wobjProfile.avatar;
  let website = wobjProfile.website;

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }

  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  return (
    <div key={wobj.name} className="Discover__user">
      <div className="Discover__user__content">
        <div className="Discover__user__links">
          <Link to={`object/@${wobj.name}`}>
            <img alt={avatar} src={avatar} />
          </Link>
          <div className="Discover__user__profile">
            <div className="Discover__user__profile__header">
              <Link to={`object/@${wobj.name}`}>
                <span className="Discover__user__name">
                  <span className="username">{wobjName || wobj.name}</span>
                </span>
                <ReputationTag reputation={wobj.reputation} />
              </Link>
              <div className="Discover__user__follow">
                <FollowButton username={wobj.name} />
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
            <div className="Discover__user__about">{about}</div>
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
