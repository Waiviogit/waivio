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
import PicturesCarousel from '../../object/PicturesCarousel';

const ObjectInfo = props => {
  const { wobject, userName } = props;
  let addressArr = [];
  let address = '';
  let map = '';
  let title = '';
  let description = '';
  let website = '';

  if (wobject) {
    addressArr = Object.values(addressFields).map(fieldName =>
      getFieldWithMaxWeight(wobject, objectFields.address, fieldName),
    );
    address = _.compact(addressArr).join(', ');

    map = getFieldWithMaxWeight(wobject, objectFields.map, null);

    title = truncate(getFieldWithMaxWeight(wobject, objectFields.title));
    description = truncate(getFieldWithMaxWeight(wobject, objectFields.description));

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
                }/updates/${fieldName}`}
              >
                ({fieldsCount})
              </Link>
            </div>
            <div className="field-info__content">{content}</div>
          </React.Fragment>
        ) : (
          accessExtend && (
            <Proposition
              objectID={wobject.author_permlink}
              fieldName={fieldName}
              defaultName={wobject.default_name}
            />
          )
        )}
      </div>
    );
  };
  return (
    <React.Fragment>
      {getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name) && (
        <div className="object-sidebar">
          {listItem(objectFields.title, title)}
          {listItem(objectFields.description, description)}
          {listItem(
            objectFields.address,
            <React.Fragment>
              <i className="iconfont icon-coordinates text-icon" />
              {address}
            </React.Fragment>,
          )}
          {listItem(
            objectFields.map,
            <React.Fragment>
              {map &&
                map.latitude &&
                map.longitude &&
                isCoordinatesValid(map.latitude, map.longitude) && (
                  <Map
                    isMarkerShown
                    setCoordinates={() => {}}
                    wobject={wobject}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `200px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    lat={Number(map.latitude)}
                    lng={Number(map.longitude)}
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
      <div className="object-gallery">
        <PicturesCarousel
          pics={[
            'https://ipfs.busy.org/ipfs/QmWLagsHPbJNTVnLz78mUBykTu1FczAj8LyE8zCYcvJY8V',
            'https://ipfs.busy.org/ipfs/QmeSC3KgJ4vFPwKUo6FoTrn4riEbVMF1ubbSeciaM3f6eg',
            'https://ipfs.busy.org/ipfs/QmUaxDCi5eYL9hMWZYJti431RAnCtHM8ucGDFZojuozQVP',
          ]}
        />
      </div>
    </React.Fragment>
  );
};

ObjectInfo.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default ObjectInfo;
