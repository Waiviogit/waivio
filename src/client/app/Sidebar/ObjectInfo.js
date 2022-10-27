import React from 'react';
import { get, has, identity, isEmpty, pickBy, setWith, uniq } from 'lodash';
import { Button, Icon, Tag } from 'antd';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import Lightbox from 'react-image-lightbox';
import {
  accessTypesArr,
  getBlogItems,
  getFormItems,
  getMenuItems,
  getObjectName,
  hasType,
  haveAccess,
  parseAddress,
  parseButtonsField,
  parseWobjectField,
} from '../../../common/helpers/wObjectHelper';
import SocialLinks from '../../components/SocialLinks';
import { getExposedFieldsByObjType, getFieldsCount, getLink } from '../../object/wObjectHelper';
import {
  linkFields,
  objectFields,
  TYPES_OF_MENU_ITEM,
} from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../object/const/objectTypes';
import Proposition from '../../components/Proposition/Proposition';
import { isCoordinatesValid } from '../../components/Maps/mapHelper';
import PicturesCarousel from '../../object/PicturesCarousel';
import DescriptionInfo from './DescriptionInfo';
import RateInfo from '../../components/Sidebar/Rate/RateInfo';
import MapObjectInfo from '../../components/Maps/MapObjectInfo';
import ObjectCard from '../../components/Sidebar/ObjectCard';
import ObjectInfoExperts from './ObjectInfoExperts';
import LinkButton from '../../components/LinkButton/LinkButton';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import { getRelatedAlbum } from '../../../store/galleryStore/galleryActions';
import CompanyId from './CompanyId';
import ProductId from './ProductId';

import './ObjectInfo.less';
import ObjectAvatar from '../../components/ObjectAvatar';
import Options from '../../object/Options';

@withRouter
@connect(
  state => ({
    albums: getObjectAlbums(state),
    isAuthenticated: getIsAuthenticated(state),
    isWaivio: getIsWaivio(state),
    relatedAlbum: getRelatedPhotos(state),
  }),
  { getRelatedAlbum },
)
class ObjectInfo extends React.Component {
  static propTypes = {
    location: PropTypes.shape(),
    wobject: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    isWaivio: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    appendAlbum: PropTypes.func.isRequired,
    albums: PropTypes.shape(),
    relatedAlbum: PropTypes.shape().isRequired,
    getRelatedAlbum: PropTypes.func.isRequired,
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
    openOption: false,
    photoIndex: 0,
    activeOption: {},
    hoveredOption: {},
    selectedField: null,
    showModal: false,
    showMore: {},
    countPhones: 3,
  };

  componentDidMount() {
    this.props.getRelatedAlbum(this.props.match.params.name, 10);
  }

  incrementPhoneCount = 3;

  getFieldLayout = (fieldName, params) => {
    const { body } = params;

    switch (fieldName) {
      case objectFields.phone:
        return (
          <span>
            <Icon type="phone" className="text-icon tel" />
            {Boolean(params.body) && body}
            <a href={`tel:${params.number}`} className={body ? 'phone-number' : ''}>
              {params.number}
            </a>
          </span>
        );
      default:
        break;
    }

    return null;
  };

  handleSelectField = field => () => {
    this.setState({ selectedField: field });
  };

  handleShowMorePhones = field => {
    this.setState(prev => ({
      countPhones: prev.countPhones + this.incrementPhoneCount,
    }));

    return this.handleSelectField(field);
  };

  handleToggleModal = () => this.setState(prevState => ({ showModal: !prevState.showModal }));

