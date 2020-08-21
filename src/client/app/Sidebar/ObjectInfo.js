import React from 'react';
import { isEmpty, get, pickBy, identity, filter, iteratee, size } from 'lodash';
import { Button, Icon, Tag } from 'antd';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  haveAccess,
  hasType,
  accessTypesArr,
  parseWobjectField,
  parseAddress,
} from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import { getFieldsCount, getFieldsByName, getLink } from '../../object/wObjectHelper';
import {
  objectFields,
  TYPES_OF_MENU_ITEM,
  linkFields,
  getAllowedFieldsByObjType,
} from '../../../common/constants/listOfFields';
import URL from '../../../common/constants/routing';
import OBJECT_TYPE from '../../object/const/objectTypes';
import Proposition from '../../components/Proposition/Proposition';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';
import PicturesCarousel from '../../object/PicturesCarousel';
import IconButton from '../../components/IconButton';
import { getIsAuthenticated, getObjectAlbums } from '../../reducers';
import DescriptionInfo from './DescriptionInfo';
import CreateImage from '../../object/ObjectGallery/CreateImage';
import RateInfo from '../../components/Sidebar/Rate/RateInfo';
import MapObjectInfo from '../../components/Maps/MapObjectInfo';
import ObjectCard from '../../components/Sidebar/ObjectCard';
import LinkButton from '../../components/LinkButton/LinkButton';
import ExpandingBlock from './ExpandingBlock';

import './ObjectInfo.less';

@withRouter
@connect(state => ({
  albums: getObjectAlbums(state),
  isAuthenticated: getIsAuthenticated(state),
}))
class ObjectInfo extends React.Component {
  static propTypes = {
    location: PropTypes.shape(),
    wobject: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    albums: PropTypes.arrayOf(PropTypes.shape()),
    history: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    getAreaSearchData: () => {},
    userLocation: {},
    location: {},
    center: [],
    albums: [],
    isAuthenticated: false,
  };

  state = {
    selectedField: null,
    showModal: false,
    showMore: {},
  };

  getFieldLayout = (fieldName, params) => {
    switch (fieldName) {
      case objectFields.phone:
        return (
          <div key={params.number} className="flex">
            <div className="self-start">
              <Icon type="phone" className="text-icon tel" />
            </div>
            <div className="flex flex-column">
              {Boolean(params.body) && <div className="phone-title">{params.body}</div>}
              <a href={`tel:${params.number}`}>{params.number}</a>
            </div>
          </div>
        );
      default:
        break;
    }
    return null;
  };

  handleSelectField = field => () => this.setState({ selectedField: field });

  handleToggleModal = () => this.setState(prevState => ({ showModal: !prevState.showModal }));

  listItem = (name, content) => {
    const { wobject, userName, isEditMode } = this.props;
    const fieldsCount = getFieldsCount(wobject, name);
    const renderFields = getAllowedFieldsByObjType(wobject.object_type);
    const shouldDisplay = renderFields.includes(name);
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;

    return (
      shouldDisplay &&
      (content || accessExtend) && (
        <div className="field-info">
          <React.Fragment>
            {accessExtend && (
              <div className="field-info__title">
                <Proposition
                  objectID={wobject.author_permlink}
                  fieldName={name}
                  objName={wobject.name || wobject.default_name}
                  handleSelectField={this.handleSelectField}
                  selectedField={this.state.selectedField}
                  linkTo={
                    name === objectFields.pageContent
                      ? `/object/${wobject.author_permlink}/${OBJECT_TYPE.PAGE}`
                      : ''
                  }
                />
                {fieldsCount}
              </div>
            )}
            {content && (
              <div
                className={`field-info__content ${name}-field-${isEditMode ? 'edit' : 'view'}`}
                data-test={`${name}-field-view`}
              >
                {content}
              </div>
            )}
          </React.Fragment>
        </div>
      )
    );
  };

  renderCategoryItems = (categoryItems = [], category) => {
    const onlyFiveItems = categoryItems.filter((f, i) => i < 5);
    const tagArray = this.state.showMore[category] ? categoryItems : onlyFiveItems;

    return (
      <div>
        {tagArray.map(item => (
          <Tag key={`${category}/${item.body}`} color="orange">
            <Link to={`/object/${item.body}`}>{item.body}</Link>
          </Tag>
        ))}
        {categoryItems.length > 5 && !this.state.showMore[category] && (
          <span
            role="presentation"
            className="show-more"
            onClick={() =>
              this.setState({
                showMore: {
                  [category]: true,
                },
              })
            }
          >
            <FormattedMessage id="show_more" defaultMessage="Show more" />
            ...
          </span>
        )}
      </div>
    );
  };

  renderTagCategories = tagCategories =>
    tagCategories.map(item => (
      <div key={item.id}>
        {`${item.body}:`}
        <br />
        {item.items && this.renderCategoryItems(item.items, item.id)}
      </div>
    ));

