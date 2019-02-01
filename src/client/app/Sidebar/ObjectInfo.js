import _ from 'lodash';
import React from 'react';
import { Icon, message } from 'antd';
import urlParse from 'url-parse';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { haveAccess, accessTypesArr, prepareAlbumData } from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import './ObjectInfo.less';
import {
  getFieldWithMaxWeight,
  getFieldsCount,
  truncate,
  getWebsiteField,
} from '../../object/wObjectHelper';
import { objectFields, addressFields, linkFields } from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';
import Map from '../../components/Maps/Map';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';
import PicturesCarousel from '../../object/PicturesCarousel';
import IconButton from '../../components/IconButton';
import CreateAlbum from '../../object/ObjectGallery/CreateAlbum';
import { getIsAppendLoading } from '../../reducers';
import { appendObject } from '../../object/appendActions';

@connect(
  state => ({
    loadingAlbum: getIsAppendLoading(state),
  }),
  { appendObject },
)
class ObjectInfo extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    appendObject: PropTypes.func.isRequired,
    loadingAlbum: PropTypes.bool.isRequired,
  };

  state = {
    selectedField: null,
    showModal: false,
  };

  handleSelectField = field => this.setState({ selectedField: field });
  handleToggleModal = () => this.setState(prevState => ({ showModal: !prevState.showModal }));
  handleCreateAlbum = form => {
    const { userName, wobject } = this.props;
    const data = prepareAlbumData(form, userName, wobject);
    this.props
      .appendObject(data)
      .then(() => {
        this.handleToggleModal();
        message.success(`You successfully have created the ${form.galleryAlbum} album`);
      })
      .catch(err => {
        message.error("Couldn't update object.");
        console.log('err', err);
      });
  };
  render() {
    const { wobject, userName, loadingAlbum } = this.props;
    const { showModal, selectedField } = this.state;

    let addressArr = [];
    let address = '';
    let map = '';
    let description = '';
    let link = '';
    let title = '';
    let websiteFields = {};
    let avatar = '';
    let short = '';
    let background = '';
    let albumsCount = 0;
    if (wobject) {
      addressArr = Object.values(addressFields).map(fieldName =>
        getFieldWithMaxWeight(wobject, objectFields.address, fieldName),
      );
      address = _.compact(addressArr).join(', ');

      map = getFieldWithMaxWeight(wobject, objectFields.map, null);

      description = truncate(getFieldWithMaxWeight(wobject, objectFields.description));

      avatar = getFieldWithMaxWeight(wobject, objectFields.avatar, null);
      background = getFieldWithMaxWeight(wobject, objectFields.background, null);

      short = getFieldWithMaxWeight(wobject, objectFields.title, null);

      websiteFields = getWebsiteField(wobject);
      title = websiteFields.title;
      link = websiteFields.body;
      albumsCount = wobject.albums_count;
    }

    if (link && link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
      link = `http://${link}`;
    }
    const url = urlParse(link);
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
    const objectName = getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name);

    const listItem = (fieldName, content) => {
      const fieldsCount = getFieldsCount(wobject, fieldName);
      return (
        <div className="field-info">
          <React.Fragment>
            {accessExtend && (
              <div className="field-info__title">
                <Proposition
                  objectID={wobject.author_permlink}
                  fieldName={fieldName}
                  objName={objectName}
                  handleSelectField={this.handleSelectField}
                  selectedField={selectedField}
                />
                ({fieldsCount})
              </div>
            )}
            <div className="field-info__content">{content}</div>
          </React.Fragment>
        </div>
      );
    };
    return (
      <React.Fragment>
        {getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name) && (
          <div className="object-sidebar">
            {listItem(objectFields.description, description)}
            {accessExtend && (
              <div className="field-info">
                <div className="proposition-line">
                  <Link
                    to={{ pathname: `/object/@${wobject.author_permlink}/gallery` }}
                    onClick={() => this.handleSelectField('gallery')}
                  >
                    <IconButton
                      icon={<Icon type="plus-circle" />}
                      onClick={this.handleToggleModal}
                    />
                    <div
                      className={`icon-button__text ${
                        selectedField === 'gallery' ? 'field-selected' : ''
                      }`}
                    >
                      <FormattedMessage id="object_field_gallery" defaultMessage="Gallery" />
                    </div>
                  </Link>
                  <span className="proposition-line__text">({albumsCount})</span>
                  {showModal && (
                    <CreateAlbum
                      showModal={showModal}
                      hideModal={this.handleToggleModal}
                      handleSubmit={this.handleCreateAlbum}
                      loading={loadingAlbum}
                    />
                  )}
                </div>
                {wobject.preview_gallery && wobject.preview_gallery[0] && (
                  <PicturesCarousel
                    pics={wobject.preview_gallery}
                    objectID={wobject.author_permlink}
                  />
                )}
              </div>
            )}
            {listItem(
              objectFields.address,
              address && (
                <React.Fragment>
                  <i className="iconfont icon-coordinates text-icon" />
                  {address}
                </React.Fragment>
              ),
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
              objectFields.website,
              title ? (
                <div className="field-website">
                  <span className="field-website__title">
                    <i className="iconfont icon-link text-icon" />
                    <a target="_blank" rel="noopener noreferrer" href={link}>
                      {title}
                    </a>
                  </span>
                </div>
              ) : null,
            )}
            {listItem(objectFields.link, <SocialLinks profile={profile} />)}
            {accessExtend &&
              listItem(
                objectFields.avatar,
                avatar ? (
                  <div className="field-avatar">
                    <img src={avatar} alt="pic" />
                  </div>
                ) : null,
              )}
            {accessExtend && listItem(objectFields.title, short)}
            {accessExtend &&
              listItem(
                objectFields.background,
                background ? (
                  <div className="field-background">
                    <img src={background} alt="pic" />
                  </div>
                ) : null,
              )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
