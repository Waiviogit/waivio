import {
  each,
  filter,
  get,
  has,
  includes,
  isEmpty,
  isEqual,
  isNaN,
  isNil,
  map,
  omitBy,
  trimEnd,
  size,
  debounce,
} from 'lodash';
import { ReactSVG } from 'react-svg';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import moment from 'moment';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DatePicker, Form, Icon, Input, message, Rate, Select } from 'antd';
import { fieldsRules } from '../const/appendFormConstants';
import apiConfig from '../../../waivioApi/config.json';
import {
  addressFields,
  authorsFields,
  blogFields,
  buttonFields,
  linkFields,
  mapFields,
  objectFields,
  phoneFields,
  ratePercent,
  ratingFields,
  socialObjectFields,
  statusFields,
  TYPES_OF_MENU_ITEM,
  websiteFields,
  formColumnsField,
  formFormFields,
  companyIdFields,
  productIdFields,
  statusWithoutLinkList,
  errorObjectFields,
  dimensionsFields,
  weightFields,
  publisherFields,
  optionsFields,
  featuresFields,
  manufacturerFields,
  brandFields,
  merchantFields,
  pinPostFields,
  removePostFields,
  menuItemFields,
  mapObjectTypeFields,
} from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../const/objectTypes';
import { getSuitableLanguage } from '../../../store/reducers';
import LANGUAGES from '../../../common/translations/languages';
import { PRIMARY_COLOR } from '../../../common/constants/waivio';
import { getLanguageText } from '../../../common/translations';
import MapAppendObject from '../../components/Maps/MapAppendObject';
import {
  generatePermlink,
  getMenuItems,
  getObjectName,
  hasType,
  parseButtonsField,
  prepareAlbumData,
  prepareAlbumToStore,
  prepareImageToStore,
  getDefaultAlbum,
  getObjectType,
  getListItems,
  prepareBlogData,
  getBlogItems,
  getFormItems,
  getNewsFilterItems,
  getNewsFeedItems,
  sortAlphabetically,
  getSortItemListForModal,
  getObjectFieldName,
} from '../../../common/helpers/wObjectHelper';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getExposedFieldsByObjType } from '../wObjectHelper';
import { rateObject } from '../../../store/wObjectStore/wobjActions';
import SortingList from '../../components/DnDList/DnDList';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CreateObject from '../../post/CreateObjectModal/CreateObject';
import AppendFormFooter from './AppendFormFooter';
import ImageSetter from '../../components/ImageSetter/ImageSetter';
import ObjectForm from '../Form/ObjectForm';
import { getObjectInfo, getObjectsByIds } from '../../../waivioApi/ApiClient';
import {
  objectNameValidationRegExp,
  blogNameValidationRegExp,
} from '../../../common/constants/validation';
import { addAlbumToStore, addImageToAlbumStore } from '../../../store/galleryStore/galleryActions';
import { getScreenSize, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import {
  getObject,
  getObjectTagCategory,
  getRatingFields,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getVotePercent, getVotingPower } from '../../../store/settingsStore/settingsSelectors';
import { getObjectAlbums } from '../../../store/galleryStore/gallerySelectors';
import NewsFilterForm from './FormComponents/NewsFilterForm';
import { getAppendList } from '../../../store/appendStore/appendSelectors';
import { parseJSON } from '../../../common/helpers/parseJSON';
import { baseUrl } from '../../../waivioApi/routes';
import ExtendedNewsFilterForm from './FormComponents/ExtendedNewsFilterForm';
import ObjectFeaturesForm from './FormComponents/ObjectFeaturesForm';
import PublisherForm from './FormComponents/PublisherForm';
import ManufacturerForm from './FormComponents/ManufacturerForm';
import BrandForm from './FormComponents/BrandForm';
import MerchantForm from './FormComponents/MerchantForm';
import AuthorForm from './FormComponents/AuthorForm';
import SearchDepartmentAutocomplete from '../../components/SearchDepartmentAutocomplete/SearchDepartmentAutocomplete';
import ShopFilterForm from './FormComponents/ShopFilterForm';
import MenuItemForm from './FormComponents/MenuItemForm';
import RelatedForm from './FormComponents/RelatedForm';
import AddOnForm from './FormComponents/AddOnForm';
import SimilarForm from './FormComponents/SimilarForm';
import AffiliateProductIdTypesForm from './FormComponents/AffiliateProductIdTypesForm';
import AffiliateGeoAreaForm from './FormComponents/AffiliateGeoAreaForm';
import AffiliateCodeForm from './FormComponents/AffiliateCodeForm';
import { allContinents, allCountries } from './AppendModalData/affiliateData';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import MapObjectsListForm from './FormComponents/MapForms/MapObjectsListForm';
import MapDesktopViewForm from './FormComponents/MapForms/MapDesktopViewForm';
import MapObjectTypesForm from './FormComponents/MapForms/MapObjectTypesForm';

import './AppendForm.less';
import MapTagsForm from './FormComponents/MapForms/MapTagsForm';
import MapAreasForm from './FormComponents/MapForms/MapAreasForm';

@connect(
  state => ({
    wObject: getObject(state),
    updates: getAppendList(state),
    sliderMode: getVotingPower(state),
    defaultVotePercent: getVotePercent(state),
    followingList: getFollowingObjectsList(state),
    usedLocale: getSuitableLanguage(state),
    locale: getUsedLocale(state),
    ratingFields: getRatingFields(state),
    categories: getObjectTagCategory(state),
    albums: getObjectAlbums(state),
    screenSize: getScreenSize(state),
    user: getAuthenticatedUser(state),
  }),
  {
    appendObject,
    rateObject,
    addAlbum: addAlbumToStore,
    addImageToAlbum: addImageToAlbumStore,
  },
)
@Form.create()
@withRouter
@injectIntl
class AppendForm extends Component {
  static propTypes = {
    /* decorators */
    form: PropTypes.shape(),
    user: PropTypes.shape(),
    match: PropTypes.shape(),
    /* from connect */
    wObject: PropTypes.shape(),
    updates: PropTypes.arrayOf(PropTypes.shape()),
    history: PropTypes.shape().isRequired,
    sliderMode: PropTypes.bool,
    defaultVotePercent: PropTypes.number.isRequired,
    appendObject: PropTypes.func,
    rateObject: PropTypes.func,
    usedLocale: PropTypes.string,
    /* passed props */
    chosenLocale: PropTypes.string,
    currentField: PropTypes.string,
    fieldBodyContent: PropTypes.string,
    locale: PropTypes.string,
    hideModal: PropTypes.func,
    intl: PropTypes.shape(),
    post: PropTypes.shape(),
    ratingFields: PropTypes.arrayOf(PropTypes.shape({})),
    categories: PropTypes.arrayOf(PropTypes.shape()),
    selectedAlbum: PropTypes.shape(),
    albums: PropTypes.arrayOf(PropTypes.shape()),
    addImageToAlbum: PropTypes.func,
    addAlbum: PropTypes.func,
    screenSize: PropTypes.string,
  };

  static defaultProps = {
    chosenLocale: '',
    currentField: 'auto',
    usedLocale: 'en-US',
    currentUsername: '',
    hideModal: () => {},
    wObject: {},
    post: {},
    updates: [],
    form: {},
    appendObject: () => {},
    intl: {},
    user: {},
    rewardFund: {},
    rate: 1,
    sliderMode: false,
    defaultVotePercent: 100,
    followingList: [],
    rateObject: () => {},
    ratingFields: [],
    categories: [],
    selectedAlbum: null,
    albums: [],
    addImageToAlbum: () => {},
    addAlbum: () => {},
    screenSize: '',
  };

  state = {
    isOptionChangeable: false,
    isSomeValue: true,
    imageUploading: false,
    votePercent: this.props.defaultVotePercent / 100,
    voteWorth: 0,
    isValidImage: false,
    sliderVisible: false,
    loading: false,
    selectedObject: null,
    allowList: [[]],
    ignoreList: [],
    categoryItem: null,
    selectedCategory: [],
    currentTags: [],
    fileList: [],
    currentAlbum: '',
    currentImages: [],
    selectedUserBlog: [],
    selectedUsers: [],
    menuItem: [],
    typeList: [],
    tags: [],
    authoritiesList: [],
    departmentsArray: [[]],
    newRuleBlockArray: [[0]],
    formColumn: formColumnsField.middle,
    formForm: formFormFields.link,
    itemsInSortingList: null,
    newsFilterTitle: null,
    menuItemButtonType: 'standard',
    map: {},
  };

  componentDidMount = () => {
    const { currentAlbum } = this.state;
    const { albums, wObject } = this.props;

    this.getMenuItem();
    if (this.props.sliderMode && !this.state.sliderVisible) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
    }

    if (isEmpty(currentAlbum)) {
      const defaultAlbum = getDefaultAlbum(albums);

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ currentAlbum: defaultAlbum.id });
    }

    if (getObjectType(wObject) === OBJECT_TYPE.LIST) {
      const sortCustom = get(wObject, 'sortCustom', []);

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ loading: true });
      const listItems = getListItems(wObject).map(item => ({
        ...item,
        id: item.body || item.author_permlink,
        checkedItemInList: !(
          !isEmpty(sortCustom.exclude) && sortCustom.exclude.includes(item.author_permlink)
        ),
      }));

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        itemsInSortingList: getSortItemListForModal(sortCustom, listItems),
        loading: false,
      });
    }
    this.calculateVoteWorth(this.state.votePercent);
  };

  getMenuItem = async () => {
    const menuItemsArray = await this.props.wObject.menuItem?.reduce(async (acc, curr) => {
      const res = await acc;
      const itemBody = JSON.parse(curr.body);

      if (itemBody.linkToObject && !has(itemBody, 'title')) {
        const newObj = await getObjectInfo([itemBody.linkToObject], this.props.locale);

        return [
          ...res,
          { ...curr, body: JSON.stringify({ ...itemBody, title: newObj.wobjects[0].name }) },
        ];
      }

      return [...res, curr];
    }, []);

    this.setState({ menuItem: menuItemsArray });
  };

  getVote = () =>
    this.state.votePercent !== null
      ? Number(
          BigNumber(this.state.votePercent)
            .multipliedBy(100)
            .toFixed(0),
        )
      : null;

  onSubmit = formValues => {
    const { form, wObject } = this.props;
    const postData = this.getNewPostData(formValues);

    const isObjectPage = this.props.match.params.name === wObject.author_permlink;
    const isUpdatesPage = this.props.match.params[0] === 'updates';

    /* eslint-disable no-restricted-syntax */
    // eslint-disable-next-line no-unused-vars
    for (const data of postData) {
      const field = form.getFieldValue('currentField');

      this.setState({ loading: true });
      this.props
        .appendObject(data, {
          votePercent: data.votePower,
          follow: formValues.follow,
          isLike: data.isLike,
          isObjectPage,
          isUpdatesPage,
        })
        .then(res => {
          const mssg = get(res, ['value', 'message']);

          if (mssg) {
            message.error(mssg);
          } else {
            if (data.votePower !== null) {
              if (objectFields.rating === formValues.currentField && formValues.rate) {
                const { author, permlink } = res;

                this.props.rateObject(
                  author,
                  permlink,
                  wObject.author_permlink,
                  ratePercent[formValues.rate - 1],
                );
              }
            }

            message.success(
              this.props.intl.formatMessage(
                {
                  id: `added_field_to_wobject_${field}`,
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: form.getFieldValue('currentField'),
                  wobject: getObjectName(wObject),
                },
              ),
            );
            this.props.hideModal();
          }

          this.setState({ loading: false });
        })
        .catch(() => {
          message.error(
            this.props.intl.formatMessage({
              id: 'couldnt_append',
              defaultMessage: "Couldn't add the field to object.",
            }),
          );

          this.setState({ loading: false });
          this.props.hideModal();
        });
    }
  };

  onUpdateCoordinate = positionField => e => {
    const value = Number(e.target.value);

    if (!isNaN(value)) {
      this.props.form.setFieldsValue({
        [positionField]: Number(e.target.value),
      });
    }
  };

  getNewsFilterTitle = stateNewsFilterTitle => {
    const { wObject } = this.props;
    const getItem = item => get(item, 'title', 'News');
    const newsFilterTitles = get(wObject, 'newsFilter', []).map(item => getItem(item));
    const newsFilterCount = newsFilterTitles.filter(item => !isEmpty(item) && item.includes('News'))
      .length;
    const newsFilterTitle = newsFilterCount === 0 ? 'News' : `News ${newsFilterCount}`;

    return !isEmpty(stateNewsFilterTitle) ? stateNewsFilterTitle : newsFilterTitle;
  };

  getNewPostData = formValues => {
    const { wObject } = this.props;
    const { getFieldValue } = this.props.form;
    const { body, preview, currentField, currentLocale, like, follow, ...rest } = formValues;
    let fieldBody = [];
    const postData = [];

    switch (currentField) {
      case objectFields.name:
      case objectFields.authority:
      case objectFields.title:
      case objectFields.description:
      case objectFields.avatar:
      case objectFields.affiliateButton:
      case objectFields.affiliateProductIdTypes:
      case objectFields.affiliateGeoArea:
      case objectFields.background:
      case objectFields.price:
      case objectFields.categoryItem:
      case objectFields.parent:
      case mapObjectTypeFields.mapObjectsList:
      case mapObjectTypeFields.mapDesktopView:
      case mapObjectTypeFields.mapMobileView:
      case mapObjectTypeFields.mapObjectTypes:
      case mapObjectTypeFields.mapObjectTags:
      case mapObjectTypeFields.mapRectangles:
      case objectFields.publisher:
      case objectFields.related:
      case objectFields.similar:
      case objectFields.addOn:
      case objectFields.shopFilter:
      case objectFields.manufacturer:
      case objectFields.brand:
      case objectFields.merchant:
      case objectFields.productWeight:
      case objectFields.authors:
      case objectFields.workTime:
      case objectFields.email:
      case TYPES_OF_MENU_ITEM.PAGE:
      case TYPES_OF_MENU_ITEM.LIST:
      case objectFields.ageRange:
      case objectFields.printLength:
      case objectFields.language:
      case objectFields.affiliateUrlTemplate:
      case objectFields.affiliateCode:
      case objectFields.pin:
      case objectFields.remove:
      case objectFields.departments:
      case objectFields.groupId:
      case objectFields.dimensions:
      case objectFields.features:
      case objectFields.publicationDate:
      case objectFields.options: {
        fieldBody.push(rest[currentField]);
        break;
      }
      case objectFields.newsFilter: {
        const allowList = this.state.allowList.map(o => o.map(item => item.author_permlink));
        const ignoreList = map(this.state.ignoreList, o => o.author_permlink);

        fieldBody.push(JSON.stringify({ allowList, ignoreList, typeList: this.state.typeList }));
        break;
      }
      case objectFields.newsFeed: {
        const allowList = this.state.allowList.map(o => o.map(item => item.author_permlink));
        const ignoreList = map(this.state.ignoreList, o => o.author_permlink);
        const authors = this.state.selectedUsers.map(o => o);

        fieldBody.push(
          JSON.stringify({ allowList, ignoreList, typeList: this.state.typeList, authors }),
        );
        break;
      }
      case objectFields.sorting: {
        const sortingData = JSON.stringify(rest[objectFields.sorting]);

        fieldBody.push(sortingData);
        break;
      }
      case objectFields.hashtag: {
        fieldBody = rest[objectFields.hashtag];
        break;
      }
      case objectFields.phone: {
        fieldBody.push(rest[phoneFields.name] || '');
        break;
      }
      case objectFields.rating: {
        fieldBody.push(rest[objectFields.rating]);
        break;
      }
      case objectFields.tagCategory: {
        fieldBody.push(rest[objectFields.tagCategory]);
        break;
      }
      case objectFields.companyId: {
        fieldBody.push(rest[objectFields.companyId]);
        break;
      }
      case objectFields.productId: {
        fieldBody.push(rest[objectFields.productId]);
        break;
      }
      case objectFields.menuItem: {
        fieldBody.push(rest[objectFields.menuItem]);
        break;
      }
      default:
        fieldBody.push(JSON.stringify(rest));
        break;
    }

    const getAppendMsg = (author, appendValue) => {
      const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;

      switch (currentField) {
        case objectFields.name:
          return `@${author} added ${currentField} (${langReadable}):\n ${
            formValues[objectFields.objectName]
          }`;
        case objectFields.avatar:
        case objectFields.affiliateButton:
        case objectFields.background:
          return `@${author} added ${currentField} (${langReadable}):\n ![${currentField}](${appendValue})`;
        case objectFields.options:
          const image = formValues[objectFields.options]
            ? `, image: \n ![${objectFields.options}](${formValues[objectFields.options]})`
            : '';
          const position = formValues[optionsFields.position]
            ? `, ${optionsFields.position}: ${formValues[optionsFields.position]}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): ${optionsFields.category}: ${
            formValues[optionsFields.category]
          }, ${optionsFields.value}: ${formValues[optionsFields.value]}${position}${image}`;
        case mapObjectTypeFields.mapObjectTypes:
          return `@${author} added ${currentField} (${langReadable}): ${this.state.typeList
            .flat()
            .join(', ')}`;
        case mapObjectTypeFields.mapObjectTags:
          return `@${author} added ${currentField} (${langReadable}): ${this.state.allowList
            .map(o => o.map(item => item.author_permlink))
            .flat(2)
            .join(', ')}`;
        case objectFields.shopFilter: {
          const { typeList, tags, authoritiesList, departmentsArray } = this.state;
          const typeInfo = !isEmpty(typeList) ? `Type: ${typeList.flat()}` : '';
          const departmentsInfo = !isEmpty(departmentsArray[0])
            ? `${!isEmpty(typeInfo) ? ', ' : ' '}Departments: ${departmentsArray.map(dep =>
                dep.join(' and '),
              )}`
            : '';
          const tagsInfo = !isEmpty(tags)
            ? `${!isEmpty(departmentsArray[0]) ? ', ' : ' '}Tags: ${tags.map(t => t)}`
            : '';
          const authoritiesInfo = !isEmpty(authoritiesList)
            ? `${!isEmpty(tags) ? ', ' : ' '}Authorities: ${authoritiesList.map(
                user => `@${user.account}`,
              )}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): ${typeInfo}${departmentsInfo}${tagsInfo}${authoritiesInfo}`;
        }
        case mapObjectTypeFields.mapObjectsList:
          return `@${author} added ${currentField} (${langReadable}):\n ${this.state.selectedObject.author_permlink}`;
        case mapObjectTypeFields.mapDesktopView:
          const mapDesktopViewText = `\n top point: ${this.state.map.desktopMap.topPoint}, \n bottom point: ${this.state.map.desktopMap.bottomPoint}, \n center: ${this.state.map.desktopMap.center}, \n zoom: ${this.state.map.desktopMap.zoom}, `;

          return `@${author} added ${currentField} (${langReadable}): ${mapDesktopViewText}`;
        case mapObjectTypeFields.mapMobileView:
          const mapViewText = `\n top point: ${this.state.map.mobileMap.topPoint}, \n bottom point: ${this.state.map.mobileMap.bottomPoint}, \n center: ${this.state.map.mobileMap.center}, \n zoom: ${this.state.map.mobileMap.zoom}, `;

          return `@${author} added ${currentField} (${langReadable}): ${mapViewText}`;
        case mapObjectTypeFields.mapRectangles:
          const mapRectanglesInfo = this.state.map.mapCoordinates.map(
            rectangle =>
              `\n top point: ${rectangle.topPoint},\n bottom point: ${rectangle.bottomPoint}`,
          );

          return `@${author} added ${currentField} (${langReadable}): ${mapRectanglesInfo.join(
            ', ',
          )}`;
        case objectFields.related:
        case objectFields.similar:
        case objectFields.addOn:
          return `@${author} added ${currentField} (${langReadable}):\n ${this.state.selectedObject.author_permlink}`;
        case objectFields.publisher: {
          const linkInfo = this.state.selectedObject
            ? `, link: ${this.state.selectedObject.author_permlink}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): name: ${formValues[
            publisherFields.publisherName
          ] || this.state.selectedObject.name}${linkInfo}`;
        }
        case objectFields.manufacturer: {
          const linkInfo = this.state.selectedObject
            ? `, link: ${this.state.selectedObject.author_permlink}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): name: ${formValues[
            manufacturerFields.manufacturerName
          ] || this.state.selectedObject.name}${linkInfo}`;
        }
        case objectFields.brand: {
          const linkInfo = this.state.selectedObject
            ? `, link: ${this.state.selectedObject.author_permlink}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): name: ${formValues[
            brandFields.brandName
          ] || this.state.selectedObject.name}${linkInfo}`;
        }
        case objectFields.merchant: {
          const linkInfo = this.state.selectedObject
            ? `, link: ${this.state.selectedObject.author_permlink}`
            : '';

          return `@${author} added ${currentField} (${langReadable}): name: ${formValues[
            merchantFields.merchantName
          ] || this.state.selectedObject.name}${linkInfo}`;
        }
        case objectFields.productWeight:
          return `@${author} added ${currentField} (${langReadable}): ${weightFields.weight}: ${
            formValues[weightFields.weight]
          }, ${weightFields.unitOfWeight}: ${formValues[weightFields.unitOfWeight]}`;
        case objectFields.authors:
          const linkInfo = this.state.selectedObject
            ? `, link: ${this.state.selectedObject.author_permlink}`
            : '';

          return `@${author} added author (${langReadable}): name: ${formValues[
            authorsFields.name
          ] || this.state.selectedObject.name}${linkInfo} `;
        case objectFields.phone:
          return `@${author} added ${currentField}(${langReadable}):\n ${appendValue.replace(
            /[{}"]/g,
            '',
          )} ${formValues[phoneFields.number].replace(/[{}"]/g, '')}  `;
        case objectFields.companyId:
          return `@${author} added ${currentField}(${langReadable}): ${appendValue}, ${
            companyIdFields.companyIdType
          }: ${formValues[companyIdFields.companyIdType]}  `;
        case objectFields.productId:
          const imageDescription = formValues[productIdFields.productIdImage]
            ? `, ${productIdFields.productIdImage}:  \n ![${productIdFields.productIdImage}](${
                formValues[productIdFields.productIdImage]
              })`
            : '';

          return `@${author} added ${productIdFields.productIdType} (${langReadable}): ${
            formValues[productIdFields.productIdType]
          }, ${currentField}: ${formValues[productIdFields.productId]}${imageDescription}`;
        case objectFields.affiliateProductIdTypes:
          return `@${author} added ${
            objectFields.affiliateProductIdTypes
          } (${langReadable}): ${formValues[objectFields.affiliateProductIdTypes].toLowerCase()}`;
        case objectFields.affiliateGeoArea:
          return `@${author} added ${objectFields.affiliateGeoArea} (${langReadable}): ${
            { ...allCountries, ...allContinents }[formValues[objectFields.affiliateGeoArea]]
          }`;
        case objectFields.affiliateCode:
          return `@${author} added ${objectFields.affiliateCode} (${langReadable}): ${
            formValues[objectFields.affiliateCode]
          }, context: ${formValues[objectFields.affiliateContext]}`;
        case objectFields.menuItem:
          const imageMenuItem = !isEmpty(this.state.currentImages)
            ? `, image: \n ![${objectFields.menuItem}](${this.state?.currentImages[0]?.src})`
            : '';

          return `@${author} added ${objectFields.menuItem} (${langReadable}): Title: ${
            !isNil(formValues[menuItemFields.menuItemTitle])
              ? formValues[menuItemFields.menuItemTitle].trim()
              : this.state.selectedObject.name
          }, style: ${this.state.menuItemButtonType}, link: ${
            !isEmpty(this.state.selectedObject)
              ? this.state.selectedObject.author_permlink
              : formValues[menuItemFields.linkToWeb]
          }${imageMenuItem}`;

        case objectFields.dimensions:
          return `@${author} added ${currentField} (${langReadable}): ${
            dimensionsFields.length
          }: ${getFieldValue(dimensionsFields.length)}, ${dimensionsFields.width}: ${getFieldValue(
            dimensionsFields.width,
          )},${dimensionsFields.depth}: ${getFieldValue(dimensionsFields.depth)}, ${
            dimensionsFields.unitOfLength
          }: ${getFieldValue(dimensionsFields.unitOfLength)}`;
        case objectFields.features:
          return `@${author} added ${currentField} (${langReadable}): ${
            featuresFields.featuresName
          }: ${getFieldValue(featuresFields.featuresName)}, ${
            featuresFields.featuresValue
          }: ${getFieldValue(featuresFields.featuresValue)}`;
        case objectFields.pin:
          return `@${author} pinned post: author: ${
            !isEmpty(this.props.post)
              ? this.props.post.author
              : formValues[pinPostFields.postAuthor]
          }, permlink: ${
            !isEmpty(this.props.post)
              ? this.props.post.permlink
              : formValues[pinPostFields.postPermlink]
          }`;
        case objectFields.remove:
          return `@${author} removed post: author: ${
            !isEmpty(this.props.post)
              ? this.props.post.author
              : formValues[pinPostFields.postAuthor]
          }, permlink: ${
            !isEmpty(this.props.post)
              ? this.props.post.permlink
              : formValues[pinPostFields.postPermlink]
          }`;
        case objectFields.ageRange:
        case objectFields.language:
        case objectFields.affiliateUrlTemplate:
        case objectFields.departments:
        case objectFields.groupId:
          return `@${author} added ${currentField} (${langReadable}): ${appendValue}`;
        case objectFields.printLength:
          return `@${author} added ${currentField} (${langReadable}): ${appendValue} ${this.props.intl.formatMessage(
            { id: 'lowercase_pages', defaultMessage: 'pages' },
          )}`;
        case objectFields.publicationDate:
          return `@${author} added ${currentField} (${langReadable}): ${moment(
            getFieldValue(objectFields.publicationDate),
          ).format('MMMM DD, YYYY')}`;
        case TYPES_OF_MENU_ITEM.PAGE:
        case TYPES_OF_MENU_ITEM.LIST: {
          const alias = getFieldValue('menuItemName');
          const objectType =
            get(this.state.selectedObject, 'object_type') || get(this.state.selectedObject, 'type');
          const displayName = `${this.state.selectedObject.name} (type: ${objectType})`;
          const objectUrl = `${apiConfig.production.protocol}${apiConfig.production.host}/object/${appendValue}`;

          return `@${author} added ${currentField} (${langReadable}):\n[${displayName}](${objectUrl})${
            alias ? ` as "${alias}"` : ''
          }`;
        }
        case objectFields.categoryItem: {
          return `@${author} added #tag ${this.state.selectedObject.name ||
            this.state.selectedObject.default_name} (${langReadable}) into ${
            this.state.selectedCategory.body
          } category`;
        }
        case objectFields.newsFilter:
        case objectFields.newsFeed: {
          const getDotOrComma = (list, index) => (list.length - 1 === index ? '.' : ', ');
          let rulesAllow = '';
          let rulesIgnore = '';
          let rulesUser = '';

          const rulesTypes =
            this.state.typeList.length > 0
              ? this.state.typeList.reduce(
                  (acc, curr, i) => `${acc}${curr}${getDotOrComma(this.state.typeList, i)}`,
                  '\n Type list: ',
                )
              : '';
          let rulesCounter = 0;

          this.state.allowList.forEach((rule, index) => {
            if (!isEmpty(rule)) {
              rulesAllow += `\n Filter rule #${rulesCounter + 1}:`;
              rule.forEach(item => {
                rulesAllow += ` <a href="${baseUrl}/object/${item.author_permlink}">${
                  item.author_permlink
                }</a>${getDotOrComma(this.state.allowList[0], index)}`;
              });

              rulesCounter += 1;
            }
          });

          if (!isEmpty(this.state.ignoreList)) {
            rulesIgnore += `\n Ignore list:`;
            this.state.ignoreList.forEach((rule, index) => {
              rulesIgnore += ` <a href="${baseUrl}/object/${rule.author_permlink}">${
                rule.author_permlink
              }</a>${getDotOrComma(this.state.ignoreList, index)}`;
            });
          }

          if (!isEmpty(this.state.selectedUsers)) {
            rulesUser += `\n Users:`;
            this.state.selectedUsers.forEach((user, index) => {
              rulesUser += ` <a href="${baseUrl}/@${user}">@${user}</a>${getDotOrComma(
                this.state.selectedUsers,
                index,
              )}`;
            });
          }

          return `@${author} added ${this.props.intl.formatMessage({
            id: 'object_field_newsFeed',
            defaultMessage: 'News filter',
          })} ${
            currentField === objectFields.newsFeed
              ? this.state.newsFilterTitle
              : this.getNewsFilterTitle(this.state.newsFilterTitle)
          } (${langReadable}): ${rulesAllow} ${rulesIgnore} ${rulesTypes} ${rulesUser}`;
        }
        case objectFields.form:
          return `@${author} added form: ${formValues.formTitle}, link: ${formValues.formLink ||
            formValues.formWidget}, column: ${formValues.formColumn}`;

        case objectFields.widget:
          return `@${author} added form: ${formValues.formTitle}, link: ${formValues.formLink ||
            formValues.formWidget}, column: ${formValues.formColumn}`;
        default:
          return `@${author} added ${currentField} (${langReadable}):\n ${appendValue.replace(
            /[{}"]/g,
            '',
          )}`;
      }
    };

    fieldBody.forEach(bodyField => {
      const data = {};

      data.author = this.props.user.name;
      data.isLike = like;
      data.parentAuthor = wObject.author;
      data.parentPermlink = wObject.author_permlink;
      data.body = getAppendMsg(data.author, bodyField);

      data.title = '';
      let fieldsObject = {
        name: includes(TYPES_OF_MENU_ITEM, currentField) ? objectFields.listItem : currentField,
        body: currentField === objectFields.publicationDate ? bodyField : trimEnd(bodyField),
        locale: currentField === objectFields.pin ? 'en-US' : currentLocale,
      };

      if (currentField === objectFields.newsFilter) {
        fieldsObject = {
          ...fieldsObject,
          title: this.getNewsFilterTitle(this.state.newsFilterTitle)?.trim(),
        };
      }
      if (currentField === mapObjectTypeFields.mapObjectsList) {
        fieldsObject = {
          ...fieldsObject,
          body: this.state.selectedObject.author_permlink,
        };
      }
      if (currentField === mapObjectTypeFields.mapObjectTypes) {
        const mapObjectTypesBody = JSON.stringify(this.state.typeList);

        fieldsObject = {
          ...fieldsObject,
          body: mapObjectTypesBody,
        };
      }
      if (currentField === mapObjectTypeFields.mapObjectTags) {
        const mapObjectTagsBody = JSON.stringify(
          this.state.allowList.map(o => o.map(item => item.author_permlink)).flat(),
        );

        fieldsObject = {
          ...fieldsObject,
          body: mapObjectTagsBody,
        };
      }
      if (currentField === mapObjectTypeFields.mapRectangles) {
        const mapAreasBody = JSON.stringify(this.state.map.mapCoordinates);

        fieldsObject = {
          ...fieldsObject,
          body: mapAreasBody,
        };
      }
      if (currentField === mapObjectTypeFields.mapDesktopView) {
        const { topPoint, bottomPoint, center, zoom } = this.state.map.desktopMap;
        const mapDesktopViewBody = JSON.stringify({
          topPoint,
          bottomPoint,
          center,
          zoom,
        });

        fieldsObject = {
          ...fieldsObject,
          body: mapDesktopViewBody,
        };
      }
      if (currentField === mapObjectTypeFields.mapMobileView) {
        const { topPoint, bottomPoint, center, zoom } = this.state.map.mobileMap;
        const mapMobileViewBody = JSON.stringify({
          topPoint,
          bottomPoint,
          center,
          zoom,
        });

        fieldsObject = {
          ...fieldsObject,
          body: mapMobileViewBody,
        };
      }
      if (currentField === objectFields.avatar) {
        fieldsObject = {
          ...fieldsObject,
          id: wObject?.galleryAlbum?.find(album => album.body === 'Photos').id,
        };
      }
      if (currentField === objectFields.affiliateButton) {
        fieldsObject = {
          ...fieldsObject,
          body: formValues[objectFields.affiliateButton],
        };
      }
      if (currentField === objectFields.affiliateCode) {
        const affiliateCodeBody = JSON.stringify([
          formValues[objectFields.affiliateContext],
          formValues[objectFields.affiliateCode],
        ]);

        fieldsObject = {
          ...fieldsObject,
          body: affiliateCodeBody,
        };
      }
      if (currentField === objectFields.affiliateUrlTemplate) {
        fieldsObject = {
          ...fieldsObject,
          body: formValues[objectFields.affiliateUrlTemplate]
            .replace('PRODUCTID', '$productId')
            .replace('AFFILIATECODE', '$affiliateCode'),
        };
      }
      if (currentField === objectFields.newsFeed) {
        fieldsObject = {
          ...fieldsObject,
          title: this.state.newsFilterTitle,
        };
      }

      if (currentField === objectFields.phone) {
        fieldsObject = {
          ...fieldsObject,
          [phoneFields.number]: formValues[phoneFields.number],
        };
      }
      if (currentField === objectFields.pin) {
        fieldsObject = {
          ...fieldsObject,
          body: !isEmpty(this.props.post)
            ? `${this.props.post.author}/${this.props.post.permlink}`
            : `${formValues[pinPostFields.postAuthor]}/${formValues[pinPostFields.postPermlink]}`,
        };
      }
      if (currentField === objectFields.remove) {
        fieldsObject = {
          ...fieldsObject,
          body: !isEmpty(this.props.post)
            ? `${this.props.post.author}/${this.props.post.permlink}`
            : `${formValues[removePostFields.postAuthor]?.trim()}/${formValues[
                removePostFields.postPermlink
              ]?.trim()}`,
        };
      }
      if (currentField === objectFields.tagCategory) {
        fieldsObject = {
          ...fieldsObject,
          id: uuidv4(),
        };
      }
      if (currentField === objectFields.name) {
        fieldsObject = {
          ...fieldsObject,
          body: formValues[objectFields.objectName]?.trim(),
        };
      }
      if (currentField === objectFields.companyId) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            [companyIdFields.companyIdType]: formValues[companyIdFields.companyIdType]?.trim(),
            [companyIdFields.companyId]: formValues[companyIdFields.companyId]?.trim(),
          }),
        };
      }
      if ([objectFields.related, objectFields.addOn, objectFields.similar].includes(currentField)) {
        fieldsObject = {
          ...fieldsObject,
          body: this.state.selectedObject?.author_permlink,
        };
      }
      if (currentField === objectFields.publisher) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: !isEmpty(formValues[publisherFields.publisherName])
              ? formValues[publisherFields.publisherName]?.trim()
              : undefined,
            authorPermlink: this.state.selectedObject?.author_permlink,
          }),
        };
      }
      if (currentField === objectFields.shopFilter) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            type: !isEmpty(this.state.typeList) ? this.state.typeList.join() : undefined,
            departments: !isEmpty(this.state.departmentsArray[0])
              ? this.state.departmentsArray
              : undefined,
            tags: !isEmpty(this.state.tags) ? this.state.tags : undefined,
            authorities: !isEmpty(this.state.authoritiesList)
              ? this.state.authoritiesList.map(user => user.account)
              : undefined,
          }),
        };
      }
      if (currentField === objectFields.manufacturer) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: !isEmpty(formValues[manufacturerFields.manufacturerName])
              ? formValues[manufacturerFields.manufacturerName]?.trim()
              : undefined,
            authorPermlink: this.state.selectedObject?.author_permlink,
          }),
        };
      }
      if (currentField === objectFields.brand) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: !isEmpty(formValues[brandFields.brandName])
              ? formValues[brandFields.brandName]?.trim()
              : undefined,
            authorPermlink: this.state.selectedObject?.author_permlink,
          }),
        };
      }
      if (currentField === objectFields.merchant) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: !isEmpty(formValues[merchantFields.merchantName])
              ? formValues[merchantFields.merchantName]?.trim()
              : undefined,
            authorPermlink: this.state.selectedObject?.author_permlink,
          }),
        };
      }
      if (currentField === objectFields.authors) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: !isEmpty(formValues[authorsFields.name])
              ? formValues[authorsFields.name]?.trim()
              : undefined,
            authorPermlink: this.state.selectedObject?.author_permlink,
          }),
        };
      }
      if (currentField === objectFields.productWeight) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            value: formValues[weightFields.weight]?.trim(),
            unit: formValues[weightFields.unitOfWeight]?.trim(),
          }),
        };
      }
      if (currentField === objectFields.productId) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            [productIdFields.productIdType]: formValues[productIdFields.productIdType]?.trim(),
            [productIdFields.productId]: formValues[productIdFields.productId]?.trim(),
            [productIdFields.productIdImage]: formValues[productIdFields.productIdImage]?.trim(),
          }),
        };
      }
      if (currentField === objectFields.affiliateProductIdTypes) {
        fieldsObject = {
          ...fieldsObject,
          body: formValues[objectFields.affiliateProductIdTypes].toLowerCase(),
        };
      }
      if (currentField === objectFields.affiliateGeoArea) {
        fieldsObject = {
          ...fieldsObject,
          body: formValues[objectFields.affiliateGeoArea],
        };
      }
      if (currentField === objectFields.menuItem) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            title: !isNil(formValues[menuItemFields.menuItemTitle])
              ? formValues[menuItemFields.menuItemTitle].trim()
              : undefined,
            style: this.state.menuItemButtonType,
            image: !isEmpty(this.state?.currentImages)
              ? this.state?.currentImages[0]?.src
              : undefined,
            linkToObject: !isEmpty(this.state.selectedObject)
              ? this.state.selectedObject.author_permlink
              : undefined,
            objectType: !isEmpty(this.state.selectedObject)
              ? this.state.selectedObject.object_type
              : undefined,
            linkToWeb: !isEmpty(formValues[menuItemFields.linkToWeb])
              ? formValues[menuItemFields.linkToWeb]?.trim()
              : undefined,
          }),
        };
      }
      if (currentField === objectFields.options) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            [optionsFields.category]: formValues[optionsFields.category]?.trim(),
            [optionsFields.value]: formValues[optionsFields.value]?.trim(),
            [optionsFields.position]: formValues[optionsFields.position]?.trim(),
            image: formValues[objectFields.options]?.trim(),
          }),
        };
      }

      if (currentField === objectFields.categoryItem) {
        fieldsObject = {
          ...fieldsObject,
          id: this.state.selectedCategory.id,
          tagCategory: this.state.selectedCategory.body,
        };
      }
      if (currentField === objectFields.dimensions) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            length: formValues[dimensionsFields.length]?.trim(),
            width: formValues[dimensionsFields.width]?.trim(),
            depth: formValues[dimensionsFields.depth]?.trim(),
            unit: formValues[dimensionsFields.unitOfLength]?.trim(),
          }),
        };
      }
      if (currentField === objectFields.features) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            key: formValues[featuresFields.featuresName]?.trim(),
            value: formValues[featuresFields.featuresValue]?.trim(),
          }),
        };
      }
      if (currentField === objectFields.form) {
        fieldsObject = {
          ...fieldsObject,
          name: 'form',
          title: formValues.formTitle?.trim(),
          column: formValues.formColumn,
          form: formValues.formForm,
          link: formValues.formLink?.trim() || formValues.formWidget?.trim(),
        };
      }
      if (currentField === objectFields.widget) {
        fieldsObject = {
          ...fieldsObject,
          body: JSON.stringify({
            name: objectFields.widget,
            title: formValues.formTitle?.trim(),
            column: formValues.formColumn,
            type: formValues.formForm,
            content: formValues.formLink?.trim() || formValues.formWidget?.trim(),
          }),
        };
      }

      if (includes(TYPES_OF_MENU_ITEM, currentField)) {
        fieldsObject = {
          ...fieldsObject,
          type: currentField,
          alias: getFieldValue('menuItemName') || this.state.selectedObject.name,
        };
      }

      data.field = fieldsObject;

      data.permlink = `${data.author}-${Math.random()
        .toString(36)
        .substring(2)}`;
      data.lastUpdated = Date.now();

      data.wobjectName = getObjectName(wObject);
      data.votePower = this.getVote();

      postData.push(data);
    });

    return postData;
  };

  setCoordinates = ({ latLng }) => {
    this.setState({ latitude: latLng[0], longitude: latLng[1] });
    this.props.form.setFieldsValue({
      [mapFields.latitude]: latLng[0].toFixed(6),
      [mapFields.longitude]: latLng[1].toFixed(6),
    });
  };

  addNewNewsFilterLine = () => {
    const allowList = this.state.allowList;

    allowList[this.state.allowList.length] = [];
    this.setState({ allowList });
  };

  handleAddObjectToRule = (obj, rowIndex, ruleIndex) => {
    const allowList = this.state.allowList;

    if (obj && rowIndex >= 0 && allowList[rowIndex] && ruleIndex >= 0) {
      allowList[rowIndex][ruleIndex] = obj;
      this.setState({ allowList });
    }
  };

  deleteRuleItem = (rowNum, id) => {
    const allowList = this.state.allowList;

    allowList[rowNum] = filter(allowList[rowNum], o => o.author_permlink !== id);
    this.setState({ allowList });
  };
  deleteUser = user => {
    const newUsersList = this.state.selectedUsers.filter(u => u !== user);

    this.setState({ selectedUsers: newUsersList });
  };

  handleAddNewsFilterTitle = e => {
    this.setState({ newsFilterTitle: e.target.value });
  };

  handleAddObjectToIgnoreList = obj => {
    const ignoreList = this.state.ignoreList;

    ignoreList.push(obj);
    this.setState({ ignoreList });
  };

  handleMenuItemButtonStyleChange = type => {
    this.setState({ menuItemButtonType: type });
  };
  handleAddTypeToIgnoreTypeList = type =>
    this.setState(prevState => ({ typeList: [...prevState.typeList, type] }));

  handleChangeDepartmentValue = (str, index) => {
    const { departmentsArray } = this.state;
    const deps = [...departmentsArray];
    let currentArray = deps[index];

    if (!currentArray.includes(str)) {
      currentArray.push(str);
    } else {
      currentArray = currentArray.filter(dep => dep !== str);
    }
    deps.splice(index, 1, currentArray);

    this.setState({ departmentsArray: deps });
  };
  onAddDepartmentSection = () => {
    const { departmentsArray, newRuleBlockArray } = this.state;

    this.setState({ departmentsArray: [...departmentsArray, []] });
    this.setState({ newRuleBlockArray: [...newRuleBlockArray, newRuleBlockArray.length] });
  };

  handleAddTypeToShopTypeList = type =>
    this.setState(prevState => ({ typeList: [...prevState.typeList, type] }));
  handleRemoveTypeFromShopTypeList = () => this.setState({ typeList: [] });

  addUserToAuthorityList = user => {
    this.setState(prevState => ({
      authoritiesList: [...prevState.authoritiesList, user],
    }));
  };
  deleteUserFromAuthorityList = user => {
    this.setState(prevState => ({
      authoritiesList: prevState.authoritiesList.filter(d => d.account !== user.account),
    }));
  };
  handleRemoveObjectFromIgnoreTypeList = type =>
    this.setState(prevState => ({ typeList: prevState.typeList.filter(g => g !== type) }));

  handleRemoveObjectFromIgnoreList = obj =>
    this.setState(prevState => ({
      ignoreList: filter(prevState.ignoreList, o => o.author_permlink !== obj.author_permlink),
    }));
  handleSelectTag = tag => {
    this.setState(prevState => ({ tags: [...prevState.tags, tag.author_permlink] }));
  };
  handleRemoveTag = tag => {
    this.setState(prevState => ({
      tags: prevState.tags.filter(d => d !== tag),
    }));
  };

  calculateVoteWorth = (value, voteWorth) => this.setState({ votePercent: value, voteWorth });

  handleCreateAlbum = async formData => {
    const { user, wObject, hideModal, addAlbum } = this.props;
    const votePercent = this.getVote();
    const data = prepareAlbumData(formData, user.name, wObject, votePercent);
    const album = prepareAlbumToStore(data);

    this.setState({ loading: true });

    try {
      const { author } = await this.props.appendObject(data, { votePercent, isLike: data.isLike });

      await addAlbum({ ...album, author }).then(() => hideModal());
      message.success(
        this.props.intl.formatMessage(
          {
            id: 'gallery_add_album_success',
            defaultMessage: 'You successfully have created the {albumName} album',
          },
          {
            albumName: formData.galleryAlbum,
          },
        ),
      );
    } catch (err) {
      this.setState({ loading: false });
      message.error(
        this.props.intl.formatMessage({
          id: 'gallery_add_album_failure',
          defaultMessage: "Couldn't create the album.",
        }),
      );
    }
  };

  handleAddBlog = () => {
    const { user, intl, hideModal, wObject, form } = this.props;
    const formData = form.getFieldsValue();
    const votePercent = this.getVote();
    const data = prepareBlogData(formData, user.name, wObject, votePercent);

    this.setState({ loading: true });

    this.props
      .appendObject(data, { votePercent: this.getVote(), isLike: data.isLike })
      .then(() => {
        hideModal();
        this.setState({ selectedUserBlog: null, loading: false });
        message.success(
          intl.formatMessage(
            {
              id: 'add_blog_success',
              defaultMessage: 'You successfully have add the {blogName} blog',
            },
            {
              blogName: formData.blogAccount,
            },
          ),
        );
      })
      .catch(() => {
        message.error(
          intl.formatMessage({
            id: 'add_blog_failure',
            defaultMessage: "Couldn't add the blog.",
          }),
        );
        this.setState({ loading: false });
      });
  };

  handleAddPhotoToAlbum = () => {
    const { intl, hideModal } = this.props;
    const album = this.getImageAlbum();

    this.setState({ loading: true });

    this.appendImages()
      .then(() => {
        hideModal();
        this.setState({ fileList: [], uploadingList: [], loading: false, currentAlbum: '' });
        message.success(
          intl.formatMessage(
            {
              id: 'added_image_to_album',
              defaultMessage: `@{user} added a new image to album {album}<br />`,
            },
            {
              album,
            },
          ),
        );
      })
      .catch(() => {
        message.error(
          intl.formatMessage({
            id: 'couldnt_upload_image',
            defaultMessage: "Couldn't add the image to album.",
          }),
        );
        this.setState({ loading: false });
      });
  };

  appendImages = async () => {
    const { form, addImageToAlbum } = this.props;
    const { currentImages } = this.state;

    const data = this.getWobjectData();
    const images = this.props.fieldBodyContent
      ? [{ id: this.props.fieldBodyContent, src: this.props.fieldBodyContent, name: 'image' }]
      : currentImages;

    images.forEach(async image => {
      const postData = {
        ...data,
        permlink: `${data.author}-${generatePermlink()}`,
        field: this.getWobjectField(image),
        body: this.getWobjectBody(image),
      };
      const following = form.getFieldValue('follow');
      const response = await this.props.appendObject(postData, {
        votePercent: this.getVote(),
        follow: following,
        isLike: true,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response.transactionId) {
        const filteredFileList = this.state.fileList.filter(file => file.uid !== image.uid);

        this.setState({ fileList: filteredFileList }, async () => {
          const img = prepareImageToStore(postData);

          await addImageToAlbum({
            ...img,
            author: get(response, ['value', 'author']),
            id: this.props.selectedAlbum?.id || this.state.currentAlbum,
          });
        });
      }
    });
  };

  getImage = image => {
    this.setState({ currentImages: image });
  };

  getWobjectData = () => {
    const { user, wObject } = this.props;
    const data = {};

    data.author = user.name;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.title = '';
    data.lastUpdated = Date.now();
    data.wobjectName = getObjectName(wObject);
    data.votePower = this.getVote();

    return data;
  };

  getWobjectField = image => ({
    name: 'galleryItem',
    body: image.src,
    locale: this.props.form.getFieldValue('currentLocale'),
    id: this.props.selectedAlbum?.id || this.state.currentAlbum,
  });

  getImageAlbum = () => {
    const { currentAlbum } = this.state;
    const { albums, selectedAlbum } = this.props;

    if (selectedAlbum) return selectedAlbum.body;

    const album = albums.find(item => item.id === currentAlbum);

    return get(album, 'body', '');
  };

  getWobjectBody = image => {
    const { user } = this.props;
    const album = this.getImageAlbum();

    return `@${user.name} added a new image to album ${album}  \n ![${image.src}](${image.src})`;
  };

  handleSubmit = event => {
    if (event) event.preventDefault();
    const currentField = this.props.form.getFieldValue('currentField');

    if (objectFields.galleryItem === currentField) {
      this.handleAddPhotoToAlbum();
    } else if (objectFields.newsFilter === currentField || objectFields.newsFeed === currentField) {
      const { chosenLocale, usedLocale } = this.props;
      const allowList = map(this.state.allowList, rule =>
        map(rule, o => o.author_permlink),
      ).filter(sub => size(sub));
      const ignoreList = map(this.state.ignoreList, o => o.author_permlink);
      const locale = !isEmpty(chosenLocale) ? chosenLocale : usedLocale;

      if (
        !isEmpty(allowList) ||
        !isEmpty(ignoreList) ||
        !isEmpty(this.state.typeList) ||
        !isEmpty(this.state.selectedUsers)
      ) {
        this.onSubmit({ currentField, currentLocale: locale });
      } else {
        message.error(
          this.props.intl.formatMessage({
            id: 'at_least_one',
            defaultMessage: 'You should add at least one object',
          }),
        );
      }
    } else if (currentField !== objectFields.newsFilter || currentField !== objectFields.newsFeed) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        const identicalNameFields = this.props.ratingFields.reduce((acc, field) => {
          if (field.body === values.rating) {
            return field.locale === values.currentLocale ? [...acc, field] : acc;
          }

          return acc;
        }, []);

        if (!identicalNameFields.length) {
          const { form } = this.props;

          if (objectFields.galleryAlbum === currentField) {
            this.handleCreateAlbum(values);
          } else if (err || this.checkRequiredField(form, currentField)) {
            message.error(
              this.props.intl.formatMessage({
                id: 'append_validate_common_message',
                defaultMessage: 'The value already exists',
              }),
            );
          } else {
            if (objectFields.blog === currentField) this.handleAddBlog();
            this.onSubmit(values);
          }
        } else {
          message.error(
            this.props.intl.formatMessage({
              id: 'append_validate_message',
              defaultMessage: 'The rating with such name already exist in this locale',
            }),
          );
        }
      });
    }
  };

  handleChangeMapsData = (value, key) => this.setState(() => ({ [key]: +value }));

  debounceChangeMapsData = debounce(this.handleChangeMapsData, 300);

  checkRequiredField = (form, currentField) => {
    let formFields = null;

    switch (currentField) {
      case objectFields.address:
        formFields = form.getFieldsValue(Object.values(addressFields));
        break;
      case objectFields.companyId:
        formFields = form.getFieldsValue(Object.values(companyIdFields));
        break;
      case objectFields.productId:
        formFields = form.getFieldsValue(Object.values(productIdFields));
        break;
      // case objectFields.menuItem:
      //   formFields = form.getFieldsValue(Object.values(menuItemFields));
      //   break;
      case objectFields.map:
        formFields = form.getFieldsValue(Object.values(mapFields));
        break;
      case objectFields.link:
        formFields = form.getFieldsValue(Object.values(linkFields));
        break;
      case objectFields.button:
        formFields = form.getFieldsValue(Object.values(buttonFields));
        break;
      case objectFields.blog:
        formFields = form.getFieldsValue(Object.values(blogFields));
        break;
      default:
        break;
    }

    if (formFields) {
      const isSomeValueFilled = Object.values(formFields).some(f => Boolean(f));

      this.setState({ isSomeValue: isSomeValueFilled });

      return !isSomeValueFilled;
    }

    return false;
  };

  isDuplicate = (currentLocale, currentField) => {
    const { form, updates, user } = this.props;
    const currentValue = form.getFieldValue(currentField);
    const currentCategory = form.getFieldValue('tagCategory');
    const filtered = updates.filter(f => f.locale === currentLocale && f.name === currentField);

    if (
      [
        objectFields.website,
        objectFields.address,
        objectFields.map,
        objectFields.status,
        objectFields.button,
        objectFields.link,
        objectFields.companyIdType,
        objectFields.companyId,
        objectFields.authors,
        objectFields.publisher,
        objectFields.related,
        objectFields.similar,
        objectFields.addOn,
        objectFields.shopFilter,
        objectFields.manufacturer,
        objectFields.brand,
        objectFields.merchant,
        objectFields.dimensions,
        objectFields.menuItem,
        objectFields.features,
        objectFields.affiliateProductIdTypes,
        objectFields.affiliateUrlTemplate,
        objectFields.affiliateCode,
        objectFields.affiliateGeoArea,
        objectFields.productWeight,
      ].includes(currentField)
    ) {
      return filtered.some(f =>
        isEqual(this.getCurrentObjectBody(currentField), parseJSON(f.body)),
      );
    }
    if (currentField === objectFields.authority) {
      return filtered.some(f => f.body === currentValue && f.creator === user.name);
    }
    if (currentField === objectFields.productId) {
      return filtered.some(
        f =>
          this.getCurrentObjectBody(currentField).productId === parseJSON(f.body).productId &&
          this.getCurrentObjectBody(currentField).productIdType === parseJSON(f.body).productIdType,
      );
    }
    if (currentField === objectFields.options) {
      return filtered.some(
        f =>
          this.getCurrentObjectBody(currentField).category === parseJSON(f.body).category &&
          this.getCurrentObjectBody(currentField).value === parseJSON(f.body).value,
      );
    }
    if (currentField === objectFields.phone)
      return filtered.some(f => this.getCurrentObjectBody(currentField).number === f.number);
    if (currentField === objectFields.name) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.ageRange) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.printLength)
      return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.publicationDate)
      return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.language) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.pin) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.remove) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.departments)
      return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.groupId) return filtered.some(f => f.body === currentValue);
    if (currentField === objectFields.categoryItem) {
      const selectedTagCategory = filtered.filter(item => item.tagCategory === currentCategory);

      return selectedTagCategory.some(item => item.body === currentValue);
    }
    if (currentField === objectFields.blog) {
      return filtered.some(f => this.getCurrentObjectBody(currentField).blogAccount === f.body);
    }

    return filtered.some(f => f.body === currentValue);
  };

  getCurrentObjectBody = () => {
    const form = this.props.form;
    const formValues = form.getFieldsValue();
    const { currentLocale, currentField, like, follow, ...otherValues } = formValues;

    return omitBy(otherValues, isNil);
  };

  validateFieldValue = (rule, value, callback) => {
    const { intl, form } = this.props;
    const currentField = form.getFieldValue('currentField');
    const currentLocale = form.getFieldValue('currentLocale');
    const formFields = form.getFieldsValue();
    const isDuplicated = formFields[rule.field]
      ? this.isDuplicate(currentLocale, currentField)
      : false;

    if (currentField === objectFields.productWeight || currentField === objectFields.dimensions) {
      if (value > 9007199254740991) {
        callback(
          intl.formatMessage({
            id: 'value_error_weight',
            defaultMessage: "Value can't be more than 9007199254740991.",
          }),
        );
      }
    }
    if (isDuplicated) {
      const messages =
        currentField === objectFields.blog
          ? {
              id: 'append_object_blog_validation_msg',
              defaultMessage: 'This user has already been added to another blog',
            }
          : {
              id: 'append_object_validation_msg',
              defaultMessage: 'The field with this value already exists',
            };

      callback(
        intl.formatMessage({
          id: messages.id,
          defaultMessage: messages.defaultMessage,
        }),
      );
    } else {
      const fields = form.getFieldsValue();

      if (fields[currentField]) {
        const triggerValue = fields[currentField];

        if (triggerValue)
          form.setFieldsValue({
            [currentField]: triggerValue,
          });
      } else {
        const trimNestedFieldsInFormData = name => {
          if (fields[name]) {
            form.setFieldsValue({
              [name]: fields[name],
            });
          }
        };

        const trimNestedFields = innerFields => {
          each(innerFields, innerField => trimNestedFieldsInFormData(innerField));
        };

        switch (currentField) {
          case objectFields.phone:
            trimNestedFields(phoneFields);
            break;
          case objectFields.website:
            trimNestedFields(websiteFields);
            break;
          case objectFields.address:
            trimNestedFields(addressFields);
            break;
          case objectFields.button:
            trimNestedFields(buttonFields);
            break;
          case objectFields.status:
            trimNestedFields(statusFields);
            break;
          default:
            break;
        }
      }
      callback();
    }
  };

  handleChangeSorting = sortedList => {
    this.props.form.setFieldsValue({
      [objectFields.sorting]: {
        ...sortedList,
      },
    });
  };

  onLoadingImage = value => this.setState({ isLoadingImage: value });

  getImages = image => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');

    if (image.length) {
      currentField === objectFields.productId
        ? this.props.form.setFieldsValue({ [objectFields.productIdImage]: image[0].src })
        : this.props.form.setFieldsValue({ [currentField]: image[0].src });
    } else {
      currentField === objectFields.productId
        ? this.props.form.setFieldsValue({ [objectFields.productIdImage]: '' })
        : this.props.form.setFieldsValue({ [currentField]: '' });
    }
  };

  handleLikeClick = () => {
    this.setState({
      sliderVisible: this.props.sliderMode,
    });
  };

  checkHashtags = intl => (rule, value, callback) => {
    if (!value || value.length < 1 || value.length > 5) {
      callback(
        intl.formatMessage({
          id: 'hashtags_error_count',
          defaultMessage: 'You have to add 1 to 5 #tags.',
        }),
      );
    }
    value
      .map(hashtag => ({ hashtag, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(hashtag) }))
      .filter(hashtag => !hashtag.valid)
      .map(hashtag =>
        callback(
          intl.formatMessage(
            {
              id: 'topics_error_invalid_topic',
              defaultMessage: 'Hashtag {hashtag} is invalid.',
            },
            {
              hashtag: hashtag.hashtag,
            },
          ),
        ),
      );
    callback();
  };

  handleCreateObject = (createdObject, options) => {
    const currentField = this.props.form.getFieldValue('currentField');
    const timeoutCallback = () => setTimeout(e => this.handleSubmit(e), 3000);

    if (currentField === objectFields.menuItem) {
      this.props.form.setFieldsValue({
        [menuItemFields.menuItemTitle]: createdObject.name,
      });
    }
    this.props.form.setFieldsValue({
      [currentField]: createdObject.author_permlink,
      menuItemName: createdObject.name,
      locale: options.locale,
    });
    this.setState(
      { selectedObject: createdObject, votePercent: null, loading: true },
      timeoutCallback,
    );
  };

  handleSelectObject = (obj = {}) => {
    const { wObject, intl } = this.props;
    const currentField = this.props.form.getFieldValue('currentField');

    if (obj.author_permlink === wObject.author_permlink && currentField === 'parent') {
      message.error(
        intl.formatMessage({
          id: 'currentFielddont_use_current_object_for_parent',
          defaultMessage: 'You cannot use the current object as a parent',
        }),
      );
    } else if (obj.author_permlink) {
      if (currentField === objectFields.status) {
        this.props.form.setFieldsValue({
          [statusFields.link]: obj.author_permlink,
        });
      } else {
        this.props.form.setFieldsValue({
          [currentField]: obj.author_permlink,
        });
      }
      this.setState({ selectedObject: obj });
    }
  };

  handleSelectUserBlog = userBlog => {
    this.setState({ selectedUserBlog: userBlog.account });
  };
  handleSelectUsersBlog = userBlog => {
    this.setState({ selectedUsers: [...this.state.selectedUsers, userBlog.account] });
  };

  handleResetUserBlog = () => {
    this.setState({ selectedUserBlog: null });
  };

  handleSelectCategory = value => {
    const category = this.props.categories.find(item => item.body === value);

    if (!isEmpty(category.categoryItems)) {
      let currentTags = getObjectsByIds({
        authorPermlinks: category.categoryItems.map(tag => tag.name),
      });

      currentTags = currentTags.wobjects;
      this.setState({ selectedCategory: category, currentTags });
    } else {
      this.setState({ selectedCategory: category, currentTags: [] });
    }
  };

  handleSelectColumn = value => {
    this.setState({ formColumn: value });
  };

  handleSelectForm = value => {
    this.setState({ formForm: value });
  };

  getFieldRules = fieldName => {
    const { intl } = this.props;
    const rules = fieldsRules[fieldName] || [];

    return rules.map(rule => {
      if (has(rule, 'message')) {
        return {
          ...rule,
          message: intl.formatMessage(get(rule, 'message.intlId'), get(rule, 'message.intlMeta')),
        };
      }
      if (has(rule, 'validator')) {
        return { validator: this.validateFieldValue };
      }

      return rule;
    });
  };

  onObjectCardDelete = () => {
    this.setState({ selectedObject: '' });
    this.props.form.setFieldsValue({ [this.props.currentField]: '' });
  };

  renderContentValue = currentField => {
    const { loading, selectedObject, selectedCategory, fileList } = this.state;
    const { intl, wObject, categories, selectedAlbum, albums } = this.props;
    const { getFieldDecorator } = this.props.form;
    const statusTitle = this.props.form.getFieldValue(statusFields.title);
    const isBookType = wObject.object_type === 'book' || wObject.type === 'book';
    const defaultAlbum = getDefaultAlbum(albums);
    const albumInitialValue = selectedAlbum
      ? selectedAlbum.id || selectedAlbum.body
      : defaultAlbum.id || defaultAlbum.body;
    const combinedFieldValidationMsg = !this.state.isSomeValue && (
      <div className="append-combined-value__validation-msg">
        {intl.formatMessage({
          id: 'append_object_validation_message',
          defaultMessage: 'At least one field must be filled',
        })}
      </div>
    );

    switch (currentField) {
      case TYPES_OF_MENU_ITEM.PAGE:
      case TYPES_OF_MENU_ITEM.LIST: {
        const objectType =
          currentField === TYPES_OF_MENU_ITEM.LIST ? OBJECT_TYPE.LIST : OBJECT_TYPE.PAGE;
        const defaultTitle = currentField === TYPES_OF_MENU_ITEM.LIST ? 'List title' : 'Page title';
        const titleId = currentField === TYPES_OF_MENU_ITEM.LIST ? 'list_title' : 'page_title';

        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('menuItemName')(
                <Input
                  className="AppendForm__input"
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: titleId,
                    defaultMessage: defaultTitle,
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(currentField, {
                rules: this.getFieldRules(currentField),
              })(
                <SearchObjectsAutocomplete
                  className="menu-item-search"
                  itemsIdsToOmit={get(wObject, 'menuItems', []).map(f => f.author_permlink)}
                  handleSelect={this.handleSelectObject}
                  objectType={objectType}
                />,
              )}
              {selectedObject && <ObjectCardView wObject={selectedObject} />}
            </Form.Item>
            <CreateObject
              isSingleType
              withOpenModalBtn={!selectedObject}
              defaultObjectType={objectType}
              onCreateObject={this.handleCreateObject}
              openModalBtnText={intl.formatMessage({
                id: `create_new_${objectType}`,
                defaultMessage: 'Create new',
              })}
              parentObject={wObject}
            />
          </React.Fragment>
        );
      }
      case objectFields.name: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.objectName, {
              rules: this.getFieldRules(objectFields.objectName),
            })(
              <Input
                autoFocus
                className="AppendForm__input"
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'value_placeholder',
                  defaultMessage: 'Add value',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.parent: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.parent, {
              rules: this.getFieldRules(objectFields.parent),
            })(<SearchObjectsAutocomplete handleSelect={this.handleSelectObject} />)}
            {this.state.selectedObject && <ObjectCardView wObject={this.state.selectedObject} />}
          </Form.Item>
        );
      }
      case objectFields.publisher: {
        return (
          <PublisherForm
            onCreateObject={this.handleCreateObject}
            loading={loading}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.related: {
        return (
          <RelatedForm
            wobjRelated={wObject?.related}
            onCreateObject={this.handleCreateObject}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.addOn: {
        return (
          <AddOnForm
            wobjAddOn={wObject?.addOn}
            onCreateObject={this.handleCreateObject}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.similar: {
        return (
          <SimilarForm
            wobjSimilar={wObject?.similar}
            onCreateObject={this.handleCreateObject}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.manufacturer: {
        return (
          <ManufacturerForm
            loading={loading}
            onCreateObject={this.handleCreateObject}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.brand: {
        return (
          <BrandForm
            onCreateObject={this.handleCreateObject}
            loading={loading}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.merchant: {
        return (
          <MerchantForm
            onCreateObject={this.handleCreateObject}
            loading={loading}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.authors: {
        return (
          <AuthorForm
            wobjAuthors={wObject.authors}
            loading={loading}
            onCreateObject={this.handleCreateObject}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
            onObjectCardDelete={this.onObjectCardDelete}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.affiliateGeoArea: {
        return (
          <AffiliateGeoAreaForm
            getFieldDecorator={getFieldDecorator}
            getFieldRules={this.getFieldRules}
          />
        );
      }
      case objectFields.categoryItem: {
        return (
          <React.Fragment>
            <div className="ant-form-item-label label AppendForm__appendTitles">
              <FormattedMessage id="suggest4" defaultMessage="I suggest to add field" />
            </div>
            <Form.Item>
              {getFieldDecorator('tagCategory', {
                initialValue: selectedCategory ? selectedCategory.body : 'Select a category',
                rules: this.getFieldRules(objectFields.tagCategory),
              })(
                <Select disabled={loading} onChange={this.handleSelectCategory}>
                  {map(categories, category => (
                    <Select.Option key={`${category.id}`} value={category.body}>
                      {category.body}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <div className="ant-form-item-label label AppendForm__appendTitles">
              <FormattedMessage id="suggest5" defaultMessage="I suggest to add field" />
            </div>
            <Form.Item>
              {getFieldDecorator(objectFields.categoryItem, {
                rules: this.getFieldRules(objectFields.categoryItem),
              })(
                <SearchObjectsAutocomplete
                  useExtendedSearch
                  handleSelect={this.handleSelectObject}
                  objectType="hashtag"
                />,
              )}
              {this.state.selectedObject && <ObjectCardView wObject={this.state.selectedObject} />}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.background: {
        return (
          <div className="image-wrapper">
            <Form.Item>
              {getFieldDecorator(currentField, { rules: this.getFieldRules(currentField) })(
                <ImageSetter
                  autoFocus
                  onImageLoaded={this.getImages}
                  onLoadingImage={this.onLoadingImage}
                  isRequired
                  isMultiple={false}
                />,
              )}
            </Form.Item>
          </div>
        );
      }
      case objectFields.avatar: {
        return (
          <div className="image-wrapper">
            <Form.Item>
              {getFieldDecorator(currentField, { rules: this.getFieldRules(currentField) })(
                <ImageSetter
                  isEditable
                  autoFocus
                  onImageLoaded={this.getImages}
                  onLoadingImage={this.onLoadingImage}
                  isRequired
                  isMultiple={false}
                  imagesList={
                    this.props.fieldBodyContent
                      ? [{ src: this.props.fieldBodyContent, id: this.props.fieldBodyContent }]
                      : []
                  }
                />,
              )}
            </Form.Item>
          </div>
        );
      }
      case objectFields.affiliateButton: {
        return (
          <div className="image-wrapper">
            <Form.Item>
              {getFieldDecorator(currentField, { rules: this.getFieldRules(currentField) })(
                <ImageSetter
                  autoFocus
                  onImageLoaded={this.getImages}
                  onLoadingImage={this.onLoadingImage}
                  isRequired
                  isMultiple={false}
                />,
              )}
            </Form.Item>
          </div>
        );
      }
      case objectFields.title: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.title, {
              rules: this.getFieldRules('objectFields.title'),
            })(
              <Input
                autoFocus
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'description_short',
                  defaultMessage: 'Short description',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.ageRange: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.ageRange, {
              rules: this.getFieldRules(objectFields.ageRange),
            })(
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'age_range',
                  defaultMessage: 'Reading age',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.printLength: {
        return (
          <>
            <Form.Item>
              {getFieldDecorator(objectFields.printLength, {
                rules: this.getFieldRules(objectFields.printLength),
              })(
                <Input
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'print_length',
                    defaultMessage: 'Print length',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Input
                disabled
                placeholder={intl.formatMessage({ id: 'pages', defaultMessage: 'Pages' })}
              />
            </Form.Item>
          </>
        );
      }
      case objectFields.affiliateUrlTemplate: {
        return (
          <>
            <Form.Item>
              {getFieldDecorator(objectFields.affiliateUrlTemplate, {
                rules: this.getFieldRules(objectFields.affiliateUrlTemplate),
              })(
                <Input
                  autoFocus
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'url_template',
                    defaultMessage: 'URL template',
                  })}
                />,
              )}
            </Form.Item>
            <div className={'mt3'}>
              <p>
                <FormattedMessage
                  id="affiliate_url_template_info"
                  defaultMessage="URL template will be used to generate product links. URL template should begin with the website name and incorporate parameters PRODUCTID and AFFILIATECODE. URL template should be formatted as follows: http://www.affiliatesite.com?productid=PRODUCTID&affiliatecode=AFFILIATECODE."
                />
              </p>
            </div>
          </>
        );
      }
      case objectFields.affiliateCode: {
        return (
          <AffiliateCodeForm
            getFieldRules={this.getFieldRules}
            loading={loading}
            getFieldDecorator={getFieldDecorator}
          />
        );
      }
      case objectFields.language: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.language, {
              rules: this.getFieldRules(objectFields.language),
            })(
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'book_language',
                  defaultMessage: 'Book language',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.pin: {
        return (
          <Form.Item>
            {!isEmpty(this.props.post) ? (
              <>
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  value={this.props.post.author}
                  disabled
                />
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  value={this.props.post.permlink}
                  disabled
                />
              </>
            ) : (
              <>
                {getFieldDecorator(pinPostFields.postAuthor)(
                  <Input
                    autoFocus
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    disabled={loading}
                    placeholder={intl.formatMessage({
                      id: 'post_author',
                      defaultMessage: 'Post author',
                    })}
                  />,
                )}
                {getFieldDecorator(pinPostFields.postPermlink)(
                  <Input
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    disabled={loading}
                    placeholder={intl.formatMessage({
                      id: 'post_permlink',
                      defaultMessage: 'Post permlink',
                    })}
                  />,
                )}
              </>
            )}
            <p>
              <FormattedMessage
                id="pin_modal_info"
                defaultMessage="The pinned post will be displayed at the top of the object`s feed. Maximum 3 pinned posts."
              />
            </p>
          </Form.Item>
        );
      }
      case objectFields.remove: {
        return (
          <Form.Item>
            {!isEmpty(this.props.post) ? (
              <>
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  value={this.props.post.author}
                  disabled
                />
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  value={this.props.post.permlink}
                  disabled
                />
              </>
            ) : (
              <>
                {getFieldDecorator(removePostFields.postAuthor)(
                  <Input
                    autoFocus
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    disabled={loading}
                    placeholder={intl.formatMessage({
                      id: 'post_author',
                      defaultMessage: 'Post author',
                    })}
                  />,
                )}
                {getFieldDecorator(removePostFields.postPermlink)(
                  <Input
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    disabled={loading}
                    placeholder={intl.formatMessage({
                      id: 'post_permlink',
                      defaultMessage: 'Post permlink',
                    })}
                  />,
                )}
              </>
            )}
            <p>
              <FormattedMessage
                id="remove_modal_info"
                defaultMessage="The removed post won`t show up in the object`s feed."
              />
            </p>
          </Form.Item>
        );
      }
      case objectFields.departments: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.departments, {
              rules: this.getFieldRules(objectFields.departments),
            })(
              <SearchDepartmentAutocomplete
                autoFocus
                disabled={loading}
                handleSelectValue={val =>
                  this.props.form.setFieldsValue({ [this.props.currentField]: val })
                }
              />,
            )}
            <p>
              <FormattedMessage
                id="department_info"
                defaultMessage="Each product can be listed in up to 7 departments."
              />
            </p>
          </Form.Item>
        );
      }
      case objectFields.groupId: {
        return (
          <>
            <Form.Item>
              {getFieldDecorator(objectFields.groupId, {
                rules: this.getFieldRules(objectFields.groupId),
              })(
                <Input
                  autoFocus
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'object_field_groupId',
                    defaultMessage: 'Group ID',
                  })}
                />,
              )}
            </Form.Item>
            {isBookType ? (
              <FormattedMessage
                id="groupId_book_info"
                defaultMessage="Products with multiple options (format etc.) can be saved as separate objects with their own descriptions, photo galleries, prices, etc. However, if all these objects refer to the same group ID, all these options will be combined into a single presentation for the convenience of the user."
              />
            ) : (
              <FormattedMessage
                id="groupId_info"
                defaultMessage="Products with multiple options (colors, sizes, configurations, etc.) can be saved as separate objects with their own descriptions, photo galleries, prices, etc. However, if all these objects refer to the same group ID, all these options will be combined into a single presentation for the convenience of the user."
              />
            )}
          </>
        );
      }
      case objectFields.publicationDate: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.publicationDate, {
              rules: this.getFieldRules(objectFields.publicationDate),
            })(
              <DatePicker
                format={'LL'}
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                dropdownClassName="AppendForm__calendar-popup"
                placeholder={intl.formatMessage({
                  id: 'select_publication_date',
                  defaultMessage: 'Select publication date',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.features: {
        return (
          <ObjectFeaturesForm
            intl={intl}
            getFieldDecorator={getFieldDecorator}
            loading={loading}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
          />
        );
      }
      case objectFields.dimensions: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(dimensionsFields.length, {
                rules: this.getFieldRules(dimensionsFields.length),
              })(
                <Input
                  autoFocus
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'length',
                    defaultMessage: 'Length',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(dimensionsFields.width, {
                rules: this.getFieldRules(dimensionsFields.width),
              })(
                <Input
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'width',
                    defaultMessage: 'Width',
                  })}
                />,
              )}
            </Form.Item>{' '}
            <Form.Item>
              {getFieldDecorator(dimensionsFields.depth, {
                rules: this.getFieldRules(dimensionsFields.depth),
              })(
                <Input
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'depth',
                    defaultMessage: 'Depth',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(dimensionsFields.unitOfLength)(
                <Select
                  placeholder={intl.formatMessage({
                    id: 'select_unit_of_length',
                    defaultMessage: 'Select unit of length',
                  })}
                  onChange={this.handleSelectChange}
                >
                  <Select.Option value="in">
                    {intl.formatMessage({
                      id: 'inch',
                      defaultMessage: 'Inch',
                    })}
                  </Select.Option>
                  <Select.Option value="cm">
                    {intl.formatMessage({
                      id: 'centimeter',
                      defaultMessage: 'Centimeter',
                    })}
                  </Select.Option>
                  <Select.Option value="ft">
                    {intl.formatMessage({
                      id: 'foot',
                      defaultMessage: 'Foot',
                    })}
                  </Select.Option>
                  <Select.Option value="m">
                    {intl.formatMessage({
                      id: 'meter',
                      defaultMessage: 'Meter',
                    })}
                  </Select.Option>
                  <Select.Option value="mm">
                    {intl.formatMessage({
                      id: 'millimeter',
                      defaultMessage: 'Millimeter',
                    })}
                  </Select.Option>
                  <Select.Option value="μm">
                    {intl.formatMessage({
                      id: 'micrometer',
                      defaultMessage: 'Micrometer',
                    })}
                  </Select.Option>
                  <Select.Option value="nm">
                    {intl.formatMessage({
                      id: 'nanometer',
                      defaultMessage: 'Nanometer',
                    })}
                  </Select.Option>
                  <Select.Option value="mi">
                    {intl.formatMessage({
                      id: 'mile',
                      defaultMessage: 'Mile',
                    })}
                  </Select.Option>
                  <Select.Option value="nmi">
                    {intl.formatMessage({
                      id: 'nautical_mile',
                      defaultMessage: 'Nautical mile',
                    })}
                  </Select.Option>
                  <Select.Option value="yd">
                    {intl.formatMessage({
                      id: 'yard',
                      defaultMessage: 'Yard',
                    })}
                  </Select.Option>
                  <Select.Option value="km">
                    {intl.formatMessage({
                      id: 'kilometer',
                      defaultMessage: 'Kilometer',
                    })}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.workTime: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.workTime, {
              rules: this.getFieldRules(objectFields.workTime),
            })(
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'work_time',
                  defaultMessage: 'Hours',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.price: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.price, {
              rules: this.getFieldRules(objectFields.price),
            })(
              <Input.TextArea
                autoFocus
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'price_field',
                  defaultMessage: 'Price',
                })}
                autoSize={{ minRows: 4, maxRows: 100 }}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.description: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.description, {
              rules: this.getFieldRules(objectFields.description),
            })(
              <Input.TextArea
                autoFocus
                className={classNames('AppendForm__description-input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                autoSize={{ minRows: 4, maxRows: 100 }}
                placeholder={intl.formatMessage({
                  id: 'description_full',
                  defaultMessage: 'Full description',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.address: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(addressFields.address, {
                rules: this.getFieldRules(addressFields.address),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_accommodation',
                    defaultMessage: 'Accommodation',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(addressFields.street, {
                rules: this.getFieldRules(addressFields.street),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_street',
                    defaultMessage: 'Street',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(addressFields.city, {
                rules: this.getFieldRules(addressFields.city),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_city',
                    defaultMessage: 'City',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(addressFields.state, {
                rules: this.getFieldRules(addressFields.state),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'stateProvince',
                    defaultMessage: 'State/Province',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(addressFields.postalCode, {
                rules: this.getFieldRules(addressFields.postalCode),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'postalCode',
                    defaultMessage: 'Postal code',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(addressFields.country, {
                rules: this.getFieldRules(addressFields.country),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_country',
                    defaultMessage: 'Country',
                  })}
                />,
              )}
            </Form.Item>
            {combinedFieldValidationMsg}
          </React.Fragment>
        );
      }
      case objectFields.map: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(mapFields.latitude, {
                rules: this.getFieldRules(mapFields.latitude),
              })(
                <Input
                  onBlur={this.onUpdateCoordinate(mapFields.latitude)}
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_latitude',
                    defaultMessage: 'Latitude',
                  })}
                  onChange={e => this.debounceChangeMapsData(e.currentTarget.value, 'latitude')}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(mapFields.longitude, {
                rules: this.getFieldRules(mapFields.longitude),
              })(
                <Input
                  onBlur={this.onUpdateCoordinate(mapFields.longitude)}
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'location_longitude',
                    defaultMessage: 'Longitude',
                  })}
                  onChange={e => this.debounceChangeMapsData(e.currentTarget.value, 'longitude')}
                />,
              )}
            </Form.Item>
            <MapAppendObject
              setCoordinates={this.setCoordinates}
              center={[this.state.latitude, this.state.longitude]}
            />
          </React.Fragment>
        );
      }
      case objectFields.website: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(websiteFields.title, {
                rules: this.getFieldRules('websiteFields.title'),
              })(
                <Input
                  autoFocus
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'title_website_placeholder',
                    defaultMessage: 'Title',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(websiteFields.link, {
                rules: this.getFieldRules('websiteFields.link'),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'profile_website',
                    defaultMessage: 'Website',
                  })}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.companyId: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(companyIdFields.companyIdType, {
                rules: this.getFieldRules(objectFields.companyIdType),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'company_id_type',
                    defaultMessage: 'Company ID type',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'company_id_type_description',
                defaultMessage:
                  'There are many global and national databases of companies and they use different types of identification numbers, for example DUNS, UBI, Easynumber, EBR, LEI and many more.',
              })}
            </p>
            <br />
            <Form.Item>
              {getFieldDecorator(companyIdFields.companyId, {
                rules: this.getFieldRules(objectFields.companyId),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'company_id',
                    defaultMessage: 'Company ID',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'company_id_description',
                defaultMessage:
                  'Company identifiers are often alphanumeric, but there are no limitations on this text field.',
              })}
            </p>
          </React.Fragment>
        );
      }
      case objectFields.affiliateProductIdTypes: {
        return (
          <AffiliateProductIdTypesForm
            loading={loading}
            getFieldDecorator={getFieldDecorator}
            getFieldRules={this.getFieldRules}
            isSomeValue={this.state.isSomeValue}
          />
        );
      }
      case objectFields.menuItem: {
        return (
          <MenuItemForm
            getFieldDecorator={getFieldDecorator}
            loading={loading}
            getImages={this.getImage}
            onLoadingImage={this.onLoadingImage}
            handleMenuItemButtonStyleChange={this.handleMenuItemButtonStyleChange}
            selectedObject={this.state.selectedObject}
            onObjectCardDelete={this.onObjectCardDelete}
            onCreateObject={this.handleCreateObject}
            handleSelectObject={this.handleSelectObject}
            menuItemButtonType={this.state.menuItemButtonType}
            parentObject={wObject}
          />
        );
      }
      case objectFields.productId: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(productIdFields.productIdType, {
                rules: this.getFieldRules(objectFields.productIdType),
              })(
                <Input
                  autoFocus
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'product_id_type',
                    defaultMessage: 'Product ID type',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'product_id_type_text',
                defaultMessage:
                  'Some product ID types are recognized globally, such as UPC, EAN, ISBN, GTIN-8. But manufactures can use their own systems for naming products.',
              })}
            </p>
            <br />
            <Form.Item>
              {getFieldDecorator(productIdFields.productId, {
                rules: this.getFieldRules(objectFields.productId),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'product_id',
                    defaultMessage: 'Product ID',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'product_id_text',
                defaultMessage:
                  'Product identifiers are often alphanumeric, but there are no limitations on this text field.',
              })}
            </p>
            <br />
            <div className="image-wrapper">
              <Form.Item>
                {getFieldDecorator(objectFields.productIdImage, {
                  rules: this.getFieldRules(objectFields.productIdImage),
                })(
                  <ImageSetter
                    onImageLoaded={this.getImages}
                    onLoadingImage={this.onLoadingImage}
                    labeledImage={'product_id_image'}
                    isMultiple={false}
                  />,
                )}
              </Form.Item>
            </div>
            <p>
              {intl.formatMessage({
                id: 'product_id_image_text',
                defaultMessage:
                  'Visual representation of the product ID, such as a bar code, label, QR code, etc.',
              })}
            </p>
          </React.Fragment>
        );
      }
      case objectFields.options: {
        const bookType = wObject.object_type === 'book';

        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(optionsFields.category, {
                rules: this.getFieldRules(optionsFields.category),
              })(
                <Input
                  autoFocus
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'option_category',
                    defaultMessage: 'Option category',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {bookType ? (
                <FormattedMessage
                  id="options_modal_info_book1"
                  defaultMessage="Common option categories for books are Format etc."
                />
              ) : (
                <FormattedMessage
                  id="options_modal_info1"
                  defaultMessage="Common option categories for products are Color, Size, Flavor, Count, Include, etc."
                />
              )}
            </p>
            <br />
            <Form.Item>
              {getFieldDecorator(optionsFields.value, {
                rules: this.getFieldRules(optionsFields.value),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'option_value',
                    defaultMessage: 'Option value',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {intl.formatMessage({
                id: 'options_modal_info4',
                defaultMessage: 'Option value is a text field.',
              })}
            </p>
            <br />
            <Form.Item>
              {getFieldDecorator(optionsFields.position, {
                rules: this.getFieldRules(optionsFields.position),
              })(
                <Input
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'position',
                    defaultMessage: 'Position',
                  })}
                />,
              )}
            </Form.Item>
            <p>
              {bookType ? (
                <FormattedMessage
                  id="options_modal_info_book2"
                  defaultMessage='Position number indicates the order of option values within the category, e.g. the "Audiobook" option can be assigned position 2, so that it appears after "1. Hardcover", but before "3. Kindle".'
                />
              ) : (
                <FormattedMessage
                  id="options_modal_info2"
                  defaultMessage='Position number indicates the order of option values within the category, e.g. the "Small" option can be assigned position 2, so that it appears after "1. X-Small", but before "3. Medium".'
                />
              )}
            </p>
            <div className="image-wrapper">
              <Form.Item>
                {getFieldDecorator(objectFields.options, {
                  // rules: this.getFieldRules(objectFields.productIdImage),
                })(
                  <ImageSetter
                    onImageLoaded={this.getImages}
                    onLoadingImage={this.onLoadingImage}
                    labeledImage={'imageSetter_add_image'}
                    isMultiple={false}
                  />,
                )}
              </Form.Item>
            </div>
            <p>
              <FormattedMessage
                id="options_modal_info3"
                defaultMessage="Image is optional, it will be resized to fit into a square."
              />
            </p>
          </React.Fragment>
        );
      }
      case objectFields.status: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(statusFields.title, {
                rules: this.getFieldRules('buttonFields.title'),
              })(
                <Select placeholder="Select a current status" onChange={this.handleSelectChange}>
                  <Select.Option value="unavailable">
                    {intl.formatMessage({
                      id: 'unavailable',
                      defaultMessage: 'Unavailable',
                    })}
                  </Select.Option>
                  <Select.Option value="relisted">
                    {intl.formatMessage({
                      id: 'relisted',
                      defaultMessage: 'Relisted',
                    })}
                  </Select.Option>
                  <Select.Option value="nsfw">
                    {intl.formatMessage({
                      id: 'append_form_NSFW',
                      defaultMessage: 'NSFW (not safe for work)',
                    })}
                  </Select.Option>
                  <Select.Option value="flagged">
                    {intl.formatMessage({
                      id: 'append_form_flagged',
                      defaultMessage: 'Flagged',
                    })}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
            {statusTitle === 'relisted' ? (
              <Form.Item>
                {getFieldDecorator(statusFields.link, {
                  rules: this.getFieldRules('buttonFields.link'),
                })(<SearchObjectsAutocomplete handleSelect={this.handleSelectObject} />)}
                {selectedObject && <ObjectCardView wObject={selectedObject} />}
              </Form.Item>
            ) : null}
          </React.Fragment>
        );
      }
      case objectFields.productWeight: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(weightFields.weight, {
                rules: this.getFieldRules(weightFields.weight),
              })(
                <Input
                  autoFocus
                  type="number"
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'weight_placeholder',
                    defaultMessage: 'Enter weight',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(weightFields.unitOfWeight)(
                <Select
                  placeholder={intl.formatMessage({
                    id: 'select_unit_of_weight',
                    defaultMessage: 'Select unit of weight',
                  })}
                  onChange={this.handleSelectChange}
                >
                  <Select.Option value="lb">
                    {intl.formatMessage({
                      id: 'pound',
                      defaultMessage: 'Pound',
                    })}
                  </Select.Option>
                  <Select.Option value="oz">
                    {intl.formatMessage({
                      id: 'ounce',
                      defaultMessage: 'Ounce',
                    })}
                  </Select.Option>
                  <Select.Option value="st">
                    {intl.formatMessage({
                      id: 'stone',
                      defaultMessage: 'Stone',
                    })}
                  </Select.Option>
                  <Select.Option value="kg">
                    {intl.formatMessage({
                      id: 'kilogram',
                      defaultMessage: 'Kilogram',
                    })}
                  </Select.Option>
                  <Select.Option value="gm">
                    {intl.formatMessage({
                      id: 'gram',
                      defaultMessage: 'Gram',
                    })}
                  </Select.Option>
                  <Select.Option value="mg">
                    {intl.formatMessage({
                      id: 'milligram',
                      defaultMessage: 'Milligram',
                    })}
                  </Select.Option>
                  <Select.Option value="mcg">
                    {intl.formatMessage({
                      id: 'microgram',
                      defaultMessage: 'Microgram',
                    })}
                  </Select.Option>
                  <Select.Option value="t">
                    {intl.formatMessage({
                      id: 'tonne',
                      defaultMessage: 'Tonne',
                    })}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.authority: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(objectFields.authority, {
                rules: this.getFieldRules(objectFields.authority),
              })(
                <Select
                  placeholder={intl.formatMessage({
                    id: 'claim_authority',
                    defaultMessage: 'Claim authority',
                  })}
                  onChange={this.handleSelectChange}
                >
                  <Select.Option value="administrative">
                    {intl.formatMessage({
                      id: 'administrative',
                      defaultMessage: 'Administrative',
                    })}
                  </Select.Option>
                  <Select.Option value="ownership">
                    {intl.formatMessage({
                      id: 'ownership',
                      defaultMessage: 'Ownership',
                    })}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.button: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(buttonFields.title, {
                rules: this.getFieldRules('buttonTitle'),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'title_website_placeholder',
                    defaultMessage: 'Title',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(buttonFields.link, {
                rules: this.getFieldRules('buttonFields.link'),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'profile_website',
                    defaultMessage: 'Website',
                  })}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.link: {
        return (
          <React.Fragment>
            {socialObjectFields.map(profile => (
              <Form.Item key={profile.id}>
                {getFieldDecorator(`link${profile.name}`, {
                  rules: [
                    {
                      message: intl.formatMessage({
                        id: 'profile_social_profile_incorrect',
                        defaultMessage:
                          "This doesn't seem to be valid username. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
                      }),
                      pattern: /^[0-9A-Za-z-_.]+$/,
                    },
                  ],
                })(
                  <Input
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    size="large"
                    prefix={
                      profile.id === 'twitter' ? (
                        <ReactSVG
                          className={'twitter-icon'}
                          src="/images/icons/twitter-x.svg"
                          wrapper={'span'}
                        />
                      ) : (
                        <i
                          className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                          style={{
                            color: profile.color,
                          }}
                        />
                      )
                    }
                    disabled={loading}
                    placeholder={profile.id === 'twitter' ? 'X' : profile.name}
                  />,
                )}
              </Form.Item>
            ))}
            {combinedFieldValidationMsg}
          </React.Fragment>
        );
      }
      case objectFields.phone: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(phoneFields.name, { rules: this.getFieldRules('phoneName') })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'name_phone_placeholder',
                    defaultMessage: 'Phone name',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(phoneFields.number, {
                rules: this.getFieldRules(phoneFields.number),
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'number_phone_placeholder',
                    defaultMessage: 'Phone number',
                  })}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.email: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.email, {
              rules: this.getFieldRules(objectFields.email),
            })(
              <Input
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'email_placeholder',
                  defaultMessage: 'Email address',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.sorting: {
        const { itemsInSortingList, menuItem } = this.state;
        const buttons = parseButtonsField(wObject);
        const menuLinks = getMenuItems(wObject, TYPES_OF_MENU_ITEM.LIST, OBJECT_TYPE.LIST);
        const menuPages = getMenuItems(wObject, TYPES_OF_MENU_ITEM.PAGE, OBJECT_TYPE.PAGE);
        const blogs = getBlogItems(wObject);
        const forms = getFormItems(wObject);
        const wobjType = getObjectType(wObject);
        const newsFilters = getNewsFilterItems(wObject);
        const newsFeed = getNewsFeedItems(wObject);

        let listItems =
          [...menuLinks, ...menuPages].map(item => ({
            id: item.body || item.author_permlink,
            name: item.alias || getObjectName(item),
            type: item.type,
          })) || [];

        if (wobjType === OBJECT_TYPE.LIST) {
          listItems =
            (itemsInSortingList &&
              itemsInSortingList.map(item => ({
                id: item.body || item.author_permlink,
                checkedItemInList: item.checkedItemInList,
                name: item.alias || getObjectName(item),
                type: getObjectType(item),
                wobjType,
              }))) ||
            [];
        }
        if (!isEmpty(buttons)) {
          buttons.forEach(btn => {
            listItems.push({
              id: btn.permlink,
              name: btn.body.title,
              type: objectFields.button,
            });
          });
        }
        if (!isEmpty(menuItem)) {
          menuItem.forEach(item => {
            listItems.push({
              id: item.permlink,
              name: JSON.parse(item.body).title,
              type: '',
            });
          });
        }
        if (!isEmpty(newsFilters)) {
          newsFilters.forEach(item => {
            listItems.push({
              id: item.permlink,
              name: item.title || intl.formatMessage({ id: 'news', defaultMessage: 'News' }),
              type: objectFields.newsFilter,
            });
          });
        }
        if (!isEmpty(newsFeed)) {
          newsFeed.forEach(item => {
            listItems.push({
              id: item.permlink,
              name: item.title || intl.formatMessage({ id: 'news', defaultMessage: 'News' }),
              type: objectFields.newsFeed,
            });
          });
        }
        if (!isEmpty(blogs)) {
          blogs.forEach(blog => {
            listItems.push({
              id: blog.permlink,
              name: blog.blogTitle,
              type: objectFields.blog,
            });
          });
        }
        if (!isEmpty(forms)) {
          forms.forEach(form => {
            listItems.push({
              id: form.permlink,
              name: form.title,
              type: objectFields.form,
            });
          });
        }

        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(objectFields.sorting, {
                initialValue: {
                  exclude: [],
                  include: listItems.map(item => item.id),
                },
              })(
                <SortingList
                  listItems={listItems}
                  accentColor={PRIMARY_COLOR}
                  onChange={this.handleChangeSorting}
                  wobjType={wobjType}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.rating: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(objectFields.rating, {
                rules: this.getFieldRules(objectFields.rating),
              })(
                <Input
                  autoFocus
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'category_rating_placeholder',
                    defaultMessage: 'Category',
                  })}
                />,
              )}
            </Form.Item>
            <div className="ant-form-item-label label AppendForm__appendTitles">
              <FormattedMessage id="your_vote_placeholder" defaultMessage="Your vote(optional)" />
            </div>
            <Form.Item>
              {getFieldDecorator(ratingFields.rate)(
                <Rate
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  character={<Icon type="star" style={{ fontSize: '26px' }} theme="filled" />}
                  disabled={loading}
                  allowClear={false}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.newsFilter:
        return (
          <NewsFilterForm
            handleAddNewsFilterTitle={this.handleAddNewsFilterTitle}
            handleAddTypeToIgnoreTypeList={this.handleAddTypeToIgnoreTypeList}
            screenSize={this.props.screenSize}
            currObjId={get(this.props.wObject, 'author_permlink', '')}
            allowList={this.state.allowList}
            ignoreList={this.state.ignoreList}
            typeList={this.state.typeList}
            loading={this.state.loading}
            deleteRuleItem={this.deleteRuleItem}
            handleAddObjectToIgnoreList={this.handleAddObjectToIgnoreList}
            handleRemoveObjectFromIgnoreTypeList={this.handleRemoveObjectFromIgnoreTypeList}
            handleAddObjectToRule={this.handleAddObjectToRule}
            addNewNewsFilterLine={this.addNewNewsFilterLine}
            handleRemoveObjectFromIgnoreList={this.handleRemoveObjectFromIgnoreList}
          />
        );
      case mapObjectTypeFields.mapObjectsList:
        return (
          <MapObjectsListForm
            onObjectCardDelete={this.onObjectCardDelete}
            selectedObject={this.state.selectedObject}
            handleSelectObject={this.handleSelectObject}
            getFieldRules={this.getFieldRules}
            getFieldDecorator={getFieldDecorator}
          />
        );
      case mapObjectTypeFields.mapDesktopView:
        return <MapDesktopViewForm setMap={mapParams => this.setState({ map: mapParams })} />;
      case mapObjectTypeFields.mapMobileView:
        return (
          <MapDesktopViewForm mobileMap setMap={mapParams => this.setState({ map: mapParams })} />
        );
      case mapObjectTypeFields.mapObjectTypes:
        return (
          <MapObjectTypesForm
            handleAddTypeTypeList={this.handleAddTypeToIgnoreTypeList}
            handleRemoveObjectFromTypeList={this.handleRemoveObjectFromIgnoreTypeList}
            typeList={this.state.typeList}
          />
        );
      case mapObjectTypeFields.mapObjectTags:
        return (
          <MapTagsForm
            allowList={this.state.allowList}
            currObjId={get(this.props.wObject, 'author_permlink', '')}
            deleteRuleItem={this.deleteRuleItem}
            handleAddObjectToRule={this.handleAddObjectToRule}
          />
        );
      case mapObjectTypeFields.mapRectangles:
        return <MapAreasForm setMapCoordinates={mapParams => this.setState({ map: mapParams })} />;
      case objectFields.newsFeed:
        return (
          <ExtendedNewsFilterForm
            handleAddNewsFilterTitle={this.handleAddNewsFilterTitle}
            handleAddTypeToIgnoreTypeList={this.handleAddTypeToIgnoreTypeList}
            screenSize={this.props.screenSize}
            currObjId={get(this.props.wObject, 'author_permlink', '')}
            allowList={this.state.allowList}
            ignoreList={this.state.ignoreList}
            typeList={this.state.typeList}
            loading={this.state.loading}
            deleteRuleItem={this.deleteRuleItem}
            handleAddObjectToIgnoreList={this.handleAddObjectToIgnoreList}
            handleRemoveObjectFromIgnoreTypeList={this.handleRemoveObjectFromIgnoreTypeList}
            handleAddObjectToRule={this.handleAddObjectToRule}
            addNewNewsFilterLine={this.addNewNewsFilterLine}
            handleRemoveObjectFromIgnoreList={this.handleRemoveObjectFromIgnoreList}
            selectedUsers={this.state.selectedUsers}
            handleSelectUsersBlog={this.handleSelectUsersBlog}
            deleteUser={this.deleteUser}
          />
        );
      case objectFields.shopFilter: {
        return (
          <ShopFilterForm
            handleAddTypeToShopTypeList={this.handleAddTypeToShopTypeList}
            handleRemoveTypeFromShopTypeList={this.handleRemoveTypeFromShopTypeList}
            typeList={this.state.typeList}
            handleSelectTag={this.handleSelectTag}
            tags={this.state.tags}
            handleRemoveTag={this.handleRemoveTag}
            authoritiesList={this.state.authoritiesList}
            deleteUserFromAuthorityList={this.deleteUserFromAuthorityList}
            addUserToAuthorityList={this.addUserToAuthorityList}
            departmentsArray={this.state.departmentsArray}
            handleChangeDepartmentValue={this.handleChangeDepartmentValue}
            onAddDepartmentSection={this.onAddDepartmentSection}
            newRuleBlockArray={this.state.newRuleBlockArray}
          />
        );
      }
      case objectFields.tagCategory: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.tagCategory, {
              rules: this.getFieldRules(objectFields.tagCategory),
            })(
              <Input
                autoFocus
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'category_tag_category_placeholder',
                  defaultMessage: 'Tag category',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.galleryAlbum: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(objectFields.galleryAlbum, {
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'album_field_error',
                      defaultMessage: 'Album name is required',
                    }),
                  },
                  {
                    max: 100,
                    message: intl.formatMessage(
                      {
                        id: 'value_error_long',
                        defaultMessage: "Value can't be longer than 100 characters.",
                      },
                      { value: 100 },
                    ),
                  },
                  {
                    pattern: objectNameValidationRegExp,
                    message: intl.formatMessage({
                      id: 'validation_special_symbols',
                      defaultMessage: 'Please dont use special simbols like "/", "?", "%", "&"',
                    }),
                  },
                ],
              })(
                <Input
                  className="CreateAlbum__input"
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'add_new_album_placeholder',
                    defaultMessage: 'Add value',
                  })}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.galleryItem: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('id', {
                initialValue: albumInitialValue,
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Album' },
                    ),
                  },
                ],
              })(
                <Select
                  disabled={loading || selectedAlbum}
                  onSelect={value => this.setState(() => ({ currentAlbum: value }))}
                >
                  {map(albums, album => (
                    <Select.Option
                      key={`${album.id || album.weight}${album.body}`}
                      value={album.id || album.body}
                    >
                      {album.body}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('upload', {
                rules: [
                  {
                    required: !fileList.length,
                    message: intl.formatMessage({
                      id: 'upload_photo_error',
                      defaultMessage: 'You need to upload at least one image',
                    }),
                  },
                ],
              })(
                <div className="clearfix">
                  <ImageSetter
                    imagesList={
                      this.props.fieldBodyContent
                        ? [{ src: this.props.fieldBodyContent, id: this.props.fieldBodyContent }]
                        : undefined
                    }
                    autoFocus
                    onImageLoaded={this.getImage}
                    onLoadingImage={this.onLoadingImage}
                    isMultiple
                    isRequired
                  />
                </div>,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.blog: {
        const { selectedUserBlog } = this.state;

        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(blogFields.title, {
                rules: [
                  {
                    max: 17,
                    message: intl.formatMessage(
                      {
                        id: 'value_error_long',
                        defaultMessage: "Value can't be longer than 17 characters.",
                      },
                      { value: 17 },
                      {
                        pattern: blogNameValidationRegExp,
                        message: intl.formatMessage({
                          id: 'validation_special_symbols',
                          defaultMessage: 'Please dont use special simbols like "/", "?", "%", "&"',
                        }),
                      },
                    ),
                  },
                ],
              })(
                <Input
                  className={classNames('AppendForm__input', {
                    'validation-error': !this.state.isSomeValue,
                  })}
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'blog_title',
                    defaultMessage: 'Blog title',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(blogFields.account, {
                rules: this.getFieldRules(objectFields.blog),
              })(
                <SearchUsersAutocomplete
                  handleSelect={this.handleSelectUserBlog}
                  disabled={!isEmpty(selectedUserBlog)}
                />,
              )}
              {!isEmpty(selectedUserBlog) && (
                <SelectUserForAutocomplete
                  account={selectedUserBlog}
                  resetUser={this.handleResetUserBlog}
                />
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.form: {
        const { formColumn, formForm } = this.state;

        return (
          <ObjectForm
            formColumn={formColumn}
            formForm={formForm}
            form={this.props.form}
            intl={intl}
            loading={loading}
            handleSelectColumn={this.handleSelectColumn}
            handleSelectForm={this.handleSelectForm}
            getFieldRules={this.getFieldRules}
          />
        );
      }
      case objectFields.widget: {
        const { formColumn, formForm } = this.state;

        return (
          <ObjectForm
            formColumn={formColumn}
            formForm={formForm}
            form={this.props.form}
            intl={intl}
            loading={loading}
            handleSelectColumn={this.handleSelectColumn}
            handleSelectForm={this.handleSelectForm}
            getFieldRules={this.getFieldRules}
          />
        );
      }
      default:
        return null;
    }
  };
  isSubmitButtonDisabled = () => {
    const { getFieldValue } = this.props.form;
    const { currentField } = this.props;

    switch (currentField) {
      case objectFields.website:
        return (
          isEmpty(getFieldValue(websiteFields.link)) || isEmpty(getFieldValue(websiteFields.title))
        );
      case objectFields.authors:
        return isEmpty(getFieldValue(authorsFields.name)) && !this.state.selectedObject;
      case mapObjectTypeFields.mapObjectsList:
        return isEmpty(this.state.selectedObject);
      case mapObjectTypeFields.mapDesktopView:
      case mapObjectTypeFields.mapRectangles:
      case mapObjectTypeFields.mapMobileView:
        return isEmpty(this.state.map);
      case mapObjectTypeFields.mapObjectTypes:
        return isEmpty(this.state.typeList);
      case mapObjectTypeFields.mapObjectTags:
        return isEmpty(this.state.allowList);
      case objectFields.productWeight:
        return (
          isEmpty(getFieldValue(weightFields.weight)) ||
          isEmpty(getFieldValue(weightFields.unitOfWeight))
        );
      case objectFields.publisher:
        return isEmpty(getFieldValue(publisherFields.publisherName)) && !this.state.selectedObject;
      case objectFields.related:
      case objectFields.similar:
      case objectFields.addOn:
        return isEmpty(this.state.selectedObject);
      case objectFields.manufacturer:
        return (
          isEmpty(getFieldValue(manufacturerFields.manufacturerName)) && !this.state.selectedObject
        );
      case objectFields.brand:
        return isEmpty(getFieldValue(brandFields.brandName)) && !this.state.selectedObject;
      case objectFields.merchant:
        return isEmpty(getFieldValue(merchantFields.merchantName)) && !this.state.selectedObject;
      case objectFields.dimensions:
        return (
          isEmpty(getFieldValue(dimensionsFields.length)) ||
          isEmpty(getFieldValue(dimensionsFields.width)) ||
          isEmpty(getFieldValue(dimensionsFields.depth)) ||
          isEmpty(getFieldValue(dimensionsFields.unitOfLength))
        );
      case objectFields.features:
        return (
          isEmpty(getFieldValue(featuresFields.featuresName)) ||
          isEmpty(getFieldValue(featuresFields.featuresValue))
        );
      case objectFields.options:
        return (
          isEmpty(getFieldValue(optionsFields.value)) ||
          isEmpty(getFieldValue(optionsFields.category))
        );
      case objectFields.map:
        return (
          getFieldValue(mapFields.latitude) === undefined ||
          getFieldValue(mapFields.longitude) === undefined ||
          getFieldValue(mapFields.latitude) === '' ||
          getFieldValue(mapFields.longitude) === ''
        );
      case objectFields.phone:
        return isEmpty(getFieldValue(phoneFields.number));
      case objectFields.galleryItem:
        return this.state.currentImages.length < 1;
      case objectFields.blog:
        return (
          isEmpty(getFieldValue(blogFields.title)) || isEmpty(getFieldValue(blogFields.account))
        );
      case objectFields.companyId:
        return (
          isEmpty(getFieldValue(companyIdFields.companyIdType)) ||
          isEmpty(getFieldValue(companyIdFields.companyId))
        );
      case objectFields.productId:
        return (
          isEmpty(getFieldValue(productIdFields.productIdType)) ||
          isEmpty(getFieldValue(productIdFields.productId))
        );
      case objectFields.menuItem:
        if (['image', 'icon'].includes(this.state.menuItemButtonType)) {
          return (
            (isEmpty(getFieldValue(menuItemFields.menuItemTitle)) &&
              isEmpty(this.state.selectedObject)) ||
            isEmpty(this.state.menuItemButtonType) ||
            isEmpty(this.state.currentImages) ||
            (isEmpty(getFieldValue(menuItemFields.linkToWeb)) && isEmpty(this.state.selectedObject))
          );
        }

        return (
          (isEmpty(getFieldValue(menuItemFields.menuItemTitle)) &&
            isEmpty(this.state.selectedObject)) ||
          isEmpty(this.state.menuItemButtonType) ||
          (isEmpty(getFieldValue(menuItemFields.linkToWeb)) && isEmpty(this.state.selectedObject))
        );
      case objectFields.pin:
        if (isEmpty(this.props.post)) {
          return (
            isEmpty(getFieldValue(pinPostFields.postPermlink)) ||
            isEmpty(getFieldValue(pinPostFields.postAuthor))
          );
        }

        return false;
      case objectFields.remove:
        if (isEmpty(this.props.post)) {
          return (
            isEmpty(getFieldValue(removePostFields.postPermlink)) ||
            isEmpty(getFieldValue(removePostFields.postAuthor))
          );
        }

        return false;
      case objectFields.form:
      case objectFields.widget:
        return (
          isEmpty(getFieldValue('formTitle')) ||
          (isEmpty(getFieldValue('formLink')) && isEmpty(getFieldValue('formWidget')))
        );
      case objectFields.button:
        return (
          isEmpty(getFieldValue(buttonFields.link)) || isEmpty(getFieldValue(buttonFields.title))
        );
      case objectFields.name:
        return isEmpty(getFieldValue(objectFields.objectName));
      case objectFields.affiliateCode:
        return isEmpty(getFieldValue(objectFields.affiliateCode));
      case objectFields.status:
        return (
          isEmpty(getFieldValue(statusFields.title)) ||
          (!statusWithoutLinkList.includes(getFieldValue(statusFields.title)) &&
            isEmpty(getFieldValue(statusFields.link)))
        );
      case objectFields.link:
        return (
          isEmpty(getFieldValue('linkFacebook')) &&
          isEmpty(getFieldValue('linkTwitter')) &&
          isEmpty(getFieldValue('linkYouTube')) &&
          isEmpty(getFieldValue('linkInstagram')) &&
          isEmpty(getFieldValue('linkGitHub'))
        );
      case objectFields.address:
        return (
          isEmpty(getFieldValue(addressFields.city)) &&
          isEmpty(getFieldValue(addressFields.address)) &&
          isEmpty(getFieldValue(addressFields.state)) &&
          isEmpty(getFieldValue(addressFields.country)) &&
          isEmpty(getFieldValue(addressFields.postalCode)) &&
          isEmpty(getFieldValue(addressFields.street)) &&
          isEmpty(getFieldValue(addressFields.accommodation))
        );
      case objectFields.newsFilter:
        return (
          isEmpty(this.state.newsFilterTitle) ||
          (this.state.allowList[0].length < 1 &&
            this.state.ignoreList.length < 1 &&
            this.state.typeList.length < 1)
        );
      case objectFields.newsFeed:
        return (
          isEmpty(this.state.newsFilterTitle) ||
          (this.state.allowList[0].length < 1 &&
            this.state.ignoreList.length < 1 &&
            this.state.selectedUsers.length < 1 &&
            this.state.typeList.length < 1)
        );
      case objectFields.sorting:
      case objectFields.shopFilter:
        return false;

      default:
        return isEmpty(getFieldValue(currentField));
    }
  };

  render() {
    const { chosenLocale, usedLocale, currentField, form, wObject } = this.props;
    const r = form.getFieldsError(errorObjectFields[currentField]);
    const isError = errorObjectFields[currentField]?.some(i => r[i]);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading } = this.state;
    const isCustomSortingList =
      hasType(wObject, OBJECT_TYPE.LIST) &&
      form.getFieldValue('currentField') === objectFields.sorting;

    const languageOptions = LANGUAGES.map(lang => (
      <Select.Option key={lang.id} value={lang.id}>
        {getLanguageText(lang)}
      </Select.Option>
    ));

    const fieldOptions = getExposedFieldsByObjType(wObject)
      .map(option => (
        <Select.Option key={option} value={option} className="Topnav__search-autocomplete">
          {getObjectFieldName(option, wObject, this.props.intl)}
        </Select.Option>
      ))
      .sort((a, b) => sortAlphabetically(a.props.children, b.props.children));

    const disabledSelect = currentField !== 'auto';

    const changeValue = v => {
      this.setState({ isOptionChangeable: true });
      this.props.history.push(`/object/${wObject.author_permlink}/updates/${v}`);
    };

    return (
      <Form className="AppendForm" layout="vertical" onSubmit={this.handleSubmit}>
        <div className="ant-form-item-label label AppendForm__appendTitles">
          <FormattedMessage id="suggest1" defaultMessage="I suggest to add field" />
        </div>
        <Form.Item>
          {getFieldDecorator('currentField', {
            initialValue: currentField,
          })(
            <Select
              onChange={changeValue}
              disabled={disabledSelect && !this.state.isOptionChangeable}
              style={{ width: '100%' }}
              dropdownClassName="AppendForm__drop-down"
            >
              <Select.Option disabled key="auto" value="auto">
                {this.props.intl.formatMessage({
                  id: 'select_field',
                  defaultMessage: 'Select your field',
                })}
              </Select.Option>
              {fieldOptions}
            </Select>,
          )}
        </Form.Item>

        <div
          className={classNames('ant-form-item-label AppendForm__appendTitles', {
            AppendForm__hidden: isCustomSortingList,
          })}
        >
          <FormattedMessage id="suggest2" defaultMessage="With language" />
        </div>
        <Form.Item>
          {getFieldDecorator('currentLocale', {
            rules: this.getFieldRules('currentLocale'),
            initialValue: chosenLocale || usedLocale,
          })(
            <Select
              className={classNames({ AppendForm__hidden: isCustomSortingList })}
              disabled={loading}
              style={{ width: '100%' }}
              dropdownClassName="AppendForm__drop-down"
            >
              {languageOptions}
            </Select>,
          )}
        </Form.Item>
        {this.renderContentValue(getFieldValue('currentField'))}
        <AppendFormFooter
          loading={loading}
          calcVote={this.calculateVoteWorth}
          form={form}
          handleSubmit={this.handleSubmit}
          votePercent={this.state.votePercent}
          voteWorth={this.state.voteWorth}
          selectWobj={this.props.wObject}
          disabled={this.isSubmitButtonDisabled() || isError}
        />
      </Form>
    );
  }
}

export default AppendForm;
