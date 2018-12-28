import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import _ from 'lodash';
import './ObjectInfo.less';

import SocialLinks from '../../components/SocialLinks';

import { getFieldWithMaxWeight, truncate } from '../../object/wObjectHelper';
import {
  objectFields,
  descriptionFields,
  locationFields,
  linkFields,
} from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';

const ObjectInfo = props => {
  const { wobject } = props;
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

  return (
    <React.Fragment>
      {getFieldWithMaxWeight(wobject, 'name') && (
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
