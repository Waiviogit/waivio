import React from 'react';
import { isEmpty, get, pickBy, identity, has, setWith, uniq } from 'lodash';
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
  getObjectName,
  parseButtonsField,
  getMenuItems,
} from '../../helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import { getFieldsCount, getLink, getExposedFieldsByObjType } from '../../object/wObjectHelper';
import {
  objectFields,
  TYPES_OF_MENU_ITEM,
  linkFields,
} from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../object/const/objectTypes';
import Proposition from '../../components/Proposition/Proposition';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';
import PicturesCarousel from '../../object/PicturesCarousel';
import { getIsAuthenticated, getIsWaivio, getObjectAlbums } from '../../reducers';
import DescriptionInfo from './DescriptionInfo';
import RateInfo from '../../components/Sidebar/Rate/RateInfo';
import MapObjectInfo from '../../components/Maps/MapObjectInfo';
import ObjectCard from '../../components/Sidebar/ObjectCard';
import LinkButton from '../../components/LinkButton/LinkButton';

import './ObjectInfo.less';

@withRouter
@connect(state => ({
  albums: getObjectAlbums(state),
  isAuthenticated: getIsAuthenticated(state),
  isWaivio: getIsWaivio(state),
}))
class ObjectInfo extends React.Component {
  static propTypes = {
    location: PropTypes.shape(),
    wobject: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    isWaivio: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    appendAlbum: PropTypes.func.isRequired,
    albums: PropTypes.shape(),
  };

