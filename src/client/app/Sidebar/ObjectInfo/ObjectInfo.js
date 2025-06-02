import React from 'react';
import { get, has, identity, isEmpty, pickBy, setWith, uniq, uniqBy, isEqual } from 'lodash';
import { Button, Icon, Tag } from 'antd';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import {
  accessTypesArr,
  getBlogItems,
  getBrandName,
  getFormItems,
  getMenuItems,
  getObjectName,
  hasType,
  haveAccess,
  parseAddress,
  parseButtonsField,
  parseWobjectField,
} from '../../../../common/helpers/wObjectHelper';
import { getWobjectAuthors } from '../../../../store/wObjectStore/wObjectSelectors';
import SocialLinks from '../../../components/SocialLinks';
import { getExposedFieldsByObjType, getFieldsCount, getLink } from '../../../object/wObjectHelper';
import {
  linkFields,
  mapObjectTypeFields,
  objectFields,
  recipeFields,
  TYPES_OF_MENU_ITEM,
} from '../../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../../object/const/objectTypes';
import Proposition from '../../../components/Proposition/Proposition';
import { isCoordinatesValid } from '../../../components/Maps/mapHelpers';
import PicturesCarousel from '../../../object/PicturesCarousel';
import DescriptionInfo from '../../../object/Description/DescriptionInfo';
import RateInfo from '../../../components/Sidebar/Rate/RateInfo';
import MapObjectInfo from '../../../components/Maps/MapObjectInfo';
import ObjectCard from '../../../components/Sidebar/ObjectCard';
import ObjectInfoExperts from '../ObjectInfoExperts';
import LinkButton from '../../../components/LinkButton/LinkButton';
import { getIsWaivio, getUsedLocale } from '../../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';
import { getObjectAlbums, getRelatedPhotos } from '../../../../store/galleryStore/gallerySelectors';
import { getRelatedAlbum } from '../../../../store/galleryStore/galleryActions';
import CompanyId from '../CompanyId';
import ProductId from '../ProductId';
import ObjectAvatar from '../../../components/ObjectAvatar';
import Options from '../../../object/Options/Options';
import {
  getActiveCategory,
  getActiveOption,
  getGroupId,
} from '../../../../store/optionsStore/optionsSelectors';
import {
  setStoreActiveOption,
  setStoreGroupId,
} from '../../../../store/optionsStore/optionsActions';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import Department from '../../../object/Department/Department';
import AffiliatLink from '../../../widgets/AffiliatLinks/AffiliatLink';
import ObjectFeatures from '../../../object/ObjectFeatures/ObjectFeatures';
import DepartmentsWobject from '../../../object/ObjectTypeShop/DepartmentsWobject';
import { setAuthors } from '../../../../store/wObjectStore/wobjActions';
import MenuItemButtons from '../MenuItemButtons/MenuItemButtons';
import MenuItemButton from '../MenuItemButtons/MenuItemButton';
import AffiliateSection from './ObjectInfoComponents/AffiliateSection';
import { getCoordinates } from '../../../../store/userStore/userActions';
import MapObjectTypes from './ObjectInfoComponents/MapObjectTypes';
import MapObjectTags from './ObjectInfoComponents/MapObjectTags';
import WalletAddress from '../WalletAddress/WalletAddress';
import RecipeIngredients from '../RecipeIngredients/RecipeIngredients';
import ExpertiseTags from '../../../object/GroupObjectInfo/ExpertiseTags';
import GroupUsersLayout from '../../../object/GroupObjectInfo/GroupUsersLayout';
import GroupLastActivity from '../../../object/GroupObjectInfo/GroupLastActivity';
import PromotionInfo from '../../../object/PromotionInfo/PromotionInfo';
import './ObjectInfo.less';

@withRouter
@connect(
  state => ({
    albums: getObjectAlbums(state),
    authorsArray: getWobjectAuthors(state),
    isAuthenticated: getIsAuthenticated(state),
    locale: getUsedLocale(state),
    isWaivio: getIsWaivio(state),
    relatedAlbum: getRelatedPhotos(state),
    activeOption: getActiveOption(state),
    activeCategory: getActiveCategory(state),
    storeGroupId: getGroupId(state),
  }),
  { getRelatedAlbum, setStoreGroupId, setStoreActiveOption, setAuthors, getCoordinates },
)
class ObjectInfo extends React.Component {
  static propTypes = {
    location: PropTypes.shape(),
    activeOption: PropTypes.shape(),
    activeCategory: PropTypes.string,
    locale: PropTypes.string,
    wobject: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    isWaivio: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    appendAlbum: PropTypes.func.isRequired,
    albums: PropTypes.arrayOf(),
    authorsArray: PropTypes.arrayOf(),
    relatedAlbum: PropTypes.shape().isRequired,
    // getRelatedAlbum: PropTypes.func.isRequired,
    setStoreGroupId: PropTypes.func.isRequired,
    setAuthors: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    setStoreActiveOption: PropTypes.func.isRequired,
    getCoordinates: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getAreaSearchData: () => {},
    userLocation: {},
    activeOption: {},
    activeCategory: '',
    storeGroupId: '',
    location: {},
    center: [],
    albums: [],
    isAuthenticated: false,
    isWaivio: true,
  };

  state = {
    openOption: false,
    photoIndex: 0,
    hoveredOption: {},
    selectedField: null,
    showModal: false,
    showMore: {},
    countPhones: 3,
    publisherObject: {},
    manufacturerObject: {},
    brandObject: {},
    merchantObject: {},
    mapObjectsListObject: {},
    mapObjectTagsArr: [],
    authorsArray: [],
    menuItemsArray: [],
    showMenuLegacy: false,
  };

