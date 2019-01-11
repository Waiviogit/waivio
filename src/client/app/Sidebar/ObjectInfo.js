import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { haveAccess, accessTypesArr } from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import './ObjectInfo.less';

import { getFieldWithMaxWeight, getFieldsCount, truncate } from '../../object/wObjectHelper';
import { objectFields, addressFields, linkFields } from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';
import Map from '../../components/Maps/Map';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';

const ObjectInfo = props => {
  const { wobject, userName } = props;
  let addressArr = [];
  let address = '';
  let position = '';
  let descriptionShort = '';
  let descriptionFull = '';
  let website = '';

  if (wobject) {
    addressArr = Object.values(addressFields).map(fieldName =>
      getFieldWithMaxWeight(wobject, objectFields.address, fieldName),
    );
    address = _.compact(addressArr).join(', ');

    position = getFieldWithMaxWeight(wobject, objectFields.position, null);

    descriptionShort = truncate(getFieldWithMaxWeight(wobject, objectFields.descriptionShort));
    descriptionFull = truncate(getFieldWithMaxWeight(wobject, objectFields.descriptionFull));

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

  const listItem = (fieldName, content) => {
    const fieldsCount = getFieldsCount(wobject, fieldName);
    return (
      <div className="field-info">
        {fieldsCount ? (
          <React.Fragment>
            <div className="field-info__title">
              <FormattedMessage id={`object_field_${fieldName}`} defaultMessage={fieldName} />
              &nbsp;
              <Link
                to={`/object/${wobject.author_permlink}/${
                  wobject.default_name
                }/history/${fieldName}`}
              >
                ({fieldsCount})
              </Link>
            </div>
            <div className="field-info__content">{content}</div>
          </React.Fragment>
        ) : (
          accessExtend && <Proposition objectID={wobject.author_permlink} fieldName={fieldName} />
        )}
      </div>
    );
  };
  return (
    <React.Fragment>
      {getFieldWithMaxWeight(wobject, 'name') && (
        <div className="object-sidebar">
          {listItem(objectFields.descriptionShort, descriptionShort)}
          {listItem(objectFields.descriptionFull, descriptionFull)}
          {listItem(
            objectFields.address,
            <React.Fragment>
              <i className="iconfont icon-coordinates text-icon" />
              {address}
            </React.Fragment>,
          )}
          {listItem(
            objectFields.position,
            <React.Fragment>
              {position &&
                position.latitude &&
                position.longitude &&
                isCoordinatesValid(position.latitude, position.longitude) && (
                  <Map
                    isMarkerShown
                    setCoordinates={() => {}}
                    wobject={wobject}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `200px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    lat={Number(position.latitude)}
                    lng={Number(position.longitude)}
                  />
                )}
            </React.Fragment>,
          )}
          {listItem(
            objectFields.link,
            <React.Fragment>
              <i className="iconfont icon-link text-icon" />
              <a target="_blank" rel="noopener noreferrer" href={website}>
                Website
              </a>
              <SocialLinks profile={profile} />
            </React.Fragment>,
          )}
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
