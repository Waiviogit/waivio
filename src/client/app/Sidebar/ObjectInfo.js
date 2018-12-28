import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import _ from 'lodash';
import './ObjectInfo.less';

import SocialLinks from '../../components/SocialLinks';

import { getField } from '../../object/wObjectHelper';
import {
  objectFields,
  descriptionFields,
  locationFields,
  linkFields,
} from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';

export const truncate = str => {
  if (str && str.length > 150) return `${str.substring(0, 150)}...`;
  return str;
};

const ObjectInfo = props => {
  const { wobject } = props;

  const locationCountry =
    wobject && getField(wobject, objectFields.location, locationFields.locationCountry);
  const locationCity =
    wobject && getField(wobject, objectFields.location, locationFields.locationCity);
  const locationStreet =
    wobject && getField(wobject, objectFields.location, locationFields.locationStreet);
  const locationAccommodation =
    wobject && getField(wobject, objectFields.location, locationFields.locationAccommodation);
  const postCode = wobject && getField(wobject, objectFields.location, locationFields.postCode);
  const locationLatitude =
    wobject && getField(wobject, objectFields.location, locationFields.locationLatitude);
  const locationLongitude =
    wobject && getField(wobject, objectFields.location, locationFields.locationLongitude);

  const locationArray = [
    locationCountry,
    locationCity,
    locationStreet,
    locationAccommodation,
    postCode,
    locationLatitude,
    locationLongitude,
  ];

  const locations = _.compact(locationArray);
  const location = locations.join(', ');

  const descriptionField = getField(
    wobject,
    objectFields.description,
    descriptionFields.descriptionFull,
  );

  const descriptionFull = wobject && truncate(descriptionField);

  let website = wobject && getField(wobject, objectFields.link, linkFields.website);

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  let profile = {
    facebook: getField(wobject, objectFields.link, linkFields.linkFacebook),
    twitter: getField(wobject, objectFields.link, linkFields.linkTwitter),
    youtube: getField(wobject, objectFields.link, linkFields.linkYouTube),
    instagram: getField(wobject, objectFields.link, linkFields.linkInstagram),
    github: getField(wobject, objectFields.link, linkFields.linkGitHub),
  };

  profile = _.pickBy(profile, _.identity);

  return (
    <React.Fragment>
      {getField(wobject, 'name') && (
        <div className="object-profile">
          <div className="object-profile__description">{wobject && descriptionFull}</div>
          <div className="object-profile__element">
            {location ? (
              <React.Fragment>
                <i className="iconfont icon-coordinates text-icon" />
                {location}
              </React.Fragment>
            ) : (
              <Proposition objectID={wobject.author_permlink} fieldName="location" />
            )}
          </div>
          <div className="object-profile__element">
            {website ? (
              <React.Fragment>
                <i className="iconfont icon-link text-icon" />
                <a target="_blank" rel="noopener noreferrer" href={website}>
                  {/* {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`} */}
                  Website
                </a>
              </React.Fragment>
            ) : (
              <Proposition objectID={wobject.author_permlink} fieldName="link" />
            )}
          </div>
          <SocialLinks profile={profile} />
        </div>
      )}
    </React.Fragment>
  );
};

ObjectInfo.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectInfo;
