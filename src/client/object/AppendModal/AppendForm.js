import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
} from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, message, Select } from 'antd';
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
import { getLanguageText } from '../../translations';
import {
  generatePermlink,
  getField,
  getObjectName,
  hasType,
  prepareAlbumData,
  prepareAlbumToStore,
  prepareImageToStore,
} from '../../helpers/wObjectHelper';
import { appendObject } from '../appendActions';
import withEditor from '../../components/Editor/withEditor';
import { getVoteValue } from '../../helpers/user';
import { getExposedFieldsByObjType, getListItems } from '../wObjectHelper';
import { rateObject } from '../wobjActions';
import { getNewsFilterLayout } from '../NewsFilter/newsFilterHelper';
import { baseUrl } from '../../../waivioApi/routes';
import AppendFormFooter from './AppendFormFooter';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import { addAlbumToStore, addImageToAlbumStore } from '../ObjectGallery/galleryActions';
import ItemName from './AppendFormComponents/ItemName/ItemName';
import ItemParent from './AppendFormComponents/ItemParent/ItemParent';
import ItemList from './AppendFormComponents/ItemList/ItemList';
import ItemAvatar from './AppendFormComponents/ItemAvatar/ItemAvatar';
import ItemTitle from './AppendFormComponents/ItemTitle/ItemTitle';
import ItemHours from './AppendFormComponents/ItemHours/ItemHours';
import ItemPrice from './AppendFormComponents/ItemPrice/ItemPrice';
import ItemDescription from './AppendFormComponents/ItemDescription/ItemDescription';
import ItemAddress from './AppendFormComponents/ItemAddress/ItemAddress';
import ItemMap from './AppendFormComponents/ItemMap/ItemMap';
import ItemWebSite from './AppendFormComponents/ItemWebSite/ItemWebSite';
import ItemStatus from './AppendFormComponents/ItemStatus/ItemStatus';
import ItemButton from './AppendFormComponents/ItemButton/ItemButton';
import ItemAuthority from './AppendFormComponents/ItemAuthority/ItemAuthority';
import ItemSocialLinks from './AppendFormComponents/ItemSocialLinks/ItemSocialLinks';
import ItemPhone from './AppendFormComponents/ItemPhone/ItemPhone';
import ItemEmail from './AppendFormComponents/ItemEmail/ItemEmail';
import ItemCustomSorting from './AppendFormComponents/ItemCustomSorting/ItemCustomSorting';
import ItemRatings from './AppendFormComponents/ItemRatings/ItemRatings';
import ItemTagCategory from './AppendFormComponents/ItemTagCategory/ItemTagCategory';
import ItemGalleryAlbum from './AppendFormComponents/ItemGalleryAlbum/ItemGalleryAlbum';
import ItemGallery from './AppendFormComponents/ItemGalleryAlbum/ItemGallery';
import ItemCategory from './AppendFormComponents/ItemCategory/ItemCategory';
import './AppendForm.less';