  listItem = (name, content) => {
    const { wobject, userName, isEditMode, albums, appendAlbum } = this.props;
    const fieldsCount = getFieldsCount(wobject, name);
    const exposedFields = getExposedFieldsByObjType(wobject);
    const shouldDisplay = exposedFields.includes(name);
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;
    const paddingBottom =
      name !== 'publisher' || (isEditMode && !wobject.publisher) || wobject.groupId;

    return (
      shouldDisplay &&
      (content || accessExtend) && (
        <div className={paddingBottom ? 'field-info' : 'field-info field-info__nopadding'}>
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
    const blogPath = `/object/${wobject.author_permlink}/blog/@${item.body}`;
    const formPath = `/object/${wobject.author_permlink}/form/${item.permlink}`;
    const newsFilterPath = `/object/${wobject.author_permlink}/newsFilter/${item.permlink}`;
    const blogClassesList = classNames('menu-btn', {
      active: location.pathname === blogPath,
    });
    const formClassesList = classNames('menu-btn', {
      active: location.pathname === formPath,
    });
    const newsFilterClassesList = classNames('menu-btn', {
      active: location.pathname === newsFilterPath,
    });
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
      case objectFields.newsFilter:
        menuItem = (
          <LinkButton className={newsFilterClassesList} to={newsFilterPath}>
            {item.title || <FormattedMessage id="news" defaultMessage="News" />}
          </LinkButton>
        );
        break;
      case TYPES_OF_MENU_ITEM.BLOG:
        menuItem = (
          <LinkButton className={blogClassesList} to={blogPath}>
            {item.blogTitle}
          </LinkButton>
        );
        break;
      case objectFields.form:
        menuItem = (
          <LinkButton className={formClassesList} to={formPath}>
            {item.title}
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
  handleOptionClick = pic => {
    if (!pic.name) {
      this.setState({ openOption: true });
    }
  };
  handleOptionCloseClick = () => this.setState({ openOption: false, photoIndex: 0 });

  render() {
    const { wobject, userName, isAuthenticated, relatedAlbum } = this.props;
    const { photoIndex, activeOption, hoveredOption } = this.state;
    const isEditMode = isAuthenticated ? this.props.isEditMode : false;
    const newsFilters = get(wobject, 'newsFilter', []);
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
    const pictures = [...get(wobject, 'preview_gallery', []), ...get(relatedAlbum, 'items', [])];
    const short = get(wobject, 'title');
    const email = get(wobject, 'email');
    const workTime = get(wobject, 'workTime');
    const linkField = parseWobjectField(wobject, 'link');
    const customSort = get(wobject, 'sortCustom', []);
    const companyIdBody = wobject.companyId
      ? wobject.companyId.map(el => parseWobjectField(el, 'body', []))
      : [];
    const productIdBody = wobject.productId
      ? wobject?.productId.map(el => parseWobjectField(el, 'body', []))
      : [];
    const ageRange = wobject.ageRange;
    const language = wobject.language;
    const groupId = wobject.groupId;
    const publicationDate = moment(wobject.publicationDate).format('MMMM DD, YYYY');
    const printLength = wobject.printLength;
    const publisher = parseWobjectField(wobject, 'publisher');
    const authorsBody = wobject.authors
      ? wobject.authors.map(el => parseWobjectField(el, 'body', []))
      : [];

    const optionsPictures = wobject?.options
      ? Object.entries(wobject?.options)
          .map(option => Object.values(option))
          .flatMap(el => el[1])
          .filter(el => el.body.image)
          .map(o => ({ body: o.body.image, id: o.permlink }))
      : [];

    const sortedOptionsPictures = optionsPictures.filter(
      o => activeOption?.body?.image !== o?.body,
    );

    const activeOptionPicture = [
      {
        body:
          hoveredOption?.body?.image ||
          activeOption?.body?.image ||
          wobject.avatar ||
          optionsPictures[0]?.body,
        id: wobject.author_permlink,
        name: wobject.avatar && 'avatar',
      },
      ...pictures,
      ...sortedOptionsPictures,
    ];
    const lightboxOptionPicture = [
      {
        body: hoveredOption?.body?.image || activeOption?.body?.image || optionsPictures[0]?.body,
        id: wobject.author_permlink,
      },
      ...sortedOptionsPictures,
    ];

    const dimensions = parseWobjectField(wobject, 'dimensions');
    const productWeight = parseWobjectField(wobject, 'productWeight');
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
    const blogsList = getBlogItems(wobject);
    const formsList = getFormItems(wobject).map(item => ({
      ...item,
      id: objectFields.form,
    }));

    const isOptionsObjectType = ['book', 'product', 'service'].includes(wobject.object_type);
    const galleryPriceOptionsSection = (
      <>
        {(pictures.length > 1 || avatar || wobject?.options) &&
          this.listItem(
            objectFields.galleryItem,
            <PicturesCarousel
              activePicture={activeOption}
              onClick={this.handleOptionClick}
              pics={activeOptionPicture}
              objectID={wobject.author_permlink}
            />,
          )}
        {this.state.openOption && (
          <Lightbox
            mainSrc={lightboxOptionPicture[photoIndex].body}
            nextSrc={lightboxOptionPicture[(photoIndex + 1) % lightboxOptionPicture.length].body}
            prevSrc={
              lightboxOptionPicture[
                (photoIndex + lightboxOptionPicture.length - 1) % lightboxOptionPicture.length
              ].body
            }
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + lightboxOptionPicture.length - 1) % lightboxOptionPicture.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % lightboxOptionPicture.length,
              })
            }
            onCloseRequest={this.handleOptionCloseClick}
          />
        )}
        {this.listItem(
          objectFields.price,
          price && (
            <div className="flex">
              {!isEditMode && <span className="field-icon">$</span>}
              <span className="price-value fw8">{hoveredOption.price || price}</span>
            </div>
          ),
        )}

        {this.listItem(
          objectFields.options,
          wobject.options && (
            <Options
              setHoveredOption={option => this.setState({ hoveredOption: option })}
              setActiveOption={option => this.setState({ activeOption: option })}
              isEditMode={isEditMode}
              wobject={wobject}
              history={this.props.history}
            />
          ),
        )}
      </>
    );

    const menuSection = () => {
      if (!isEditMode && !isEmpty(customSort) && !hasType(wobject, OBJECT_TYPE.LIST)) {
        const buttonArray = [
          ...menuLinks,
          ...menuPages,
          ...button,
          ...blogsList,
          ...formsList,
          ...newsFilters,
        ];

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
                  !isEmpty(newsFilters) &&
                    newsFilters.map(filter =>
                      this.getMenuSectionLink({ id: filter.id || filter.name, ...filter }),
                    ),
                )}
                {this.listItem(
                  objectFields.blog,
                  !isEmpty(blogsList) &&
                    blogsList.map(blog =>
                      this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.BLOG, ...blog }),
                    ),
                )}
                {this.listItem(
                  objectFields.form,
                  !isEmpty(formsList) &&
                    formsList.map(form =>
                      this.getMenuSectionLink({ id: objectFields.form, ...form }),
                    ),
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
        {isEditMode &&
          this.listItem(
            objectFields.authors,
            <div>
              {authorsBody?.map((a, i) => (
                <>
                  {a.defaultShowLink ? (
                    <Link to={`/object/${a.authorPermlink}`}>{a.name}</Link>
                  ) : (
                    <span>{a.name}</span>
                  )}
                  <>
                    {i !== authorsBody.length - 1 && ','}
                    {'  '}
                  </>
                </>
              ))}
            </div>,
          )}
        {isEditMode &&
          this.listItem(
            objectFields.publisher,
            publisher &&
              (publisher.authorPermlink ? (
                <ObjectCard key={publisher.authorPermlink} wobject={publisher} showFollow={false} />
              ) : (
                <div className="flex ObjectCard__links publisher-paddingBottom">
                  <ObjectAvatar item={publisher} size={34} />{' '}
                  <span className="ObjectCard__name-grey">{publisher.name}</span>
                </div>
              )),
          )}
        {!isOptionsObjectType &&
          this.listItem(
            objectFields.galleryItem,
            <PicturesCarousel pics={pictures} objectID={wobject.author_permlink} />,
          )}
        {!isOptionsObjectType &&
          this.listItem(
            objectFields.price,
            price && (
              <div className="flex">
                {!isEditMode && <span className="field-icon">$</span>}
                <span className="price-value fw8">{price}</span>
              </div>
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
        {this.listItem(objectFields.tagCategory, this.renderTagCategories(tagCategoriesList))}
        {this.listItem(objectFields.categoryItem, null)}
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
          <React.Fragment>
            {phones.length <= 3 || accessExtend ? (
              phones
                .slice(0, 3)
                .map(({ body, number }) =>
                  this.getFieldLayout(objectFields.phone, { body, number }),
                )
            ) : (
              <React.Fragment>
                {phones.map(
                  ({ body, number }, index) =>
                    index < this.state.countPhones &&
                    this.getFieldLayout(objectFields.phone, { body, number }),
                )}
                {phones.length > this.state.countPhones && (
                  <Link
                    to={`/object/${wobject.author_permlink}/updates/${objectFields.phone}`}
                    onClick={() => this.handleShowMorePhones(objectFields.phone)}
                  >
                    <FormattedMessage id="show_more_tags" defaultMessage="show more">
                      {value => <div className="phone">{value}</div>}
                    </FormattedMessage>
                  </Link>
                )}
              </React.Fragment>
            )}
          </React.Fragment>,
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
        {!isEditMode
          ? companyIdBody.length > 0 && <CompanyId companyIdBody={companyIdBody} />
          : this.listItem(
              objectFields.companyId,
              companyIdBody?.map(obj => (
                // eslint-disable-next-line react/jsx-key
                <div className="CompanyId__block-item">
                  <p className="CompanyId__p">{obj.companyIdType}</p>
                  <p className="CompanyId__p">{obj.companyId}</p>
                </div>
              )),
            )}
        {!isEditMode
          ? ageRange && (
              <div className="field-info">
                <span className="field-website__title">
                  <Icon type="read" className="iconfont icon-link text-icon link" />
                  <span className="CompanyId__wordbreak">{ageRange}</span>
                </span>
              </div>
            )
          : this.listItem(
              objectFields.ageRange,
              ageRange && (
                <div className="field-info">
                  <span className="field-website__title">
                    <Icon type="read" className="iconfont icon-link text-icon link" />
                    <span className="CompanyId__wordbreak">{ageRange}</span>
                  </span>
                </div>
              ),
            )}
        {!isEditMode
          ? language && (
              <div className="field-info">
                <span className="field-website__title">
                  <Icon type="global" className="iconfont icon-link text-icon link" />
                  <span className="CompanyId__wordbreak">{language}</span>
                </span>
              </div>
            )
          : this.listItem(
              objectFields.language,
              language && (
                <div className="field-info">
                  <span className="field-website__title">
                    <Icon type="global" className="iconfont icon-link text-icon link" />
                    <span className="CompanyId__wordbreak">{language}</span>
                  </span>
                </div>
              ),
            )}
        {!isEditMode
          ? wobject.publicationDate && (
              <div className="field-info">
                <span className="field-website__title">
                  <img
                    className="ObjectInfo__margin-top"
                    src={'/images/icons/calendar-icon.svg'}
                    alt="Calendar icon"
                  />{' '}
                  <span className="CompanyId__wordbreak">{publicationDate}</span>
                </span>
              </div>
            )
          : this.listItem(
              objectFields.publicationDate,
              wobject.publicationDate && (
                <div className="field-info">
                  <span className="field-website__title">
                    <img
                      className="ObjectInfo__margin-top"
                      src={'/images/icons/calendar-icon.svg'}
                      alt="Calendar icon"
                    />{' '}
                    <span className="CompanyId__wordbreak">{publicationDate}</span>
                  </span>
                </div>
              ),
            )}
        {!isEditMode
          ? printLength && (
              <div className="field-info">
                <span className="field-website__title">
                  <Icon type="book" className="iconfont icon-link text-icon link" />
                  <span className="CompanyId__wordbreak">
                    {printLength} <FormattedMessage id="lowercase_pages" />{' '}
                  </span>
                </span>
              </div>
            )
          : this.listItem(
              objectFields.printLength,
              printLength && (
                <div className="field-info">
                  <span className="field-website__title">
                    <Icon type="book" className="iconfont icon-link text-icon link" />
                    <span className="CompanyId__wordbreak">
                      {' '}
                      {printLength} <FormattedMessage id="lowercase_pages" />{' '}
                    </span>
                  </span>
                </div>
              ),
            )}
        {this.listItem(
          objectFields.productWeight,
          productWeight && (
            <div className="field-info">
              <span className="field-website__title">
                <img
                  style={{ width: '14px', height: '14px' }}
                  className="ObjectInfo__margin-top"
                  src={'/images/icons/scale.png'}
                  alt="Scale icon"
                />{' '}
                <span>
                  {productWeight.value} {productWeight.unit}
                </span>
              </span>
            </div>
          ),
        )}
        {this.listItem(
          objectFields.dimensions,
          dimensions && (
            <div className="field-info">
              <span className="field-website__title">
                <img
                  style={{ width: '14px', height: '14px' }}
                  className="ObjectInfo__margin-top"
                  src={'/images/icons/dimensions-icon.svg'}
                  alt="Scale icon"
                />{' '}
                <span className="CompanyId__wordbreak">
                  {dimensions.length} x {dimensions.width} x {dimensions.depth} {dimensions.unit}
                </span>
              </span>
            </div>
          ),
        )}
        {!isEditMode ? (
          <ProductId
            groupIdContent={
              groupId && (
                <div className="field-info">
                  <div className="CompanyId__title">
                    <FormattedMessage id="object_field_groupId" formattedMessage="Group ID" />
                  </div>
                  <div className="field-website__title">
                    <span className="CompanyId__wordbreak">{groupId}</span>
                  </div>
                </div>
              )
            }
            productIdBody={productIdBody}
          />
        ) : (
          this.listItem(
            objectFields.productId,
            productIdBody?.map(obj => (
              <div key={obj.id}>
                <p className="CompanyId__p">{obj.productIdType}</p>
                <p className="CompanyId__p">{obj.productId}</p>
                <div className="field-avatar CompanyId__p CompanyId__image">
                  {obj.productIdImage && <img src={obj.productIdImage} alt="pic" />}
                </div>
              </div>
            )),
          )
        )}
        {isEditMode &&
          this.listItem(
            objectFields.groupId,
            groupId && (
              <div className="field-info">
                <FormattedMessage id="object_field_groupId" formattedMessage="Group ID" />
                <div className="field-website__title">
                  <span className="CompanyId__wordbreak ">{groupId}</span>
                </div>
              </div>
            ),
          )}
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
        {!isEditMode && wobject.authors && (
          <div className="mb3">
            By{' '}
            {authorsBody?.map((a, i) => (
              <span key={a.id}>
                {a.defaultShowLink ? (
                  <Link to={`/object/${a.authorPermlink}`}>{a.name}</Link>
                ) : (
                  <span>{a.name}</span>
                )}
                <>
                  {i !== authorsBody.length - 1 && ','}
                  {'  '}
                </>
              </span>
            ))}
          </div>
        )}
        {wobject && wobjName && (
          <div className="object-sidebar">
            {this.listItem(
              objectFields.parent,
              parent && (
                <ObjectCard key={parent.author_permlink} wobject={parent} showFollow={false} />
              ),
            )}
            {!isEditMode &&
              this.listItem(
                objectFields.publisher,
                publisher &&
                  (publisher.authorPermlink ? (
                    <ObjectCard
                      key={publisher.authorPermlink}
                      wobject={publisher}
                      showFollow={false}
                    />
                  ) : (
                    <div className="flex ObjectCard__links publisher-paddingBottom">
                      <ObjectAvatar item={publisher} size={34} />{' '}
                      <span className="ObjectCard__name-grey">{publisher.name}</span>
                    </div>
                  )),
              )}
            {isOptionsObjectType && galleryPriceOptionsSection}
            {!isHashtag && !hasType(wobject, OBJECT_TYPE.PAGE) && menuSection()}
            {!isHashtag && aboutSection}
            {accessExtend && hasType(wobject, OBJECT_TYPE.LIST) && listSection}
            {accessExtend && settingsSection}
            <ObjectInfoExperts wobject={wobject} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ObjectInfo;
