import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { haveAccess, accessTypesArr } from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import './ObjectInfo.less';

import { getFieldWithMaxWeight, getFieldsCount, truncate } from '../../object/wObjectHelper';
import {
  objectFields,
  descriptionFields,
  locationFields,
  linkFields,
} from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';
import Map from '../../components/Maps/Map';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';

const ObjectInfo = props => {
  const { wobject, userName } = props;
  let locationArray = [];
  let location = '';
  let descriptionFull = '';
  let website = '';

  if (wobject) {
    locationArray = Object.keys(locationFields).map(fieldName =>
      getFieldWithMaxWeight(wobject, objectFields.location, fieldName),
    );
    location = _.compact(locationArray).join(', ');

    descriptionFull = truncate(
      getFieldWithMaxWeight(wobject, objectFields.description, descriptionFields.descriptionFull),
    );

    website = getFieldWithMaxWeight(wobject, objectFields.link, linkFields.website);
  }

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  let profile = {
    facebook: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkFacebook),
    twitter: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkTwitter),
    youtube: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkYouTube),
    instagram: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkInstagram),
    github: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkGitHub),
  };

  profile = _.pickBy(profile, _.identity);
  const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]);
  return (
    <React.Fragment>
      {getFieldWithMaxWeight(wobject, 'name') && (
        <div className="object-profile">
          <div className="object-profile__description">
            {wobject && descriptionFull}
            <Link to={`/object/@${wobject.author_permlink}/history/${objectFields.description}`}>
              ({getFieldsCount(wobject, objectFields.description)})
            </Link>
          </div>
          <div className="object-profile__element">
            {location ? (
              <React.Fragment>
                <i className="iconfont icon-coordinates text-icon" />
                {location}
                {locationArray &&
                  locationArray[5] &&
                  locationArray[6] &&
                  isCoordinatesValid(locationArray[5], locationArray[6]) && (
                    <Map
                      isMarkerShown
                      setCoordinates={() => {}}
                      wobject={wobject}
                      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `200px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      lat={Number(locationArray[5])}
                      lng={Number(locationArray[6])}
                    />
                  )}
                <Link to={`/object/@${wobject.author_permlink}/history/${objectFields.location}`}>
                  ({getFieldsCount(wobject, objectFields.location)})
                </Link>
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
              accessExtend && <Proposition objectID={wobject.author_permlink} fieldName="link" />
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
  userName: PropTypes.string.isRequired,
};

export default ObjectInfo;