  componentDidMount() {
    const { wobject } = this.props;

    this.getNewFieldsData();
    this.props.getCoordinates();

    // this.props.getRelatedAlbum(this.props.match.params.name, 10);

    if (wobject.groupId) {
      this.props.setStoreGroupId(wobject.groupId);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      author_permlink,
      authors,
      publisher,
      manufacturer,
      brand,
      merchant,
      groupId,
      menuItem,
      mapObjectsList,
      mapObjectTags,
      sortCustom,
    } = this.props.wobject;

    if (
      author_permlink !== prevProps.wobject.author_permlink ||
      publisher !== prevProps.wobject.publisher ||
      authors !== prevProps.wobject.authors ||
      manufacturer !== prevProps.wobject.manufacturer ||
      brand !== prevProps.wobject.brand ||
      merchant !== prevProps.wobject.merchant ||
      menuItem !== prevProps.wobject.menuItem ||
      !isEqual(sortCustom, prevProps.wobject.sortCustom) ||
      mapObjectsList !== prevProps.wobject.mapObjectsList ||
      mapObjectTags !== prevProps.wobject.mapObjectTags
    ) {
      this.getNewFieldsData();
    }
    if (groupId !== prevProps.wobject.groupId) {
      this.props.setStoreActiveOption({});
    }
  }

  incrementPhoneCount = 3;

  async getNewFieldsData() {
    const { wobject } = this.props;

    const publisher = parseWobjectField(wobject, 'publisher');
    const manufacturer = parseWobjectField(wobject, 'manufacturer');
    const brand = parseWobjectField(wobject, 'brand');
    const merchant = parseWobjectField(wobject, 'merchant');
    const mapObjectsList = get(wobject, 'mapObjectsList');
    const authors = wobject.authors
      ? wobject.authors?.map(el => parseWobjectField(el, 'body', []))
      : [];
    const mapObjectTags = wobject.mapObjectTags ? parseWobjectField(wobject, 'mapObjectTags') : [];

    const authorsArray = await authors.reduce(async (acc, curr) => {
      const res = await acc;
      const permlink = curr.authorPermlink || curr.author_permlink;

      if (permlink && !has(curr, 'name')) {
        const newObj = await getObjectInfo([permlink], this.props.locale);

        return [...res, newObj.wobjects[0]];
      }

      return [...res, curr];
    }, []);

    this.props.setAuthors(authorsArray);

    const menuItemsArray = await wobject.menuItem?.reduce(async (acc, curr) => {
      const res = await acc;
      const itemBody = JSON.parse(curr.body);

      if (itemBody.linkToObject && !has(itemBody, 'title')) {
        const newObj = await getObjectInfo([itemBody.linkToObject], this.props.locale);

        return [
          ...res,
          {
            ...curr,
            body: JSON.stringify({
              ...itemBody,
              title: newObj.wobjects[0].name || newObj.wobjects[0].default_name,
            }),
          },
        ];
      }

      return [...res, curr];
    }, []);

    this.setState({ menuItemsArray });

    const backObjects = [
      publisher?.authorPermlink,
      manufacturer?.authorPermlink,
      brand?.authorPermlink,
      merchant?.authorPermlink,
      mapObjectsList,
    ].filter(permlink => permlink);

    if (!isEmpty(mapObjectTags)) {
      getObjectInfo(mapObjectTags, this.props.locale).then(res => {
        this.setState({ mapObjectTagsArr: res.wobjects });
      });
    }
    if (!isEmpty(backObjects)) {
      getObjectInfo(backObjects, this.props.locale).then(res => {
        const brandObject =
          res.wobjects.find(wobj => wobj.author_permlink === brand?.authorPermlink) || brand;
        const manufacturerObject =
          res.wobjects.find(wobj => wobj.author_permlink === manufacturer?.authorPermlink) ||
          manufacturer;
        const publisherObject =
          res.wobjects.find(wobj => wobj.author_permlink === publisher?.authorPermlink) ||
          publisher;
        const merchantObject =
          res.wobjects.find(wobj => wobj.author_permlink === merchant?.authorPermlink) || merchant;
        const mapObjectsListObject =
          res.wobjects.find(wobj => wobj.author_permlink === mapObjectsList) || {};

        this.setState({
          brandObject,
          manufacturerObject,
          publisherObject,
          merchantObject,
          mapObjectsListObject,
        });
      });
    }
  }
  authorFieldAuthorPermlink = author => author.authorPermlink || author.author_permlink;

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