  getMenuSectionLink = item => {
    const { wobject, location } = this.props;
    let menuItem = (
      <LinkButton
        className={classNames('menu-btn', {
          active: location.hash.slice(1).split('/')[0] === item.author_permlink,
        })}
        to={`/object/${wobject.author_permlink}/${URL.SEGMENT.MENU}#${item.author_permlink}`}
      >
        {item.alias || item.name || item.default_name}
      </LinkButton>
    );
    switch (item.id) {
      case TYPES_OF_MENU_ITEM.BUTTON:
        menuItem = (
          <Button
            className="LinkButton menu-btn field-button"
            href={getLink(item.link)}
            target={'_blank'}
            block
          >
            {item.title}
          </Button>
        );
        break;
      case TYPES_OF_MENU_ITEM.NEWS:
        menuItem = (
          <LinkButton
            className={classNames('menu-btn', {
              active: location.pathname === `/object/${wobject.author_permlink}`,
            })}
            to={`/object/${wobject.author_permlink}`}
          >
            <FormattedMessage id="news" defaultMessage="News" />
          </LinkButton>
        );
        break;
      default:
        break;
    }
    return (
      <div className="object-sidebar__menu-item" key={item.id || item.author_permlink}>
        {menuItem}
      </div>
    );
  };

  render() {
    const { wobject, userName, albums, isAuthenticated } = this.props;
    const isEditMode = isAuthenticated ? this.props.isEditMode : false;
    const { showModal, selectedField } = this.state;
    const { website, newsFilter } = wobject;
    const wobjName = wobject && (wobject.name || wobject.default_name);
    const isRenderGallery = ![OBJECT_TYPE.LIST, OBJECT_TYPE.PAGE].includes(wobject.type);
    const names = getFieldsByName(wobject, objectFields.name)
      .filter(nameFld => nameFld.body !== (wobject.name || wobject.default_name))
      .map(nameFld => <div key={nameFld.permlink}>{nameFld.body}</div>);
    const photosCount = get(wobject, 'photos_count', 0);
    const tagCategories = get(wobject, 'tagCategory', []);
    const map = parseWobjectField(wobject, 'map');
    const parent = get(wobject, 'parent');
    const status = parseWobjectField(wobject, 'status');
    const address = parseAddress(wobject);
    const description = get(wobject, 'description');
    const price = get(wobject, 'price');
    const avatar = get(wobject, 'avatar');
    const background = get(wobject, 'background');
    const pictures = get(wobject, 'preview_gallery');
    const short = get(wobject, 'title');
    const email = get(wobject, 'email');
    const workTime = get(wobject, 'workTime');
    const linkField = parseWobjectField(wobject, 'link');
    const profile = linkField
      ? {
        facebook: linkField[linkFields.linkFacebook] || '',
        twitter: linkField[linkFields.linkTwitter] || '',
        youtube: linkField[linkFields.linkYouTube] || '',
        instagram: linkField[linkFields.linkInstagram] || '',
        github: linkField[linkFields.linkGitHub] || '',
      }
      : {};
    const menuItems = get(wobject, 'listItem', []);
    const phones = get(wobject, 'phone', []);
    const menuLists = menuItems;
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;
    const album = filter(albums, iteratee(['id', wobject.author_permlink]));
    const isRenderMap = map && isCoordinatesValid(map.latitude, map.longitude);
    const button = get(wobject, 'button', []).map(btn => {
      if (btn) {
        try {
          return JSON.parse(btn.body);
        } catch (err) {
          return null;
        }
      }

      return null;
    });

    const menuSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="menu" defaultMessage="Menu" />
          </div>
        )}
        <div className="object-sidebar__menu-items">
          <React.Fragment>
            {this.listItem(
              TYPES_OF_MENU_ITEM.LIST,
              wobject.menuItems && wobject.menuItems.map(item => this.getMenuSectionLink(item)),
            )}
            {!isEmpty(button) &&
              this.listItem(
                objectFields.button,
                !isEmpty(button) &&
                  button.map(btn => this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.BUTTON, ...btn })),
              )}
            {this.listItem(
              objectFields.newsFilter,
              newsFilter && this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.NEWS }),
            )}
          </React.Fragment>
          {!isEmpty(menuLists) && this.listItem(objectFields.sorting, null)}
        </div>
      </React.Fragment>
    );

    const listSection = (
      <React.Fragment>
        <div className="object-sidebar__section-title">
          <FormattedMessage id="list" defaultMessage="List" />
        </div>
        {this.listItem(objectFields.sorting, null)}
      </React.Fragment>
    );

    const aboutSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="about" defaultMessage="About" />
          </div>
        )}
        {this.listItem(
          objectFields.name,
          !isEditMode && size(names) && (
            <React.Fragment>
              <span className="field-icon">{'\u2217'}</span>
              <ExpandingBlock className="object-sidebar__names" entities={names} minLines={4} />
            </React.Fragment>
          ),
        )}
        {this.listItem(
          objectFields.description,
          description && <DescriptionInfo description={description} />,
        )}
        {this.listItem(
          objectFields.rating,
          <RateInfo username={userName} authorPermlink={wobject.author_permlink} />,
        )}
        {this.listItem(
          objectFields.tagCategory,
          tagCategories && this.renderTagCategories(tagCategories),
        )}
        {this.listItem(objectFields.categoryItem, null)}
        {isRenderGallery && (!isEmpty(pictures) || accessExtend) && (
          <div className="field-info">
            {accessExtend && (
              <div className="proposition-line">
                <Link
                  to={{ pathname: `/object/${wobject.author_permlink}/gallery` }}
                  onClick={() => this.handleSelectField('gallery')}
                >
                  <IconButton icon={<Icon type="plus-circle" />} onClick={this.handleToggleModal} />
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
            {pictures && <PicturesCarousel pics={pictures} objectID={wobject.author_permlink} />}
          </div>
        )}
        {this.listItem(
          objectFields.price,
          price && (
            <React.Fragment>
              {!isEditMode && <span className="field-icon">$</span>}
              <span className="price-value">{price}</span>
            </React.Fragment>
          ),
        )}
        {this.listItem(
          objectFields.workTime,
          workTime && (
            <div className="field-work-time">
              <Icon type="clock-circle-o" className="text-icon text-icon--time" />
              {workTime}
            </div>
          ),
        )}
        {this.listItem(
          objectFields.address,
          address && (
            <React.Fragment>
              <span>
                <Icon type="environment-o" className="text-icon coordinates" />
                {address}
                {isRenderMap && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${map.latitude},${map.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="address-link"
                  >
                    <i className="iconfont icon-send PostModal__icon" />
                  </a>
                )}
              </span>
            </React.Fragment>
          ),
        )}
        {this.listItem(
          objectFields.map,
          isRenderMap && (
            <MapObjectInfo
              mapHeigth={200}
              center={[Number(map.latitude), Number(map.longitude)]}
              width={270}
              wobject={wobject}
              history={this.props.history}
            />
          ),
        )}
        {this.listItem(
          objectFields.website,
          website && website.title && website.link && (
            <div className="field-website">
              <span className="field-website__title">
                <i className="iconfont icon-link text-icon link" />
                <a target="_blank" rel="noopener noreferrer" href={getLink(website.link)}>
                  {website.title}
                </a>
              </span>
            </div>
          ),
        )}
        {this.listItem(
          objectFields.phone,
          <div className="field-info">
            {phones.length <= 3 || accessExtend ? (
              phones
                .slice(0, 3)
                .map(({ body, number }) =>
                  this.getFieldLayout(objectFields.phone, { body, number }),
                )
            ) : (
              <React.Fragment>
                {phones
                  .slice(0, 2)
                  .map(({ body, number }) =>
                    this.getFieldLayout(objectFields.phone, { body, number }),
                  )}
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
          </div>,
        )}
        {this.listItem(
          objectFields.email,
          email && (
            <div className="field-info">
              <div className="email">
                <Icon type="mail" className="text-icon email" />
                {accessExtend ? email : <a href={`mailto:${email}`}> {email}</a>}
              </div>
            </div>
          ),
        )}
        {this.listItem(objectFields.link, <SocialLinks profile={pickBy(profile, identity)} />)}
      </React.Fragment>
    );

    const settingsSection = (
      <React.Fragment>
        <div className="object-sidebar__section-title">
          <FormattedMessage id="settings" defaultMessage="Settings" />
        </div>
        {this.listItem(
          objectFields.avatar,
          avatar && (
            <div className="field-avatar">
              <img src={avatar} alt="pic" />
            </div>
          ),
        )}
        {this.listItem(objectFields.title, short)}
        {this.listItem(
          objectFields.background,
          background && (
            <div className="field-background">
              <img src={background} alt="pic" />
            </div>
          ),
        )}
        {this.listItem(
          objectFields.status,
          status && status.title && (
            <div className="field-status">
              <span className="field-status__title">{status.title}</span>
            </div>
          ),
        )}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {wobject && wobjName && (
          <div className="object-sidebar">
            {this.listItem(
              objectFields.parent,
              parent && (
                <ObjectCard key={parent.author_permlink} wobject={parent} showFollow={false} />
              ),
            )}
            {this.listItem(objectFields.pageContent, null)}
            {!hasType(wobject, OBJECT_TYPE.HASHTAG) && menuSection}
            {aboutSection}
            {accessExtend && hasType(wobject, OBJECT_TYPE.LIST) && listSection}
            {accessExtend && settingsSection}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
