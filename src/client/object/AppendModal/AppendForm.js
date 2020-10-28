import {
  each,
  filter,
  get,
  has,
  includes,
  isEmpty,
  isNaN,
  map,
  trimStart,
  isEqual,
  omitBy,
  isNil,
  size,
} from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, message, Rate, Select } from 'antd';
import { fieldsRules } from '../const/appendFormConstants';
import apiConfig from '../../../waivioApi/config.json';
import {
  addressFields,
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
} from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../const/objectTypes';
import {
  getFollowingObjectsList,
  getObject,
  getRate,
  getRatingFields,
  getRewardFund,
  getSuitableLanguage,
  getVotePercent,
  getVotingPower,
  getObjectTagCategory,
  getObjectAlbums,
} from '../../reducers';
import LANGUAGES from '../../translations/languages';
import { PRIMARY_COLOR } from '../../../common/constants/waivio';
import { getLanguageText } from '../../translations';
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
} from '../../helpers/wObjectHelper';
import { appendObject } from '../appendActions';
import withEditor from '../../components/Editor/withEditor';
import { getVoteValue } from '../../helpers/user';
import { getExposedFieldsByObjType, getListItems } from '../wObjectHelper';
import { rateObject } from '../wobjActions';
import SortingList from '../../components/DnDList/DnDList';
import DnDListItem from '../../components/DnDList/DnDListItem';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getNewsFilterLayout } from '../NewsFilter/newsFilterHelper';
import CreateObject from '../../post/CreateObjectModal/CreateObject';
import { baseUrl } from '../../../waivioApi/routes';
import AppendFormFooter from './AppendFormFooter';
import ImageSetter from '../../components/ImageSetter/ImageSetter';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import { objectNameValidationRegExp } from '../../../common/constants/validation';
import { addAlbumToStore, addImageToAlbumStore } from '../ObjectGallery/galleryActions';

import './AppendForm.less';

@connect(
  state => ({
    wObject: getObject(state),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    sliderMode: getVotingPower(state),
    defaultVotePercent: getVotePercent(state),
    followingList: getFollowingObjectsList(state),
    usedLocale: getSuitableLanguage(state),
    ratingFields: getRatingFields(state),
    categories: getObjectTagCategory(state),
    albums: getObjectAlbums(state),
  }),
  { appendObject, rateObject, addImageToAlbumStore },
)
@Form.create()
@withEditor
@injectIntl
export default class AppendForm extends Component {
  static propTypes = {
    /* decorators */
    form: PropTypes.shape(),
    user: PropTypes.shape(),
    /* from connect */
    wObject: PropTypes.shape(),
    rewardFund: PropTypes.shape(),
    rate: PropTypes.number,
    sliderMode: PropTypes.bool,
    defaultVotePercent: PropTypes.number.isRequired,
    appendObject: PropTypes.func,
    rateObject: PropTypes.func,
    usedLocale: PropTypes.string,
    /* passed props */
    chosenLocale: PropTypes.string,
    currentField: PropTypes.string,
    hideModal: PropTypes.func,
    intl: PropTypes.shape(),
    ratingFields: PropTypes.arrayOf(PropTypes.shape({})),
    categories: PropTypes.arrayOf(PropTypes.shape()),
    selectedAlbum: PropTypes.shape(),
    albums: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    chosenLocale: '',
    currentField: 'auto',
    usedLocale: 'en-US',
    currentUsername: '',
    hideModal: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
    wObject: {},
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
  };

  state = {
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
    currentAlbum: [],
    currentImages: [],
  };