    return (
      shouldDisplay &&
      (!isEmpty(content) || accessExtend) && (
        <div className="field-info">
          <React.Fragment>
            {accessExtend && (
              <div className="field-info__title">
                <Proposition
                  wObject={wobject}
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
    const onlyFiveItems = categoryItems
      ?.sort((a, b) => b.weight - a.weight)
      .filter((f, i) => i < 5);
    const tagArray = this.state.showMore[category] ? categoryItems : onlyFiveItems;

    return (
      <div>
        {tagArray
          ?.sort((a, b) => b.weight - a.weight)
          ?.map(item => (
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
    tagCategories?.map(item => (
      <div key={item.id}>
        {`${item.body}:`}
        <br />
        {item.items && this.renderCategoryItems(item.items, item.body)}
      </div>
    ));

  getMenuSectionLink = (item = {}) => {
    const { wobject, location } = this.props;
    const customSortExclude = get(wobject, 'sortCustom.exclude', []);
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
      case objectFields.menuItem:
        menuItem = (
          <MenuItemButton item={item} show={!customSortExclude?.includes(item.permlink)} />
        );
        break;
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
    albums?.map(album => {
      if (!has(album, 'active_votes') && !has(album, 'weight')) {
        setWith(album, '[active_votes]', []);
        setWith(album, '[weight]', 0);
      }

      return album;
    });

  render() {
    const {
      wobject,
      userName,
      isAuthenticated,
      relatedAlbum,
      activeOption,
      activeCategory,
    } = this.props;
    const { hoveredOption } = this.state;
    const isEditMode = isAuthenticated ? this.props.isEditMode : false;
    const newsFilters = get(wobject, 'newsFilter', []);
    const website = parseWobjectField(wobject, 'website');
    const menuItem = get(wobject, 'menuItem', []);
    const wobjName = getObjectName(wobject);
    const tagCategories = get(wobject, 'tagCategory', []);
    const map = parseWobjectField(wobject, 'map');
    const walletAddress = get(wobject, 'walletAddress', []);
    const mapObjectTypes = parseWobjectField(wobject, 'mapObjectTypes');
    const parent = get(wobject, 'parent');
    const status = parseWobjectField(wobject, 'status');
    const address = parseAddress(wobject);
    const description = get(wobject, 'description');
    const price = get(wobject, 'price');
    const compareAtPrice = get(wobject, 'compareAtPrice');
    const sale = get(wobject, 'sale');
    const avatar = get(wobject, 'avatar');
    const background = get(wobject, 'background');
    const pictures = [...get(wobject, 'preview_gallery', []), ...get(relatedAlbum, 'items', [])];
    const short = get(wobject, 'title');
    const email = get(wobject, 'email');
    const workTime = get(wobject, 'workTime');
    const linkField = parseWobjectField(wobject, 'link');
    const groupFollowers = parseWobjectField(wobject, 'groupFollowers');
    const groupFollowing = parseWobjectField(wobject, 'groupFollowing');
    const groupAdd = get(wobject, 'groupAdd', []);
    const groupLastActivity = get(wobject, 'groupLastActivity', []);
    const groupExpertise = parseWobjectField(wobject, 'groupExpertise');
    const recipeIngredients = parseWobjectField(wobject, 'recipeIngredients');
    const customSortInclude = get(wobject, 'sortCustom.include', []);
    const customSortExclude = get(wobject, 'sortCustom.exclude', []);
    const promotion = get(wobject, 'promotion', []);
    const companyIdBody = wobject.companyId
      ? wobject.companyId?.map(el => parseWobjectField(el, 'body', []))
      : [];
    const productIdBody = wobject.productId
      ? wobject?.productId?.map(el => parseWobjectField(el, 'body', []))
      : [];
    const googleObject = companyIdBody?.find(i => i.companyIdType === 'googleMaps');
    const placeId = googleObject?.companyId;
    const ageRange = wobject.ageRange;
    const language = wobject.language;
    const cookingTime = wobject.cookingTime;
    const calories = wobject.calories;
    const nutrition = wobject.nutrition;
    const budget = wobject.budget;
    const groupId = wobject.groupId;
    const publicationDate = moment(wobject.publicationDate).format('MMMM DD, YYYY');
    const printLength = wobject.printLength;
    const publisher = parseWobjectField(wobject, 'publisher');
    const manufacturer = parseWobjectField(wobject, 'manufacturer');
    const brand = parseWobjectField(wobject, 'brand');
    const merchant = parseWobjectField(wobject, 'merchant');
    const showDescriptionButton = has(wobject, 'galleryItem')
      ? wobject?.galleryItem.length > 1
      : false;
    const merchantObj = {
      ...this.state.merchantObject,
      name: merchant?.name || this.state.merchantObject?.name,
    };
    const publisherObj = {
      ...this.state.publisherObject,
      name: publisher?.name || this.state.publisherObject?.name,
    };
    const manufacturerObj = {
      ...this.state.manufacturerObject,
      name: manufacturer?.name || this.state.manufacturerObject?.name,
    };
    const brandObj = {
      ...this.state.brandObject,
      name: brand?.name || this.state.brandObject?.name,
    };

    const departments = get(wobject, 'departments');
    const features = wobject.features
      ? wobject.features?.map(el => parseWobjectField(el, 'body', []))
      : [];
    const hasOptionsPics =
      !isEmpty(wobject.options) &&
      Object.values(wobject?.options)
        .flatMap(o => o)
        .some(option => has(option, 'avatar'));

    const getPictures = () => {
      const activeOptionPicture = uniqBy([...pictures], 'body');
      const optionsPictures = wobject?.options
        ? Object.entries(wobject?.options)
            ?.map(option => Object.values(option))
            .flatMap(el => el[1])
            // .filter(el => el.body.image)
            ?.map(o => ({
              body: o?.avatar,
              id:
                o.author_permlink === wobject.author_permlink && wobject.galleryAlbum
                  ? wobject?.galleryAlbum[0]?.id || wobject.galleryItem[0]?.id
                  : o.author_permlink,
              name: 'options',
              parentPermlink: o.author_permlink,
            }))
            // eslint-disable-next-line array-callback-return,consistent-return
            .sort((a, b) => {
              if (a.body === wobject?.avatar) {
                return -1;
              }
              if (b.body === wobject?.avatar) {
                return 1;
              }
            })
        : [];

      const sortedOptions = optionsPictures.filter(
        o => activeOption[activeCategory]?.avatar !== o?.body,
      );

      if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
        return uniqBy(
          [
            {
              name: 'galleryItem',
              body: hoveredOption?.avatar || activeOption[activeCategory]?.avatar,
              id: wobject?.galleryAlbum ? wobject?.galleryAlbum[0]?.id : wobject.author_permlink,
            },
            ...pictures,
          ],
          'body',
        );
      }
      // if (!has(wobject, 'groupId')) {
      //   return activeOptionPicture.filter(o => o.name !== 'avatar');
      // }
      if (has(wobject, 'groupId') && !has(wobject, 'avatar') && !has(wobject, 'galleryItem')) {
        return uniqBy(
          [
            {
              name: 'galleryItem',
              body:
                hoveredOption?.avatar ||
                activeOption[activeCategory]?.avatar ||
                sortedOptions[0]?.body,
              id: wobject?.galleryAlbum ? wobject?.galleryAlbum[0]?.id : wobject.author_permlink,
            },
            ...sortedOptions,
          ],
          'body',
        );
      }

      return activeOptionPicture;
    };

    const dimensions = parseWobjectField(wobject, 'dimensions');
    const productWeight = parseWobjectField(wobject, 'productWeight');
    const profile = linkField
      ? {
          facebook: linkField[linkFields.linkFacebook] || '',
          twitter: linkField[linkFields.linkTwitter] || '',
          youtube: linkField[linkFields.linkYouTube] || '',
          tiktok: linkField[linkFields.linkTikTok] || '',
          reddit: linkField[linkFields.linkReddit] || '',
          linkedin: linkField[linkFields.linkLinkedIn] || '',
          telegram: linkField[linkFields.linkTelegram] || '',
          whatsapp: linkField[linkFields.linkWhatsApp] || '',
          pinterest: linkField[linkFields.linkPinterest] || '',
          twitch: linkField[linkFields.linkTwitch] || '',
          snapchat: linkField[linkFields.linkSnapchat] || '',
          hive: linkField[linkFields.linkHive] || '',
          instagram: linkField[linkFields.linkInstagram] || '',
          github: linkField[linkFields.linkGitHub] || '',
        }
      : {};
    const phones = get(wobject, 'phone', []);
    const mapObjectsList = get(wobject, 'mapObjectsList', '');
    const isHashtag = hasType(wobject, OBJECT_TYPE.HASHTAG);
    const isAffiliate = hasType(wobject, OBJECT_TYPE.AFFILIATE);
    const isDescriptionPage = this.props.match.params[0] === 'description';
    const shopType = wobject.object_type === 'shop';
    const showFeedSection = wobject?.exposedFields?.some(f => ['pin', 'remove'].includes(f.name));
    const showConnectSection = wobject?.exposedFields?.some(f =>
      ['addOn', 'similar', 'related'].includes(f.name),
    );
    const accessExtend = haveAccess(wobject, userName, accessTypesArr[0]) && isEditMode;
    const isRenderMap = map && isCoordinatesValid(map.latitude, map.longitude);
    const menuLinks = getMenuItems(wobject, TYPES_OF_MENU_ITEM.LIST, OBJECT_TYPE.LIST);
    const menuPages = getMenuItems(wobject, TYPES_OF_MENU_ITEM.PAGE, OBJECT_TYPE.PAGE);
    const button = parseButtonsField(wobject);
    const affiliateLinks = wobject?.affiliateLinks || [];
    const isList = hasType(wobject, OBJECT_TYPE.LIST);
    const isRecipe = hasType(wobject, OBJECT_TYPE.RECIPE);
    const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));
    const blogsList = getBlogItems(wobject);
    const linkUrl = get(wobject, 'url', '');
    const linkUrlHref = linkUrl?.endsWith('*') ? linkUrl?.slice(0, -1) : linkUrl;
    const showLinkSection = hasType(wobject, OBJECT_TYPE.LINK);
    const showGroupSection = hasType(wobject, OBJECT_TYPE.GROUP);
    const showLRecipeSection = hasType(wobject, OBJECT_TYPE.RECIPE);
    const showMenuSection =
      !hasType(wobject, OBJECT_TYPE.PAGE) &&
      !hasType(wobject, OBJECT_TYPE.MAP) &&
      !hasType(wobject, OBJECT_TYPE.WEBPAGE) &&
      !hasType(wobject, OBJECT_TYPE.SHOP) &&
      !hasType(wobject, OBJECT_TYPE.LIST) &&
      !hasType(wobject, OBJECT_TYPE.DISH) &&
      !hasType(wobject, OBJECT_TYPE.AFFILIATE) &&
      !hasType(wobject, OBJECT_TYPE.LINK) &&
      !hasType(wobject, OBJECT_TYPE.RECIPE) &&
      !hasType(wobject, OBJECT_TYPE.GROUP) &&
      !hasType(wobject, OBJECT_TYPE.DRINK);
    const showMapSection = hasType(wobject, OBJECT_TYPE.MAP);
    const formsList = getFormItems(wobject)?.map(item => ({
      ...item,
      id: objectFields.form,
    }));
    const isOptionsObjectType = ['book', 'product', 'service'].includes(wobject.object_type);
    const galleryPriceOptionsSection = (
      <>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="navigate" defaultMessage="Navigate" />
          </div>
        )}
        {this.listItem(
          objectFields.galleryItem,
          (pictures.length > 0 || avatar || hasOptionsPics) && (
            <PicturesCarousel
              albums={[...this.props.albums, this.props.relatedAlbum]}
              wobject={wobject}
              activePicture={hoveredOption || activeOption}
              pics={getPictures()}
            />
          ),
        )}
        {this.listItem(
          objectFields.compareAtPrice,
          compareAtPrice && (
            <div className="flex">
              {!isEditMode && <span className="field-icon">$</span>}
              <span className={price ? 'price-value--sale fw8' : 'price-value fw8'}>
                {' '}
                {compareAtPrice}
              </span>
            </div>
          ),
        )}{' '}
        {this.listItem(
          objectFields.price,
          price && (
            <div
              className="flex"
              style={{ marginLeft: compareAtPrice && !isEditMode ? '18px' : '0px' }}
            >
              {!isEditMode && !compareAtPrice && <span className="field-icon">$</span>}
              <span className={sale ? 'price-value--sale fw8' : 'price-value fw8'}>
                {hoveredOption.price || price}
              </span>
            </div>
          ),
        )}{' '}
        {this.listItem(
          objectFields.sale,
          sale && (
            <div
              className={'flex items-center'}
              style={{ marginLeft: isEditMode ? '-15px' : '0px' }}
            >
              <span className="price-value--orange fw8"> {sale}</span>
              <span className="sale-button">Sale</span>
            </div>
          ),
        )}
        {!isEmpty(affiliateLinks) && !isEditMode && (
          <div className="object-sidebar__affLinks">
            <p>Affiliate Link:</p>
            {affiliateLinks?.map(link => (
              <AffiliatLink key={link.link} link={link} />
            ))}
          </div>
        )}
        {this.listItem(
          objectFields.options,
          !isEmpty(wobject?.options) && (
            <Options
              setHoveredOption={option => this.setState({ hoveredOption: option })}
              isEditMode={isEditMode}
              wobject={wobject}
            />
          ),
        )}
        {isEditMode &&
          this.listItem(
            objectFields.departments,
            !isEmpty(wobject?.departments) && (
              <Department
                isRecipe={isRecipe}
                departments={departments}
                isEditMode={isEditMode}
                history={this.props.history}
                wobject={this.props.wobject}
              />
            ),
          )}
      </>
    );
    const mapSection = () => {
      const { mapObjectsListObject, mapObjectTagsArr } = this.state;

      return (
        <React.Fragment>
          {isEditMode && (
            <div className="object-sidebar__section-title">
              <FormattedMessage id="map" defaultMessage="Map" />
            </div>
          )}
          {this.listItem(
            mapObjectTypeFields.mapObjectsList,
            mapObjectsList && (
              <div className={'mt1'}>
                <ObjectCard
                  key={mapObjectsListObject.authorPermlink}
                  wobject={mapObjectsListObject}
                  showFollow={false}
                />
              </div>
            ),
          )}
          {this.listItem(mapObjectTypeFields.mapRectangles, null)}
          {this.listItem(mapObjectTypeFields.mapDesktopView, null)}
          {this.listItem(mapObjectTypeFields.mapMobileView, null)}
          {this.listItem(
            mapObjectTypeFields.mapObjectTypes,
            !isEmpty(mapObjectTypes) && <MapObjectTypes types={mapObjectTypes} />,
          )}
          {this.listItem(
            mapObjectTypeFields.mapObjectTags,
            !isEmpty(mapObjectTagsArr) && <MapObjectTags tags={mapObjectTagsArr} />,
          )}
        </React.Fragment>
      );
    };
    const menuSection = () => {
      const buttonArray = [
        ...(this.state.menuItemsArray || []),
        ...menuLinks,
        ...menuPages,
        ...button,
        ...blogsList,
        ...formsList,
        ...newsFilters,
      ];

      const sortButtons = isEmpty(customSortInclude)
        ? buttonArray
        : customSortInclude?.reduce((acc, curr) => {
            const currentLink = buttonArray?.find(
              btn =>
                btn.body === curr ||
                btn.author_permlink === curr ||
                btn.permlink === curr ||
                btn.id === curr,
            );

            return currentLink ? [...acc, currentLink] : acc;
          }, []);
      const allMenuItems = uniq([...sortButtons, ...buttonArray]);

      if (!isEditMode && !isEmpty(customSortInclude) && !hasType(wobject, OBJECT_TYPE.LIST)) {
        return allMenuItems.map(item =>
          this.getMenuSectionLink({ id: item.id || item.name, ...item }),
        );
      }

      const objectTypeMenuTitle = ['widget', 'newsfeed'].includes(wobject.object_type);

      return (
        <React.Fragment>
          {isEditMode &&
            !isList &&
            (objectTypeMenuTitle ? (
              <div className="object-sidebar__section-title">
                <FormattedMessage id={wobject.object_type} />
              </div>
            ) : (
              <div className=" object-sidebar__section-title">
                <FormattedMessage id="menu" defaultMessage="Menu" />
              </div>
            ))}
          {!isList && (
            <div className="object-sidebar__menu-items">
              {isEditMode && this.listItem(objectFields.newsFeed, null)}
              {isEditMode && this.listItem(objectFields.widget, null)}
              {this.listItem(
                objectFields.menuItem,
                !isEmpty(menuItem) && (
                  <MenuItemButtons menuItem={allMenuItems} customSortExclude={customSortExclude} />
                ),
              )}
              {this.listItem(objectFields.sorting, null)}
            </div>
          )}
          {!objectTypeMenuTitle && isEditMode && !isList && !isRecipe && (
            <div
              className={
                this.state.showMenuLegacy
                  ? ' object-sidebar__section-title'
                  : 'object-sidebar__section-title paddingBottom'
              }
            >
              <button
                className="object-sidebar__menu-button"
                onClick={() => this.setState({ showMenuLegacy: !this.state.showMenuLegacy })}
              >
                <FormattedMessage id="menu_legacy" defaultMessage="Menu (Legacy)" />
                <Icon
                  type={this.state.showMenuLegacy ? 'up' : 'down'}
                  className="CompanyId__icon object-sidebar__section-title"
                />
              </button>
            </div>
          )}
          {((!isList && this.state.showMenuLegacy) || !isEditMode) && (
            <div className="object-sidebar__menu-items">
              <React.Fragment>
                {this.listItem(
                  TYPES_OF_MENU_ITEM.LIST,
                  !isEmpty(menuLinks) && menuLinks?.map(item => this.getMenuSectionLink(item)),
                )}
                {this.listItem(
                  TYPES_OF_MENU_ITEM.PAGE,
                  !isEmpty(menuPages) &&
                    menuPages?.map(page =>
                      this.getMenuSectionLink({ id: TYPES_OF_MENU_ITEM.PAGE, ...page }),
                    ),
                )}
                {this.listItem(
                  objectFields.button,
                  !isEmpty(button) &&
                    button?.map(btn => this.getMenuSectionLink({ id: btn.name, ...btn })),
                )}
                {this.listItem(
                  objectFields.newsFilter,
                  !isEmpty(newsFilters) &&
                    newsFilters?.map(filter =>
                      this.getMenuSectionLink({ id: filter.id || filter.name, ...filter }),
                    ),
                )}
                {this.listItem(
                  objectFields.blog,
                  !isEmpty(blogsList) &&
                    blogsList?.map(blog =>
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

    const shopSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="shop" defaultMessage="Shop" />
          </div>
        )}
        {this.listItem(
          objectFields.shopFilter,
          <DepartmentsWobject
            authorPermlink={wobject.author_permlink}
            shopFilter={wobject.shopFilter}
          />,
        )}
      </React.Fragment>
    );

    const connectSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="connect" defaultMessage="Connect" />
          </div>
        )}
        {isEditMode && this.listItem(objectFields.related, null)}
        {isEditMode && this.listItem(objectFields.addOn, null)}
        {isEditMode && this.listItem(objectFields.similar, null)}
      </React.Fragment>
    );
    const groupSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="group" defaultMessage="Group" />
          </div>
        )}
        {this.listItem(
          objectFields.groupExpertise,
          !isEmpty(groupExpertise) && (
            <ExpertiseTags
              authorPermlink={wobject.author_permlink}
              groupExpertise={groupExpertise}
            />
          ),
        )}
        {this.listItem(
          objectFields.groupFollowers,
          !isEmpty(groupFollowers) && (
            <GroupUsersLayout title={'followers_of'} list={groupFollowers} />
          ),
        )}
        {this.listItem(
          objectFields.groupFollowing,
          !isEmpty(groupFollowing) && (
            <GroupUsersLayout title={'followed_by'} list={groupFollowing} />
          ),
        )}
        {this.listItem(
          objectFields.groupLastActivity,
          !isEmpty(groupLastActivity) && <GroupLastActivity activity={groupLastActivity} />,
        )}
        {this.listItem(
          objectFields.groupAdd,
          !isEmpty(groupAdd) && <GroupUsersLayout title={'users'} list={groupAdd} />,
        )}
        {this.listItem(objectFields.groupExclude, null)}
      </React.Fragment>
    );
    const linkSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="Link" defaultMessage="Link" />
          </div>
        )}
        {this.listItem(
          objectFields.url,
          linkUrl && (
            <span className={'ObjectInfo__url-container'}>
              <ReactSVG
                className="ObjectInfo__url-image"
                src={'/images/icons/link-icon.svg'}
                wrapper={'span'}
              />{' '}
              <a href={linkUrlHref} target="_blank" rel="noopener noreferrer">
                {linkUrl}
              </a>
            </span>
          ),
        )}
      </React.Fragment>
    );
    const recipeSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="recipe" defaultMessage="recipe" />
          </div>
        )}
        {!isEditMode
          ? calories && (
              <div className="field-info ">
                <div className="CompanyId__title">
                  <FormattedMessage id="object_field_calories" defaultMessage="Calories" />:
                </div>
                <span className="field-website__title">
                  <span className="CompanyId__wordbreak-word description-field">{calories}</span>
                </span>
              </div>
            )
          : this.listItem(
              recipeFields.calories,
              calories && (
                <span className="CompanyId__wordbreak-word description-field">{calories}</span>
              ),
            )}
        {!isEditMode
          ? nutrition && (
              <div className="field-info">
                <div className="CompanyId__title">
                  <FormattedMessage id="object_field_nutrition" defaultMessage="Macros" />:
                </div>
                <span className="field-website__title">
                  <span className="CompanyId__wordbreak-word description-field">{nutrition}</span>
                </span>
              </div>
            )
          : this.listItem(
              recipeFields.nutrition,
              nutrition && (
                <span className="CompanyId__wordbreak-word description-field">{nutrition}</span>
              ),
            )}
        {!isEditMode
          ? budget && (
              <div className="field-info">
                <div className="CompanyId__title">
                  <FormattedMessage id="object_field_budget" defaultMessage="Budget" />:
                </div>
                <span className="field-website__title">
                  <span className="CompanyId__wordbreak-word">{budget}</span>
                </span>
              </div>
            )
          : this.listItem(
              recipeFields.budget,
              budget && <span className="CompanyId__wordbreak-word">{budget}</span>,
            )}{' '}
        {!isEditMode
          ? cookingTime && (
              <div className="field-info">
                <div className="CompanyId__title">
                  <FormattedMessage id="object_field_cookingTime" defaultMessage="Cooking time" />:
                </div>
                <span className="field-website__title">
                  <span className="CompanyId__wordbreak-word">{cookingTime}</span>
                </span>
              </div>
            )
          : this.listItem(
              recipeFields.cookingTime,
              cookingTime && <span className="CompanyId__wordbreak-word">{cookingTime}</span>,
            )}
        {this.listItem(
          recipeFields.recipeIngredients,
          !isEmpty(recipeIngredients) && (
            <RecipeIngredients isEditMode={isEditMode} ingredients={recipeIngredients} />
          ),
        )}
        {this.listItem(
          objectFields.departments,
          !isEmpty(wobject?.departments) && (
            <Department
              isRecipe={isRecipe}
              departments={departments}
              isEditMode={isEditMode}
              history={this.props.history}
              wobject={this.props.wobject}
            />
          ),
        )}
      </React.Fragment>
    );
    const aboutSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="about" defaultMessage="About" />
          </div>
        )}
        {!isEditMode &&
          isOptionsObjectType &&
          this.listItem(
            objectFields.description,
            description && (
              <DescriptionInfo
                isDescriptionPage={isDescriptionPage}
                description={description}
                wobjPermlink={wobject.author_permlink}
                showDescriptionBtn={showDescriptionButton}
              />
            ),
          )}
        {!isEditMode &&
          !isRecipe &&
          this.listItem(
            objectFields.departments,
            !isEmpty(wobject?.departments) && (
              <Department
                isRecipe={isRecipe}
                departments={departments}
                isEditMode={isEditMode}
                history={this.props.history}
                wobject={this.props.wobject}
              />
            ),
          )}
        {this.listItem(objectFields.name, null)}
        {isEditMode &&
          this.listItem(
            objectFields.authors,
            <div>
              {this.props.authorsArray?.map((a, i) => (
                <span key={this.authorFieldAuthorPermlink(a)}>
                  <Link
                    to={
                      this.authorFieldAuthorPermlink(a)
                        ? `/object/${this.authorFieldAuthorPermlink(a)}`
                        : `/discover-objects/${wobject.object_type}?search=${a.name}`
                    }
                  >
                    {a.name}
                  </Link>
                  <>
                    {i !== this.props.authorsArray.length - 1 && ','}
                    {'  '}
                  </>
                </span>
              ))}
            </div>,
          )}
        {isEditMode &&
          this.listItem(
            objectFields.publisher,
            publisher &&
              (publisher.authorPermlink ? (
                <ObjectCard
                  key={publisher.authorPermlink}
                  wobject={publisherObj}
                  showFollow={false}
                />
              ) : (
                <div className="flex ObjectCard__links ">
                  <ObjectAvatar item={publisher} size={34} />{' '}
                  <Link
                    className="ObjectCard__name"
                    to={`/discover-objects/${wobject.object_type}?search=${publisher.name}`}
                  >
                    {publisher.name}
                  </Link>
                </div>
              )),
          )}
        {isEditMode &&
          this.listItem(
            objectFields.description,
            description && (
              <DescriptionInfo
                isDescriptionPage={isDescriptionPage}
                description={description}
                wobjPermlink={wobject.author_permlink}
                showDescriptionBtn={showDescriptionButton}
              />
            ),
          )}
        {!isEditMode &&
          !isOptionsObjectType &&
          this.listItem(
            objectFields.description,
            description && (
              <DescriptionInfo
                isDescriptionPage={isDescriptionPage}
                description={description}
                wobjPermlink={wobject.author_permlink}
                showDescriptionBtn={showDescriptionButton}
              />
            ),
          )}
        {!isAffiliate &&
          this.listItem(
            objectFields.rating,
            has(wobject, 'rating') && (
              <RateInfo username={userName} authorPermlink={wobject.author_permlink} />
            ),
          )}
        {isAffiliate &&
          isEditMode &&
          this.listItem(
            objectFields.rating,
            has(wobject, 'rating') && (
              <RateInfo username={userName} authorPermlink={wobject.author_permlink} />
            ),
          )}
        {this.listItem(objectFields.tagCategory, this.renderTagCategories(tagCategoriesList))}
        {this.listItem(objectFields.categoryItem, null)}
        {!isOptionsObjectType &&
          this.listItem(
            objectFields.galleryItem,
            !isEmpty(pictures) && (
              <PicturesCarousel
                pics={pictures}
                albums={[...this.props.albums, this.props.relatedAlbum]}
                wobject={wobject}
              />
            ),
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
                {!isRenderMap ? (
                  <div>
                    {' '}
                    {address}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="address-link"
                    >
                      {' '}
                      <i className="iconfont icon-send PostModal__icon" />
                    </a>
                  </div>
                ) : (
                  address
                )}
                {isRenderMap && (
                  <a
                    href={
                      googleObject
                        ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
                        : `https://www.google.com/maps/search/?api=1&query=${map.latitude},${map.longitude}`
                    }
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
          phones.length > 0 && (
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
            </React.Fragment>
          ),
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
        {this.listItem(
          objectFields.link,
          has(wobject, 'link') && <SocialLinks profile={pickBy(profile, identity)} />,
        )}
        {this.listItem(objectFields.walletAddress, <WalletAddress walletAddress={walletAddress} />)}
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
                  <Icon className="iconfont icon-link text-icon link" type="calendar" />{' '}
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
            <div>
              <span className="field-website__title">
                <ReactSVG
                  className="ObjectInfo__margin-top ObjectInfo__icon"
                  src={'/images/icons/scales-icon.svg'}
                  wrapper={'span'}
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
            <div className="field-website__title">
              <ReactSVG
                className="ObjectInfo__margin-top ObjectInfo__icon"
                src={'/images/icons/dimensions-icon.svg'}
                wrapper={'span'}
              />{' '}
              <span className="CompanyId__wordbreak">
                {dimensions.length} x {dimensions.width} x {dimensions.depth} {dimensions.unit}
              </span>
            </div>
          ),
        )}
        {this.listItem(
          objectFields.manufacturer,
          manufacturer &&
            (manufacturer.authorPermlink ? (
              <ObjectCard
                key={manufacturer.authorPermlink}
                wobject={manufacturerObj}
                showFollow={false}
              />
            ) : (
              <div className="flex ObjectCard__links ">
                <ObjectAvatar item={manufacturer} size={34} />{' '}
                <Link
                  to={`/object/${wobject.author_permlink}/search/${manufacturer.name}`}
                  className="ObjectCard__name"
                >
                  {manufacturer.name}
                </Link>
              </div>
            )),
        )}
        {this.listItem(
          objectFields.brand,
          brand &&
            (brand.authorPermlink ? (
              <ObjectCard key={brand.authorPermlink} wobject={brandObj} showFollow={false} />
            ) : (
              <div className="flex ObjectCard__links ">
                <ObjectAvatar item={brand} size={34} />{' '}
                <Link
                  to={`/object/${wobject.author_permlink}/search/${getBrandName(brand)}`}
                  className="ObjectCard__name"
                >
                  {getBrandName(brand)}
                </Link>
              </div>
            )),
        )}
        {this.listItem(
          objectFields.merchant,
          merchant &&
            (merchant.authorPermlink ? (
              <ObjectCard key={merchant.authorPermlink} wobject={merchantObj} showFollow={false} />
            ) : (
              <div className="flex ObjectCard__links ">
                <ObjectAvatar item={merchant} size={34} />{' '}
                <Link
                  to={`/object/${wobject.author_permlink}/search/${merchant.name}`}
                  className="ObjectCard__name"
                >
                  {merchant.name}
                </Link>
              </div>
            )),
        )}
        {this.listItem(
          objectFields.features,
          !isEmpty(features) && (
            <ObjectFeatures
              features={features}
              isEditMode={isEditMode}
              wobjPermlink={wobject.author_permlink}
            />
          ),
        )}
        {!isEditMode ? (
          <ProductId
            isEditMode={isEditMode}
            authorPermlink={wobject.author_permlink}
            groupId={groupId}
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
                  {obj.productIdImage && (
                    <img
                      src={obj.productIdImage}
                      alt={`${obj.productIdType}: 
${obj.productId}`}
                    />
                  )}
                </div>
              </div>
            )),
          )
        )}
        {isEditMode &&
          this.listItem(
            objectFields.groupId,
            groupId &&
              groupId.map(id => (
                <div key={id} className="field-info">
                  <div className="field-website__title">
                    <span className="CompanyId__wordbreak ">{id}</span>
                  </div>
                </div>
              )),
          )}
        {this.listItem(
          objectFields.promotion,
          !isEmpty(promotion) && <PromotionInfo promotion={promotion} />,
        )}{' '}
        {this.listItem(objectFields.featured, null)}
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
              <img src={avatar} alt="avatar" />
            </div>
          ),
        )}
        {this.listItem(objectFields.title, short)}
        {this.listItem(
          objectFields.background,
          background && (
            <div className="field-background">
              <img src={background} alt="background" />
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
        {this.listItem(objectFields.delegation, null)}
      </React.Fragment>
    );

    const reviewsSection = (
      <React.Fragment>
        {isEditMode && (
          <div className="object-sidebar__section-title">
            <FormattedMessage id="reviews" defaultMessage="Reviews" />
          </div>
        )}
        {this.listItem(objectFields.pin, null)}
        {this.listItem(objectFields.remove, null)}
      </React.Fragment>
    );

    return (
      <div ref={this.carouselRef}>
        {!isEditMode && wobject.authors && (
          <div className="mb3 wordBreak">
            By{' '}
            {this.props.authorsArray?.map((a, i) => (
              <span key={this.authorFieldAuthorPermlink(a)}>
                <Link
                  to={
                    this.authorFieldAuthorPermlink(a)
                      ? `/object/${this.authorFieldAuthorPermlink(a)}`
                      : `/discover-objects/${wobject.object_type}?search=${a.name}`
                  }
                >
                  {a.name}
                </Link>

                <>
                  {i !== this.props.authorsArray.length - 1 && ','}
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
                      wobject={publisherObj}
                      showFollow={false}
                    />
                  ) : (
                    <div className="flex ObjectCard__links">
                      <ObjectAvatar item={publisher} size={34} />{' '}
                      <Link
                        className="ObjectCard__name"
                        to={`/discover-objects/${wobject.object_type}?search=${publisher.name}`}
                      >
                        {publisher.name}
                      </Link>
                    </div>
                  )),
              )}
            {isOptionsObjectType && galleryPriceOptionsSection}
            {!isHashtag && showMenuSection && menuSection()}
            {showMapSection && mapSection()}
            {showLinkSection && linkSection}
            {showGroupSection && groupSection}
            {showLRecipeSection && recipeSection}
            {aboutSection}
            {isAffiliate && (
              <AffiliateSection
                userName={userName}
                listItem={this.listItem}
                isEditMode={isEditMode}
                wobject={wobject}
              />
            )}
            {showConnectSection && connectSection}
            {shopType && shopSection}
            {accessExtend && hasType(wobject, OBJECT_TYPE.LIST) && listSection}
            {showFeedSection && reviewsSection}
            {accessExtend && settingsSection}
            {this.props.children}
            {isMobile() && <ObjectInfoExperts wobject={wobject} />}
          </div>
        )}
      </div>
    );
  }
}

export default ObjectInfo;