const AppendForm = props => {
  const [loading, setLoading] = useState(false);
  const [isSomeValue, setIsSomeValue] = useState(true);
  const [votePercent, setVotePercent] = useState(props.defaultVotePercent / 100);
  const [voteWorth, setVoteWorth] = useState(0);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [allowList, setAllowList] = useState([[]]);
  const [ignoreList, setIgnoreList] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState([]);
  const [categoryItem, setCategoryItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  // for commit
  setCurrentAlbum();
  setIgnoreList();
  setAllowList(currentTags);

  const calculateVoteWorth = value => {
    const { user, rewardFund, rate } = props;
    const getVoteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );
    setVoteWorth(getVoteWorth);
    setVotePercent(value);
  };

  useEffect(() => {
    if (props.sliderMode) {
      if (!sliderVisible) {
        setSliderVisible(sliderVisible);
      }
    }
    calculateVoteWorth(votePercent);
  }, [sliderVisible]);

  const getNewPostData = formValues => {
    const { wObject } = props;
    const { getFieldValue } = props.form;
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
        const newAllowList = map(allowList, rule => map(rule, o => o.id)).filter(sub => sub.length);
        const newIgnoreList = map(ignoreList, o => o.id);
        fieldBody.push(JSON.stringify({ newAllowList, newIgnoreList }));
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
          const displayName = `${selectedObject.name} (type: ${selectedObject.type})`;
          const objectUrl = `${apiConfig.production.protocol}${apiConfig.production.host}/object/${appendValue}`;
          return `@${author} added ${currentField} (${langReadable}):\n[${displayName}](${objectUrl})${
            alias ? ` as "${alias}"` : ''
          }`;
        }
        case objectFields.categoryItem: {
          return `@${author} added #tag ${selectedObject.name} (${langReadable}) into ${selectedCategory.body} category`;
        }
        case objectFields.newsFilter: {
          let rulesAllow = `\n`;
          let rulesIgnore = '\nIgnore list:';
          let rulesCounter = 0;

          allowList.forEach(rule => {
            if (!isEmpty(rule)) {
              rulesAllow += `\n Filter rule #${rulesCounter + 1}:`;
              rule.forEach(item => {
                rulesAllow += ` <a href="${baseUrl}/object/${item.id}">${item.id}</a>,`;
              });

              rulesCounter += 1;
            }
          });

          ignoreList.forEach((rule, index) => {
            if (!isEmpty(rule)) {
              const dotOrComma = ignoreList.length - 1 === index ? '.' : ',';
              rulesIgnore += ` <a href="${baseUrl}/object/${rule.id}">${rule.id}</a>${dotOrComma}`;
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

      data.author = props.user.name;
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
          tagCategory: selectedCategory,
        };
      }

      if (includes(TYPES_OF_MENU_ITEM, currentField)) {
        fieldsObject = {
          ...fieldsObject,
          type: currentField,
          alias: getFieldValue('menuItemName') || selectedObject.name,
        };
      }

      data.field = fieldsObject;

      data.permlink = `${data.author}-${Math.random()
        .toString(36)
        .substring(2)}`;
      data.lastUpdated = Date.now();

      data.wobjectName = getField(wObject, 'name');

      data.votePower = votePercent !== null ? votePercent * 100 : null;

      postData.push(data);
    });

    return postData;
  };

  const onSubmit = formValues => {
    const { form, wObject } = props;
    const postData = getNewPostData(formValues);
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
            props.intl.formatMessage(
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
        setLoading(true);
        props
          .appendObject(data, { votePower: data.votePower, follow: formValues.follow })
          .then(res => {
            const mssg = get(res, ['value', 'message']);
            if (mssg) {
              message.error(mssg);
            } else {
              if (data.votePower !== null) {
                if (objectFields.rating === formValues.currentField && formValues.rate) {
                  const { author, permlink } = res;
                  props.rateObject(
                    author,
                    permlink,
                    wObject.author_permlink,
                    ratePercent[formValues.rate - 1],
                  );
                }
              }
              if (data.field.name === objectFields.button) {
                message.success(
                  props.intl.formatMessage(
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
                props.intl.formatMessage(
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
              props.hideModal();
            }
            setLoading(false);
          })
          .catch(() => {
            message.error(
              props.intl.formatMessage({
                id: 'couldnt_append',
                defaultMessage: "Couldn't add the field to object.",
              }),
            );
            setLoading(false);
          });
      }
    }
  };

  const onUpdateCoordinate = positionField => e => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      props.form.setFieldsValue({
        [positionField]: Number(e.target.value),
      });
    }
  };

  const setCoordinates = ({ latLng }) => {
    props.form.setFieldsValue({
      [mapFields.latitude]: latLng[0].toFixed(6),
      [mapFields.longitude]: latLng[1].toFixed(6),
    });
  };

  const handleCreateAlbum = async formData => {
    const { user, wObject, hideModal } = props;
    const data = prepareAlbumData(formData, user.name, wObject);
    const album = prepareAlbumToStore(data);

    try {
      const { author } = await props.appendObject(data);
      await addAlbumToStore({ ...album, author });
      hideModal();
      message.success(
        props.intl.formatMessage(
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
        props.intl.formatMessage({
          id: 'gallery_add_album_failure',
          defaultMessage: "Couldn't create the album.",
        }),
      );
    }
  };

  const getImageAlbum = () => {
    const { albums } = props;
    let albumName = '';
    const album = albums.find(item => item.id === currentAlbum);
    albumName = get(album, 'body');
    return albumName;
  };

  const appendImages = async () => {
    const { form } = this.props;
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

  const handleAddPhotoToAlbum = () => {
    const { intl, hideModal } = props;
    const album = getImageAlbum();

    setLoading(true);

    appendImages()
      .then(() => {
        hideModal();
        setLoading(false);
        setFileList([]);
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
        setLoading(false);
      });
  };

  const getImage = image => setCurrentImages(image);

  const getWobjectData = () => {
    const { user, wObject } = props;
    const data = {};
    data.author = user.name;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.title = '';
    data.lastUpdated = Date.now();
    data.wobjectName = getObjectName(wObject);
    data.votePower = votePercent !== null ? votePercent * 100 : null;

    return data;
  };

  const getWobjectField = image => {
    const { form } = props;
    return {
      name: 'galleryItem',
      body: image.src,
      locale: 'en-US',
      id: form.getFieldValue('id'),
    };
  };

  const getWobjectBody = image => {
    const { user, intl } = props;
    const album = getImageAlbum();

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

  const appendTag = async categoryElement => {
    const data = getWobjectData();

    const postData = {
      ...data,
      permlink: `${data.author}-${generatePermlink()}`,
      field: {
        ...getWobjectField(categoryElement),
        tagCategory: selectedCategory.body,
      },
      body: getWobjectBody(),
    };

    await props.appendObject(postData, { votePower: postData.votePower });
  };

  const handleCreateTag = () => {
    const { hideModal, intl, user } = props;
    const currentLocale = props.form.getFieldValue('currentLocale');
    const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;
    props.form.validateFields(err => {
      if (!err) {
        setLoading(true);
        appendTag(categoryItem)
          .then(() => {
            hideModal();
            setCategoryItem(null);
            setLoading(false);
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
            setLoading(false);
          });
      } else {
        console.error(err);
      }
    });
  };

  const checkRequiredField = (form, currentField) => {
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
      setIsSomeValue(isSomeValueFilled);
      return !isSomeValueFilled;
    }

    return false;
  };

  const handleSubmit = event => {
    if (event) event.preventDefault();
    const currentField = props.form.getFieldValue('currentField');

    if (objectFields.categoryItem === currentField) {
      handleCreateTag();
    } else if (objectFields.galleryItem === currentField) {
      handleAddPhotoToAlbum();
    }

    props.form.validateFieldsAndScroll((err, values) => {
      const identicalNameFields = props.ratingFields.reduce((acc, field) => {
        if (field.body === values.rating) {
          return field.locale === values.currentLocale ? [...acc, field] : acc;
        }
        return acc;
      }, []);

      if (!identicalNameFields.length) {
        const { form, intl } = props;

        if (objectFields.galleryAlbum === currentField) {
          handleCreateAlbum(values);
        } else if (objectFields.newsFilter === currentField) {
          const newAllowList = map(allowList, rule => map(rule, o => o.id)).filter(
            sub => sub.length,
          );

          const newIgnoreList = map(ignoreList, o => o.id);

          if (!isEmpty(newAllowList) || !isEmpty(newIgnoreList)) onSubmit(values);
          else {
            message.error(
              intl.formatMessage({
                id: 'at_least_one',
                defaultMessage: 'You should add at least one object',
              }),
            );
          }
        } else if (err || checkRequiredField(form, currentField)) {
          message.error(
            props.intl.formatMessage({
              id: 'append_validate_common_message',
              defaultMessage: 'The value is already exist',
            }),
          );
        } else {
          onSubmit(values);
        }
      } else {
        message.error(
          props.intl.formatMessage({
            id: 'append_validate_message',
            defaultMessage: 'The rating with such name already exist in this locale',
          }),
        );
      }
    });
  };

  const trimText = text => trimStart(text).replace(/\s{2,}/g, ' ');

  const getCurrentObjectBody = () => {
    const form = props.form;
    const formValues = form.getFieldsValue();
    const { currentLocale, currentField, like, follow, ...otherValues } = formValues;

    return omitBy(otherValues, isNil);
  };

  const isDuplicate = (currentLocale, currentField) => {
    const { form, wObject, user } = props;
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
      return filtered.some(f => isEqual(getCurrentObjectBody(currentField), JSON.parse(f.body)));
    }

    if (currentField === objectFields.authority) {
      return filtered.some(f => f.body === currentValue && f.creator === user.name);
    }

    if (currentField === objectFields.phone)
      return filtered.some(f => getCurrentObjectBody(currentField).number === f.number);

    if (currentField === objectFields.name) return filtered.some(f => f.body === currentValue);

    return filtered.some(f => f.body.toLowerCase() === currentValue.toLowerCase());
  };

  const validateFieldValue = (rule, value, callback) => {
    const { intl, form } = props;
    const currentField = form.getFieldValue('currentField');
    const currentLocale = form.getFieldValue('currentLocale');
    const formFields = form.getFieldsValue();

    const isDuplicated = formFields[rule.field] ? isDuplicate(currentLocale, currentField) : false;

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
              [name]: trimText(fields[name]),
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

  const handleChangeSorting = sortedList => {
    props.form.setFieldsValue({ [objectFields.sorting]: sortedList.join(',') });
  };

  const onLoadingImage = value => this.setState({ isLoadingImage: value });

  const getImages = image => {
    const { getFieldValue } = props.form;
    const currentField = getFieldValue('currentField');
    if (image.length) {
      props.form.setFieldsValue({ [currentField]: image[0].src });
    } else {
      props.form.setFieldsValue({ [currentField]: '' });
    }
  };

  const handleCreateObject = (createdObject, options) => {
    const currentField = props.form.getFieldValue('currentField');

    props.form.setFieldsValue({
      [currentField]: createdObject.id,
      menuItemName: createdObject.name,
      locale: options.locale,
    });
    setSelectedObject(createdObject);
    setVotePercent(null);
    handleSubmit();
  };

  const handleSelectObject = (obj = {}) => {
    const { wObject, intl } = props;
    const currentField = props.form.getFieldValue('currentField');
    if (obj.author_permlink === wObject.author_permlink && currentField === 'parent') {
      message.error(
        intl.formatMessage({
          id: 'currentFielddont_use_current_object_for_parent',
          defaultMessage: 'You cannot use the current object as a parent',
        }),
      );
    } else if (obj.author_permlink) {
      props.form.setFieldsValue({
        [currentField]: obj.author_permlink,
      });
      setSelectedObject(obj);
    }
  };

  const handleSelectCategory = value => {
    const category = props.categories.find(item => item.body === value);
    if (!isEmpty(category.categoryItems)) {
      // eslint-disable-next-line no-shadow
      let currentTags = getObjectsByIds({
        authorPermlinks: category.categoryItems.map(tag => tag.name),
      });
      currentTags = currentTags.wobjects;
      setSelectedCategory(category);
      setCurrentTags(currentTags);
    } else {
      setSelectedCategory(category);
      setCurrentTags([]);
    }
  };

  const getFieldRules = fieldName => {
    const { intl } = props;
    const rules = fieldsRules[fieldName] || [];

    return rules.map(rule => {
      if (has(rule, 'message')) {
        return {
          ...rule,
          message: intl.formatMessage(get(rule, 'message.intlId'), get(rule, 'message.intlMeta')),
        };
      }
      if (has(rule, 'validator')) {
        return { validator: validateFieldValue };
      }
      return rule;
    });
  };

  const renderContentValue = currentField => {
    const { intl, wObject, categories, selectedAlbum, albums } = props;
    const { getFieldDecorator, getFieldValue } = props.form;
    const statusTitle = props.form.getFieldValue(statusFields.title);

    const combinedFieldValidationMsg = !isSomeValue && (
      <div className="append-combined-value__validation-msg">
        {intl.formatMessage({
          id: 'append_object_validation_message',
          defaultMessage: 'At least one field must be filled',
        })}
      </div>
    );

    switch (currentField) {
      case TYPES_OF_MENU_ITEM.PAGE:
      case TYPES_OF_MENU_ITEM.LIST:
        return (
          <ItemList
            getFieldDecorator={getFieldDecorator}
            loading={loading}
            intl={intl}
            selectedObject={selectedObject}
            handleSelectObject={handleSelectObject}
            handleCreateObject={handleCreateObject}
            getFieldRules={getFieldRules}
            currentField={currentField}
            wObject={wObject}
          />
        );
      case objectFields.name:
        return (
          <ItemName
            loading={loading}
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            intl={intl}
          />
        );
      case objectFields.parent:
        return (
          <ItemParent
            getFieldDecorator={getFieldDecorator}
            handleSelectObject={handleSelectObject}
            selectedObject={selectedObject}
          />
        );
      case objectFields.categoryItem:
        return (
          <ItemCategory
            getFieldDecorator={getFieldDecorator}
            selectedCategory={selectedCategory}
            categories={categories}
            loading={loading}
            handleSelectCategory={handleSelectCategory}
            handleSelectObject={handleSelectObject}
            selectedObject={selectedObject}
            getFieldRules={getFieldRules}
          />
        );
      case objectFields.background:
      case objectFields.avatar:
        return (
          <div className="image-wrapper">
            <ItemAvatar
              getFieldDecorator={getFieldDecorator}
              getImages={getImages}
              onLoadingImage={onLoadingImage}
              currentField={currentField}
            />
          </div>
        );
      case objectFields.title:
        return (
          <ItemTitle
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            isSomeValue={isSomeValue}
            loading={loading}
            intl={intl}
          />
        );
      case objectFields.workTime:
        return (
          <ItemHours
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.price:
        return (
          <ItemPrice
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.description:
        return (
          <ItemDescription
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.address:
        return (
          <ItemAddress
            combinedFieldValidationMsg={combinedFieldValidationMsg}
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.map:
        return (
          <ItemMap
            getFieldDecorator={getFieldDecorator}
            onUpdateCoordinate={onUpdateCoordinate}
            setCoordinates={setCoordinates}
            getFieldValue={getFieldValue}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.website:
        return (
          <ItemWebSite
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.status:
        return (
          <ItemStatus
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            statusTitle={statusTitle}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.authority:
        return (
          <ItemAuthority
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            intl={intl}
          />
        );
      case objectFields.button:
        return (
          <ItemButton
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.link:
        return (
          <ItemSocialLinks
            getFieldDecorator={getFieldDecorator}
            combinedFieldValidationMsg={combinedFieldValidationMsg}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.phone:
        return (
          <ItemPhone
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.email:
        return (
          <ItemEmail
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.sorting:
        return (
          <ItemCustomSorting
            getFieldDecorator={getFieldDecorator}
            wObject={wObject}
            loading={loading}
            intl={intl}
            handleChangeSorting={handleChangeSorting}
          />
        );
      case objectFields.rating:
        return (
          <ItemRatings
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.newsFilter:
        return getNewsFilterLayout(this);
      case objectFields.tagCategory:
        return (
          <ItemTagCategory
            getFieldDecorator={getFieldDecorator}
            getFieldRules={getFieldRules}
            loading={loading}
            intl={intl}
            isSomeValue={isSomeValue}
          />
        );
      case objectFields.galleryAlbum:
        return (
          <ItemGalleryAlbum getFieldDecorator={getFieldDecorator} loading={loading} intl={intl} />
        );
      case objectFields.galleryItem:
        return (
          <ItemGallery
            getFieldDecorator={getFieldDecorator}
            onLoadingImage={onLoadingImage}
            getImage={getImage}
            fileList={fileList}
            selectedAlbum={selectedAlbum}
            albums={albums}
            loading={loading}
            intl={intl}
          />
        );
      default:
        return null;
    }
  };

  const { chosenLocale, usedLocale, currentField, form, wObject } = props;
  const { getFieldDecorator, getFieldValue } = props.form;
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
    <Form className="AppendForm" layout="vertical" onSubmit={handleSubmit}>
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
          rules: getFieldRules('currentLocale'),
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
      {renderContentValue(getFieldValue('currentField'))}
      <AppendFormFooter
        loading={loading}
        calcVote={calculateVoteWorth}
        form={form}
        handleSubmit={handleSubmit}
        votePercent={votePercent}
        voteWorth={voteWorth}
      />
    </Form>
  );
};

AppendForm.propTypes = {
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

AppendForm.defaultProps = {
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

const mapStateToProps = state => ({
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
});

const mapDispatchToProps = {
  appendObject,
  rateObject,
  addImageToAlbumStore,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  Form.create,
  withEditor,
)(AppendForm);