  static defaultProps = {
    getAreaSearchData: () => {},
    userLocation: {},
    location: {},
    center: [],
    albums: [],
    isAuthenticated: false,
    isWaivio: true,
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
    const { wobject, userName, isEditMode, albums, appendAlbum } = this.props;
    const fieldsCount = getFieldsCount(wobject, name);
    const exposedFields = getExposedFieldsByObjType(wobject);
    const shouldDisplay = exposedFields.includes(name);
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
                  objName={getObjectName(wobject)}
                  handleSelectField={this.handleSelectField}
                  selectedField={this.state.selectedField}
                  linkTo={
                    name === objectFields.pageContent
                      ? `/object/${wobject.author_permlink}/${OBJECT_TYPE.PAGE}`
                      : ''
                  }
                  albums={albums}
                  appendAlbum={appendAlbum}
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
    const { object_type: type } = this.props.wobject;
    const onlyFiveItems = categoryItems.filter((f, i) => i < 5);
    const tagArray = this.state.showMore[category] ? categoryItems : onlyFiveItems;

    return (
      <div>
        {tagArray.map(item => (
          <Tag key={`${category}/${item.body}`} color="orange">
            <Link to={`/discover-objects/${type}?${category}=${item.body}`}>{item.body}</Link>
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
        {item.items && this.renderCategoryItems(item.items, item.body)}
      </div>
    ));

  getMenuSectionLink = (item = {}) => {
    const { wobject, location } = this.props;
    let menuItem = (
      <LinkButton
        className={classNames('menu-btn', {
          active: location.hash.slice(1).split('/')[0] === item.body,
        })}
        to={`/object/${wobject.author_permlink}/menu#${item.body || item.author_permlink}`}
      >
        {item.alias || getObjectName(item)}
      </LinkButton>
    );
    switch (item.id) {
      case TYPES_OF_MENU_ITEM.BUTTON:
        menuItem = (
          <Button
            className="LinkButton menu-btn field-button"
            href={getLink(item.body.link)}
            target={'_blank'}
            block
          >
            {item.body.title}
          </Button>
        );
        break;
      case TYPES_OF_MENU_ITEM.PAGE:
        menuItem = (
          <LinkButton
            className={classNames('menu-btn', {
              active: location.hash.slice(1).split('/')[0] === item.body,
            })}
            to={`/object/${wobject.author_permlink}/page#${item.body || item.author_permlink}`}
          >
            {item.alias || getObjectName(item)}
          </LinkButton>
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
      <div className="object-sidebar__menu-item" key={item.permlink}>
        {menuItem}
      </div>
    );
  };

  validatedAlbums = albums =>
    albums.map(album => {
      if (!has(album, 'active_votes') && !has(album, 'weight')) {
        setWith(album, '[active_votes]', []);
        setWith(album, '[weight]', 0);
      }
      return album;
    });

  render() {
    const { wobject, userName, isAuthenticated } = this.props;
    const isEditMode = isAuthenticated ? this.props.isEditMode : false;
    const { newsFilter } = wobject;
    const website = parseWobjectField(wobject, 'website');
    const wobjName = getObjectName(wobject);
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
    const customSort = get(wobject, 'sortCustom', []);
    const profile = linkField
      ? {
          facebook: linkField[linkFields.linkFacebook] || '',
          twitter: linkField[linkFields.linkTwitter] || '',
          youtube: linkField[linkFields.linkYouTube] || '',
          instagram: linkField[linkFields.linkInstagram] || '',
          github: linkField[linkFields.linkGitHub] || '',
        }
      : {};
    const phones = get(wobject, 'phone', []);
    const isHashtag = hasType(wobject, OBJECT_TYPE.HASHTAG);
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;
    const isRenderMap = map && isCoordinatesValid(map.latitude, map.longitude);
    const menuLinks = getMenuItems(wobject, TYPES_OF_MENU_ITEM.LIST, OBJECT_TYPE.LIST);
    const menuPages = getMenuItems(wobject, TYPES_OF_MENU_ITEM.PAGE, OBJECT_TYPE.PAGE);
    const button = parseButtonsField(wobject);
    const isList = hasType(wobject, OBJECT_TYPE.LIST);
    const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));

    const menuSection = () => {
      if (!isEditMode && !isEmpty(customSort) && !hasType(wobject, OBJECT_TYPE.LIST)) {
        const buttonArray = [...menuLinks, ...menuPages, ...button];

        if (newsFilter) buttonArray.push({ id: TYPES_OF_MENU_ITEM.NEWS, ...newsFilter });

        const sortButtons = customSort.reduce((acc, curr) => {
          const currentLink = buttonArray.find(
            btn =>
              btn.body === curr ||
              btn.author_permlink === curr ||
              btn.permlink === curr ||
              btn.id === curr,
          );

          return currentLink ? [...acc, currentLink] : acc;
        }, []);
        return uniq([...sortButtons, ...buttonArray]).map(item =>
          this.getMenuSectionLink({ id: item.id || item.name, ...item }),
        );
      }

      return (
        <React.Fragment>
          {isEditMode && !isList && (
            <div className="object-sidebar__section-title">
              <FormattedMessage id="menu" defaultMessage="Menu" />
            </div>
          )}
          {!isList && (
            <div className="object-sidebar__menu-items">
              <React.Fragment>
                {this.listItem(
                  TYPES_OF_MENU_ITEM.LIST,
                  !isEmpty(menuLinks) && menuLinks.map(item => this.getMenuSectionLink(item)),
                )}
                {this.listItem(
                  TYPES_OF_MENU_ITEM.PAGE,
                  !isEmpty(menuPages) &&
                    menuPages.map(page =>
                      this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.PAGE, ...page }),
                    ),
                )}
                {this.listItem(
                  objectFields.button,
                  !isEmpty(button) &&
                    button.map(btn => this.getMenuSectionLink({ id: btn.name, ...btn })),
                )}
                {this.listItem(
                  objectFields.newsFilter,
                  newsFilter && this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.NEWS }),
                )}
                {this.listItem(objectFields.sorting, null)}
              </React.Fragment>
            </div>
          )}
        </React.Fragment>
      );
    };

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
        {this.listItem(objectFields.name, null)}
        {this.listItem(
          objectFields.description,
          description && <DescriptionInfo description={description} />,
        )}
        {this.listItem(
          objectFields.rating,
          <RateInfo username={userName} authorPermlink={wobject.author_permlink} />,
        )}
        {this.listItem(objectFields.tagCategory, this.renderTagCategories(tagCategoriesList))}
        {this.listItem(objectFields.categoryItem, null)}
        {this.listItem(
          objectFields.galleryItem,
          pictures && <PicturesCarousel pics={pictures} objectID={wobject.author_permlink} />,
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
              isWaivio={this.props.isWaivio}
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
        {this.listItem(objectFields.authority, null)}
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
            {!isHashtag && !hasType(wobject, OBJECT_TYPE.PAGE) && menuSection()}
            {!isHashtag && aboutSection}
            {accessExtend && hasType(wobject, OBJECT_TYPE.LIST) && listSection}
            {accessExtend && settingsSection}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