  componentDidMount = () => {
    if (this.props.sliderMode) {
      if (!this.state.sliderVisible) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
    this.calculateVoteWorth(this.state.votePercent);
  };

  onSubmit = formValues => {
    const { form, wObject } = this.props;
    const postData = this.getNewPostData(formValues);
    const listItem = getListItems(wObject, { uniq: true, isMappedToClientWobject: true }).map(
      item => item.id,
    );
    /* eslint-disable no-restricted-syntax */
    for (const data of postData) {
      let equalBody;

      if (data.field.name === objectFields.sorting) {
        equalBody = isEqual(listItem, JSON.parse(data.field.body));
        if (wObject.sortCustom.length && equalBody)
          message.error(
            this.props.intl.formatMessage(
              {
                id: 'no_changes',
                defaultMessage: `There are no changes to save`,
              },
              {
                field: form.getFieldValue('currentField'),
                wobject: getObjectName(wObject),
              },
            ),
          );
      }
      const field = form.getFieldValue('currentField');

      if (data.field.name !== objectFields.sorting || !wObject.sortCustom.length || !equalBody) {
        this.setState({ loading: true });
        this.props
          .appendObject(data, { votePower: data.votePower, follow: formValues.follow })
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
              if (data.field.name === objectFields.button) {
                message.success(
                  this.props.intl.formatMessage(
                    {
                      id: 'added_field_to_wobject_button',
                      defaultMessage: `You successfully have added the button field to {wobject} object <br /> {url}`,
                    },
                    {
                      wobject: getObjectName(wObject),
                      url: formValues.link,
                    },
                  ),
                );
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
          });
      }
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
      case objectFields.background:
      case objectFields.price:
      case objectFields.categoryItem:
      case objectFields.parent:
      case objectFields.workTime:
      case objectFields.email:
      case TYPES_OF_MENU_ITEM.PAGE:
      case TYPES_OF_MENU_ITEM.LIST: {
        fieldBody.push(rest[currentField]);
        break;
      }
      case objectFields.newsFilter: {
        const allowList = this.state.allowList.map(o => o.map(item => item.author_permlink));
        const ignoreList = map(this.state.ignoreList, o => o.author_permlink);
        fieldBody.push(JSON.stringify({ allowList, ignoreList }));
        break;
      }
      case objectFields.sorting: {
        const sortingData = JSON.stringify(rest[objectFields.sorting].split(','));
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
      default:
        fieldBody.push(JSON.stringify(rest));
        break;
    }

    const getAppendMsg = (author, appendValue) => {
      const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;
      switch (currentField) {
        case objectFields.avatar:
        case objectFields.background:
          return `@${author} added ${currentField} (${langReadable}):\n ![${currentField}](${appendValue})`;
        case objectFields.phone:
          return `@${author} added ${currentField}(${langReadable}):\n ${appendValue.replace(
            /[{}"]/g,
            '',
          )} ${formValues[phoneFields.number].replace(/[{}"]/g, '')}  `;
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
          return `@${author} added #tag ${this.state.selectedObject.name} (${langReadable}) into ${this.state.selectedCategory.body} category`;
        }
        case objectFields.newsFilter: {
          let rulesAllow = `\n`;
          let rulesIgnore = '\n';
          let rulesCounter = 0;

          this.state.allowList.forEach(rule => {
            if (!isEmpty(rule)) {
              rulesAllow += `\n Filter rule #${rulesCounter + 1}:`;
              rule.forEach(item => {
                rulesAllow += ` <a href="${baseUrl}/object/${item.author_permlink}">${item.author_permlink}</a>,`;
              });

              rulesCounter += 1;
            }
          });

          this.state.ignoreList.forEach((rule, index) => {
            if (!isEmpty(rule)) {
              rulesIgnore = '\nIgnore list:';
              const dotOrComma = this.state.ignoreList.length - 1 === index ? '.' : ',';
              rulesIgnore += ` <a href="${baseUrl}/object/${rule.author_permlink}">${rule.author_permlink}</a>${dotOrComma}`;
            }
          });
          return `@${author} added ${currentField} (${langReadable}):\n ${rulesAllow} ${rulesIgnore}`;
        }
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
      data.parentAuthor = wObject.author;
      data.parentPermlink = wObject.author_permlink;
      data.body = getAppendMsg(data.author, bodyField);

      data.title = '';
      let fieldsObject = {
        name: includes(TYPES_OF_MENU_ITEM, currentField) ? objectFields.listItem : currentField,
        body: bodyField,
        locale: currentLocale,
      };

      if (currentField === objectFields.phone) {
        fieldsObject = {
          ...fieldsObject,
          [phoneFields.number]: formValues[phoneFields.number],
        };
      }

      if (currentField === objectFields.tagCategory) {
        fieldsObject = {
          ...fieldsObject,
          id: uuidv4(),
        };
      }

      if (currentField === objectFields.categoryItem) {
        fieldsObject = {
          ...fieldsObject,
          id: this.state.selectedCategory.id,
          tagCategory: this.state.selectedCategory.body,
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

      data.votePower = this.state.votePercent !== null ? this.state.votePercent * 100 : null;

      postData.push(data);
    });

    return postData;
  };

  getInitialValue = (wobject, fieldName) => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');
    const currentLocale = getFieldValue('currentLocale');

    const filtered =
      wobject.fields &&
      wobject.fields
        .filter(field => field.name === currentField && field.locale === currentLocale)
        .sort((a, b) => b.weight - a.weight);

    if (!filtered || !filtered.length) return '';

    try {
      const parsed = JSON.parse(filtered[0].body);
      return parsed[fieldName];
    } catch (e) {
      return filtered[0].body;
    }
  };

  setCoordinates = ({ latLng }) => {
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
    allowList[rowNum] = filter(allowList[rowNum], o => o.id !== id);
    this.setState({ allowList });
  };

  handleAddObjectToIgnoreList = obj => {
    const ignoreList = this.state.ignoreList;
    ignoreList.push(obj);
    this.setState({ ignoreList });
  };

  handleRemoveObjectFromIgnoreList = obj => {
    let ignoreList = this.state.ignoreList;
    ignoreList = filter(ignoreList, o => o.id !== obj.id);
    this.setState({ ignoreList });
  };

  calculateVoteWorth = value => {
    const { user, rewardFund, rate } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );

    this.setState({ votePercent: value, voteWorth });
  };

