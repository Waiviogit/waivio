import _ from 'lodash';
import React from 'react';
import { Icon, Tag } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { haveAccess, hasType, accessTypesArr } from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import { getFieldWithMaxWeight, getFieldsCount, getWebsiteField } from '../../object/wObjectHelper';
import {
  objectFields,
  addressFields,
  linkFields,
  getAllowedFieldsByObjType,
} from '../../../common/constants/listOfFields';
import Proposition from '../../components/Proposition/Proposition';
import Map from '../../components/Maps/Map';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';
import PicturesCarousel from '../../object/PicturesCarousel';
import IconButton from '../../components/IconButton';
import { getIsAuthenticated, getObjectAlbums } from '../../reducers';
import DescriptionInfo from './DescriptionInfo';
import CreateImage from '../../object/ObjectGallery/CreateImage';
import './ObjectInfo.less';
import RateInfo from '../../components/Sidebar/Rate/RateInfo';

@connect(state => ({
  albums: getObjectAlbums(state),
  isAuthenticated: getIsAuthenticated(state),
}))
class ObjectInfo extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  static defaultProps = {
    isEditMode: false,
    isAuthenticated: false,
  };

  state = {
    selectedField: null,
    showModal: false,
    showMore: false,
  };

  handleSelectField = field => this.setState({ selectedField: field });
  handleToggleModal = () => this.setState(prevState => ({ showModal: !prevState.showModal }));

  render() {
    const { wobject, userName, albums, isAuthenticated } = this.props;
    const isEditMode = isAuthenticated ? this.props.isEditMode : false;
    const { showModal, selectedField } = this.state;
    const renderFields = getAllowedFieldsByObjType(wobject.object_type);
    const isRenderGallery = !['list'].includes(wobject.object_type);

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
    let photosCount = 0;
    let hashtags = [];
    let phones = [];
    let email = '';

    if (wobject) {
      addressArr = Object.values(addressFields).map(fieldName =>
        getFieldWithMaxWeight(wobject, objectFields.address, fieldName),
      );
      address = _.compact(addressArr).join(', ');

      map = getFieldWithMaxWeight(wobject, objectFields.map, null);

      description = getFieldWithMaxWeight(wobject, objectFields.description);

      avatar = getFieldWithMaxWeight(wobject, objectFields.avatar, null);
      background = getFieldWithMaxWeight(wobject, objectFields.background, null);

      short = getFieldWithMaxWeight(wobject, objectFields.title, null);

      email = getFieldWithMaxWeight(wobject, objectFields.email, null);

      websiteFields = getWebsiteField(wobject);
      title = websiteFields.title;
      link = websiteFields.body;
      photosCount = wobject.photos_count;

      const filtered = _.filter(wobject.fields, ['name', objectFields.hashtag]);
      hashtags = _.orderBy(filtered, ['weight'], ['desc']);

      const filteredPhones = _.filter(wobject.fields, ['name', objectFields.phone]);
      phones = _.orderBy(filteredPhones, ['weight'], ['desc']);
    }

    if (link && link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
      link = `http://${link}`;
    }

    let profile = {
      facebook: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkFacebook),
      twitter: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkTwitter),
      youtube: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkYouTube),
      instagram: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkInstagram),
      github: getFieldWithMaxWeight(wobject, objectFields.link, linkFields.linkGitHub),
    };

    profile = _.pickBy(profile, _.identity);
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;
    const objectName = getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name);
    const album = _.filter(albums, _.iteratee(['id', wobject.author_permlink]));
    const hasGalleryImg = wobject.preview_gallery && wobject.preview_gallery[0];

    const listItem = (fieldName, content) => {
      const fieldsCount = getFieldsCount(wobject, fieldName);
      return renderFields.includes(fieldName) && (content || accessExtend) ? (
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
                {fieldsCount}
              </div>
            )}
            {content ? <div className="field-info__content">{content}</div> : null}
          </React.Fragment>
        </div>
      ) : null;
    };

    const listSection = (
      <React.Fragment>
        <div className="object-sidebar__section-title">
          <FormattedMessage id="list" defaultMessage="List" />
        </div>
        {listItem(objectFields.sorting, null)}
      </React.Fragment>
    );

    const settingsSection = (
      <React.Fragment>
        <div className="object-sidebar__section-title">
          <FormattedMessage id="settings" defaultMessage="Settings" />
        </div>
        {listItem(
          objectFields.avatar,
          avatar ? (
            <div className="field-avatar">
              <img src={avatar} alt="pic" />
            </div>
          ) : null,
        )}
        {listItem(objectFields.title, short)}
        {listItem(
          objectFields.background,
          background ? (
            <div className="field-background">
              <img src={background} alt="pic" />
            </div>
          ) : null,
        )}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        {getFieldWithMaxWeight(wobject, objectFields.name) && (
          <div className="object-sidebar">
            {listItem(objectFields.description, <DescriptionInfo description={description} />)}
            {listItem(objectFields.rating, <RateInfo username={userName} wobject={wobject} />)}
            {listItem(
              objectFields.hashtag,
              <div className="field-info">
                {accessExtend ? (
                  <React.Fragment>
                    {hashtags.length <= 3 ? (
                      hashtags.slice(0, 3).map(({ body }) => (
                        <div key={body} className="tag-item">
                          #{body}
                        </div>
                      ))
                    ) : (
                      <React.Fragment>
                        {hashtags.slice(0, 2).map(({ body }) => (
                          <div key={body} className="tag-item">
                            #{body}
                          </div>
                        ))}
                        <Link
                          to={`/object/${wobject.author_permlink}/updates/${objectFields.hashtag}`}
                          onClick={() => this.handleSelectField(objectFields.hashtag)}
                        >
                          <FormattedMessage id="show_more_tags" defaultMessage="show more">
                            {value => <div className="tag-item">{value}</div>}
                          </FormattedMessage>
                        </Link>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {hashtags.slice(0, 3).map(({ body }) => (
                      <Tag key={body} color="volcano">
                        #{body}
                      </Tag>
                    ))}
                  </React.Fragment>
                )}
              </div>,
            )}
            {isRenderGallery && (hasGalleryImg || accessExtend) ? (
              <div className="field-info">
                {accessExtend && (
                  <div className="proposition-line">
                    <Link
                      to={{ pathname: `/object/${wobject.author_permlink}/gallery` }}
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
                    <span className="proposition-line__text">{photosCount}</span>
                    {showModal && (
                      <CreateImage
                        albums={albums}
                        selectedAlbum={album[0]}
                        showModal={showModal}
                        hideModal={this.handleToggleModal}
                      />
                    )}
                  </div>
                )}
                {hasGalleryImg && (
                  <PicturesCarousel
                    pics={wobject.preview_gallery}
                    objectID={wobject.author_permlink}
                  />
                )}
              </div>
            ) : null}
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
              map &&
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
                ),
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
            {listItem(
              objectFields.phone,
              <div className="field-info">
                {accessExtend ? (
                  <React.Fragment>
                    {phones.length <= 3 ? (
                      phones.slice(0, 3).map(({ body, number }) => (
                        <div key={number} className="phone">
                          {body && body} <br />
                          <Icon type="phone" /> <a href={`tel:${number}`}>{number}</a>
                        </div>
                      ))
                    ) : (
                      <React.Fragment>
                        {phones.slice(0, 2).map(({ body, number }) => (
                          <div key={number} className="phone">
                            {body && body} <br />
                            <Icon type="phone" /> <a href={`tel:${number}`}>{number}</a>
                          </div>
                        ))}
                        <Link
                          to={`/object/${wobject.author_permlink}/updates/${objectFields.phone}`}
                          onClick={() => this.handleSelectField(objectFields.phone)}
                        >
                          <FormattedMessage id="show_more_tags" defaultMessage="show more">
                            {value => <div className="phone">{value}</div>}
                          </FormattedMessage>
                        </Link>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {phones.slice(0, 3).map(({ body, number }) => (
                      <div key={number}>
                        {body && body} <br />
                        <Icon type="phone" /> <a href={`tel:${number}`}>{number}</a>
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </div>,
            )}
            {listItem(
              objectFields.email,
              email && (
                <div className="field-info">
                  {accessExtend ? (
                    <div className="email">
                      <Icon type="mail" /> {email}
                    </div>
                  ) : (
                    <React.Fragment>
                      <Icon type="mail" />
                      <a href={`mailto:${email}`}> {email}</a>
                    </React.Fragment>
                  )}
                </div>
              ),
            )}
            {listItem(objectFields.link, <SocialLinks profile={profile} />)}
            {accessExtend && hasType(wobject, 'list') && listSection}
            {accessExtend && settingsSection}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
