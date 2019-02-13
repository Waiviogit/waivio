import _ from 'lodash';
import React from 'react';
import { Icon, message, Tag } from 'antd';
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
    isEditMode: PropTypes.bool,
  };

  static defaultProps = {
    isEditMode: false,
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
    const { isEditMode, wobject, userName, loadingAlbum } = this.props;
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
    let hashtags = [];
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

      const filtered = _.filter(wobject.fields, ['name', objectFields.hashtag]);
      hashtags = _.orderBy(filtered, ['weight'], ['desc']);
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

    const hasGalleryImg = wobject.preview_gallery && wobject.preview_gallery[0];

    const listItem = (fieldName, content) => {
      const fieldsCount = getFieldsCount(wobject, fieldName);
      return content || accessExtend ? (
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
        {getFieldWithMaxWeight(wobject, objectFields.name, objectFields.name) && (
          <div className="object-sidebar">
            {listItem(objectFields.description, description)}
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
                          to={`/object/@${wobject.author_permlink}/updates/${objectFields.hashtag}`}
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
            {hasGalleryImg || accessExtend ? (
              <div className="field-info">
                {accessExtend && (
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
                    <span className="proposition-line__text">{albumsCount}</span>
                    {showModal && (
                      <CreateAlbum
                        showModal={showModal}
                        hideModal={this.handleToggleModal}
                        handleSubmit={this.handleCreateAlbum}
                        loading={loadingAlbum}
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
            {listItem(objectFields.link, <SocialLinks profile={profile} />)}

            {accessExtend && settingsSection}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