  handleCreateAlbum = async formData => {
    const { user, wObject, hideModal } = this.props;
    const data = prepareAlbumData(formData, user.name, wObject);
    const album = prepareAlbumToStore(data);

    try {
      const { author } = await this.props.appendObject(data);
      await addAlbumToStore({ ...album, author });
      hideModal();
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
      message.error(
        this.props.intl.formatMessage({
          id: 'gallery_add_album_failure',
          defaultMessage: "Couldn't create the album.",
        }),
      );
    }
  };

  handleAddPhotoToAlbum = () => {
    const { intl, hideModal } = this.props;
    const album = this.getImageAlbum();

    this.setState({ loading: true });

    this.appendImages()
      .then(() => {
        hideModal();
        this.setState({ fileList: [], uploadingList: [], loading: false });
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
    const { form } = this.props;
    const { currentImages } = this.state;

    const data = this.getWobjectData();
    /* eslint-disable no-restricted-syntax */
    for (const image of currentImages) {
      const postData = {
        ...data,
        permlink: `${data.author}-${generatePermlink()}`,
        field: this.getWobjectField(image),
        body: this.getWobjectBody(image),
      };

      /* eslint-disable no-await-in-loop */
      const response = await this.props.appendObject(postData);
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response.transactionId) {
        const filteredFileList = this.state.fileList.filter(file => file.uid !== image.uid);
        this.setState({ fileList: filteredFileList }, async () => {
          const img = prepareImageToStore(postData);
          await addImageToAlbumStore({
            ...img,
            author: get(response, ['value', 'author']),
            id: form.getFieldValue('id'),
          });
        });
      }
    }
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
    data.votePower = this.state.votePercent !== null ? this.state.votePercent * 100 : null;

    return data;
  };

  getWobjectField = image => {
    const { form } = this.props;
    return {
      name: 'galleryItem',
      body: image.src,
      locale: 'en-US',
      id: form.getFieldValue('id'),
    };
  };

  getImageAlbum = () => {
    const { currentAlbum } = this.state;
    const { albums } = this.props;
    let albumName = '';
    const album = albums.find(item => item.id === currentAlbum);
    albumName = get(album, 'body');
    return albumName;
  };

  getWobjectBody = image => {
    const { user, intl } = this.props;
    const album = this.getImageAlbum();

    return intl.formatMessage(
      {
        id: 'append_new_image',
        defaultMessage: `@{user} added a new image to album {album} <br /> {image.response.image}`,
      },
      {
        user: user.name,
        album,
        url: image.src,
      },
    );
  };

  handleCreateTag = () => {
    const { hideModal, intl, user } = this.props;
    const { categoryItem, selectedCategory } = this.state;
    const currentLocale = this.props.form.getFieldValue('currentLocale');
    const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;
    this.props.form.validateFields(err => {
      if (!err) {
        this.setState({ loading: true });
        this.appendTag(categoryItem)
          .then(() => {
            hideModal();
            this.setState({ categoryItem: null, loading: false });
            message.success(
              intl.formatMessage(
                {
                  id: 'added_tags_to_category',
                  defaultMessage: `@{user} added a new #tag ({language}) to {category} category`,
                },
                {
                  user: user.name,
                  language: langReadable,
                  category: selectedCategory.body,
                },
              ),
            );
          })
          .catch(error => {
            console.error(error.message);
            message.error(
              intl.formatMessage({
                id: 'couldnt_upload_image',
                defaultMessage: "Couldn't add item to the category.",
              }),
            );
            this.setState({ loading: false });
          });
      } else {
        console.error(err);
      }
    });
  };

  appendTag = async categoryItem => {
    const data = this.getWobjectData();

    /* eslint-disable no-restricted-syntax */
    const postData = {
      ...data,
      permlink: `${data.author}-${generatePermlink()}`,
      field: {
        ...this.getWobjectField(categoryItem),
        tagCategory: this.state.selectedCategory.body,
      },
      body: this.getWobjectBody(),
    };

    await this.props.appendObject(postData, { votePower: postData.votePower });
  };

  handleSubmit = event => {
    if (event) event.preventDefault();
    const currentField = this.props.form.getFieldValue('currentField');
    if (objectFields.galleryItem === currentField) {
      this.handleAddPhotoToAlbum();
    } else if (objectFields.newsFilter === currentField) {
      const { chosenLocale, usedLocale } = this.props;
      const allowList = map(this.state.allowList, rule => map(rule, o => o.id)).filter(sub =>
        size(sub),
      );
      const ignoreList = map(this.state.ignoreList, o => o.id);
      const locale = !isEmpty(chosenLocale) ? chosenLocale : usedLocale;

      if (!isEmpty(allowList) || !isEmpty(ignoreList))
        this.onSubmit({ currentField, currentLocale: locale });
      else {
        message.error(
          this.props.intl.formatMessage({
            id: 'at_least_one',
            defaultMessage: 'You should add at least one object',
          }),
        );
      }
    }

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
              defaultMessage: 'The value is already exist',
            }),
          );
        } else {
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
  };

  checkRequiredField = (form, currentField) => {
    let formFields = null;
    switch (currentField) {
      case objectFields.address:
        formFields = form.getFieldsValue(Object.values(addressFields));
        break;
      case objectFields.map:
        formFields = form.getFieldsValue(Object.values(mapFields));
        break;
      case objectFields.link:
        formFields = form.getFieldsValue(Object.values(linkFields));
        break;
      case objectFields.button:
        formFields = form.getFieldsValue(Object.values(buttonFields));
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

  trimText = text => trimStart(text).replace(/\s{2,}/g, ' ');

  isDuplicate = (currentLocale, currentField) => {
    const { form, wObject, user } = this.props;
    const currentValue = form.getFieldValue(currentField);
    const filtered = wObject.fields.filter(
      f => f.locale === currentLocale && f.name === currentField,
    );

    if (
      currentField === objectFields.website ||
      currentField === objectFields.address ||
      currentField === objectFields.map ||
      currentField === objectFields.status ||
      currentField === objectFields.button ||
      currentField === objectFields.link
    ) {
      return filtered.some(f =>
        isEqual(this.getCurrentObjectBody(currentField), JSON.parse(f.body)),
      );
    }

    if (currentField === objectFields.authority) {
      return filtered.some(f => f.body === currentValue && f.creator === user.name);
    }

    if (currentField === objectFields.phone)
      return filtered.some(f => this.getCurrentObjectBody(currentField).number === f.number);

    if (currentField === objectFields.name) return filtered.some(f => f.body === currentValue);

    return filtered.some(f => f.body.toLowerCase() === currentValue.toLowerCase());
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

    if (isDuplicated) {
      callback(
        intl.formatMessage({
          id: 'append_object_validation_msg',
          defaultMessage: 'The field with this value already exists',
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
              [name]: this.trimText(fields[name]),
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
    this.props.form.setFieldsValue({ [objectFields.sorting]: sortedList.join(',') });
  };

  onLoadingImage = value => this.setState({ isLoadingImage: value });

  getImages = image => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');
    if (image.length) {
      this.props.form.setFieldsValue({ [currentField]: image[0].src });
    } else {
      this.props.form.setFieldsValue({ [currentField]: '' });
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

  checkLengthHashtags = intl => (rule, values, callback) => {
    for (const val of values) {
      if (val.length > 100) {
        return callback(
          intl.formatMessage(
            {
              id: 'value_error_long',
              defaultMessage: "Value can't be longer than 100 characters.",
            },
            { value: 100 },
          ),
        );
      }
    }
    return callback();
  };

  handleCreateObject = (createdObject, options) => {
    const currentField = this.props.form.getFieldValue('currentField');

    this.props.form.setFieldsValue({
      [currentField]: createdObject.id,
      menuItemName: createdObject.name,
      locale: options.locale,
    });
    this.setState({ selectedObject: createdObject, votePercent: null }, this.handleSubmit);
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
      this.props.form.setFieldsValue({
        [currentField]: obj.author_permlink,
      });
      this.setState({ selectedObject: obj });
    }
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

  renderContentValue = currentField => {
    const { loading, selectedObject, selectedCategory, fileList } = this.state;
    const { intl, wObject, categories, selectedAlbum, albums } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const statusTitle = this.props.form.getFieldValue(statusFields.title);
    const albumInitialValue = selectedAlbum
      ? selectedAlbum.id || selectedAlbum.body
      : 'Choose an album';
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
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('menuItemName')(
                <Input
                  className="AppendForm__input"
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'menu_item_placeholder',
                    defaultMessage: 'Menu item name',
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
            {getFieldDecorator(objectFields.name, { rules: this.getFieldRules(objectFields.name) })(
              <Input
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
                  handleSelect={this.handleSelectObject}
                  objectType="hashtag"
                />,
              )}
              {this.state.selectedObject && <ObjectCardView wObject={this.state.selectedObject} />}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.background:
      case objectFields.avatar: {
        return (
          <div className="image-wrapper">
            <Form.Item>
              {getFieldDecorator(currentField, { rules: this.getFieldRules(currentField) })(
                <ImageSetter
                  onImageLoaded={this.getImages}
                  onLoadingImage={this.onLoadingImage}
                  isRequired
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
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder={intl.formatMessage({
                  id: 'price_field',
                  defaultMessage: 'Price',
                })}
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
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                autoSize={{ minRows: 4, maxRows: 8 }}
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
                />,
              )}
            </Form.Item>
            <MapAppendObject
              setCoordinates={this.setCoordinates}
              heigth={400}
              center={[
                Number(getFieldValue(mapFields.latitude)),
                Number(getFieldValue(mapFields.longitude)),
              ]}
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
                })(
                  <Input
                    className={classNames('AppendForm__input', {
                      'validation-error': !this.state.isSomeValue,
                    })}
                    disabled={loading}
                    placeholder={intl.formatMessage({
                      id: 'link',
                      defaultMessage: 'Link',
                    })}
                  />,
                )}
              </Form.Item>
            ) : null}
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
                      <i
                        className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                        style={{
                          color: profile.color,
                        }}
                      />
                    }
                    disabled={loading}
                    placeholder={profile.name}
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
        const buttons = parseButtonsField(wObject);
        const menuLinks = getMenuItems(wObject, TYPES_OF_MENU_ITEM.LIST, OBJECT_TYPE.LIST);
        const menuPages = getMenuItems(wObject, TYPES_OF_MENU_ITEM.PAGE, OBJECT_TYPE.PAGE);
        const listItems =
          [...menuLinks, ...menuPages].map(item => ({
            id: item.body || item.author_permlink,
            content: <DnDListItem name={item.alias || getObjectName(item)} type={item.type} />,
          })) || [];

        if (!isEmpty(buttons)) {
          buttons.forEach(btn => {
            listItems.push({
              id: btn.permlink,
              content: <DnDListItem name={btn.body.title} type={objectFields.button} />,
            });
          });
        }
        if (!isEmpty(wObject.newsFilter)) {
          listItems.push({
            id: TYPES_OF_MENU_ITEM.NEWS,
            content: (
              <DnDListItem
                name={intl.formatMessage({ id: 'news', defaultMessage: 'News' })}
                type={objectFields.newsFilter}
              />
            ),
          });
        }

        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(objectFields.sorting, {
                initialValue: listItems.map(item => item.id).join(','),
              })(
                <Select
                  className="AppendForm__hidden"
                  mode="tags"
                  disabled={loading}
                  dropdownStyle={{ display: 'none' }}
                  tokenSeparators={[' ', ',']}
                />,
              )}
            </Form.Item>
            <SortingList
              listItems={listItems}
              accentColor={PRIMARY_COLOR}
              onChange={this.handleChangeSorting}
            />
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
        return getNewsFilterLayout(this);
      case objectFields.tagCategory: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.tagCategory, {
              rules: this.getFieldRules(objectFields.tagCategory),
            })(
              <Input
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
                    onImageLoaded={this.getImage}
                    onLoadingImage={this.onLoadingImage}
                    isMultiple
                    isRequired
                  />
                  {/* TODO: Possible will use */}
                  {/* <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}> */}
                  {/*  <img */}
                  {/*    alt="example" */}
                  {/*    style={{ width: '100%', 'max-height': '90vh' }} */}
                  {/*    src={previewImage} */}
                  {/*  /> */}
                  {/* </Modal> */}
                </div>,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      default:
        return null;
    }
  };

  render() {
    const { chosenLocale, usedLocale, currentField, form, wObject } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading } = this.state;
    const isCustomSortingList =
      hasType(wObject, OBJECT_TYPE.LIST) &&
      form.getFieldValue('currentField') === objectFields.sorting;

    const languageOptions = [];
    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Select.Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Select.Option>,
      );
    });

    const fieldOptions = [];
    const disabledSelect = currentField !== 'auto';
    if (currentField === 'auto') {
      fieldOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_field" defaultMessage="Select your field" />
        </Select.Option>,
      );
    }

    getExposedFieldsByObjType(wObject).forEach(option => {
      fieldOptions.push(
        <Select.Option key={option} value={option} className="Topnav__search-autocomplete">
          <FormattedMessage id={`object_field_${option}`} defaultMessage={option} />
        </Select.Option>,
      );
    });

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
              disabled={disabledSelect}
              style={{ width: '100%' }}
              dropdownClassName="AppendForm__drop-down"
            >
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
        />
      </Form>
    );
  }
}
