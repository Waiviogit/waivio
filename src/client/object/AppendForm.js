import { map, filter, has, isEmpty, get, includes, isNaN, trimStart } from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Input, message, Select, Rate, Icon } from 'antd';
import { fieldsRules } from './const/appendFormConstants';
import apiConfig from '../../waivioApi/config.json';
import {
  linkFields,
  objectFields,
  mapFields,
  addressFields,
  socialObjectFields,
  websiteFields,
  phoneFields,
  ratingFields,
  ratePercent,
  getAllowedFieldsByObjType,
  buttonFields,
  TYPES_OF_MENU_ITEM,
  statusFields,
} from '../../common/constants/listOfFields';
import OBJECT_TYPE from '../object/const/objectTypes';
import {
  getObject,
  getRewardFund,
  getRate,
  getVotingPower,
  getVotePercent,
  getFollowingObjectsList,
  getSuitableLanguage,
  getRatingFields,
} from '../reducers';
import LANGUAGES from '../translations/languages';
import { PRIMARY_COLOR } from '../../common/constants/waivio';
import { getLanguageText } from '../translations';
import MapAppendObject from '../components/Maps/MapAppendObject';
import { getField } from '../helpers/wObjectHelper';
import { appendObject } from '../object/appendActions';
import withEditor from '../components/Editor/withEditor';
import { getVoteValue } from '../helpers/user';
import { getFieldWithMaxWeight, getInnerFieldWithMaxWeight, getListItems } from './wObjectHelper';
import { rateObject } from '../object/wobjActions';
import SortingList from '../components/DnDList/DnDList';
import DnDListItem from '../components/DnDList/DnDListItem';
import SearchObjectsAutocomplete from '../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../objectCard/ObjectCardView';
import { getNewsFilterLayout } from './NewsFilter/newsFilterHelper';
import CreateObject from '../post/CreateObjectModal/CreateObject';
import { baseUrl } from '../../waivioApi/routes';
import AppendFormFooter from './AppendFormFooter';
import ImageSetter from '../components/ImageSetter/ImageSetter';

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
  }),
  { appendObject, rateObject },
)
@Form.create()
@withEditor
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
    ratingFields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

  onSubmit = async formValues => {
    console.log('onSubmit');
    this.setState({ loading: true });

    const {
      form: { getFieldValue },
      wObject,
    } = this.props;
    const postData = this.getNewPostData(formValues);
    /* eslint-disable no-restricted-syntax */
    console.log('after getNewPostData');
    console.log(postData);
    for (const data of postData) {
      try {
        // we do not vote append when append just created page/list
        if (data.votePower === null) {
          this.props.hideModal();
          this.props
            .appendObject(data, { votePower: data.votePower, follow: formValues.follow })
            .then(() => {
              message.success(
                this.props.intl.formatMessage(
                  {
                    id: 'added_field_to_wobject',
                    defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                  },
                  {
                    field: getFieldValue('currentField'),
                    wobject: wObject.name,
                  },
                ),
              );
            });
          return;
        }

        /* eslint-disable no-await-in-loop */
        const response = await this.props.appendObject(data, {
          votePower: data.votePower,
          follow: formValues.follow,
        });

        if (objectFields.rating === formValues.currentField && formValues.rate) {
          const { author, permlink } = response.value;
          await this.props.rateObject(
            author,
            permlink,
            wObject.author_permlink,
            ratePercent[formValues.rate - 1],
          );
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        message.error(
          this.props.intl.formatMessage({
            id: 'couldnt_append',
            defaultMessage: "Couldn't add the field to object.",
          }),
        );
        this.setState({ loading: false });
      }
    }

    this.setState({ loading: false });

    this.props.hideModal();
    message.success(
      this.props.intl.formatMessage(
        {
          id: 'added_field_to_wobject',
          defaultMessage: `You successfully have added the {field} field to {wobject} object`,
        },
        {
          field: getFieldValue('currentField'),
          wobject: getFieldWithMaxWeight(wObject, objectFields.name),
        },
      ),
    );
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
      case objectFields.title:
      case objectFields.description:
      case objectFields.avatar:
      case objectFields.background:
      case objectFields.price:
      case objectFields.tagCloud:
      case objectFields.parent:
      case objectFields.workTime:
      case objectFields.email:
      case TYPES_OF_MENU_ITEM.PAGE:
      case TYPES_OF_MENU_ITEM.LIST: {
        fieldBody.push(rest[currentField]);
        break;
      }
      case objectFields.newsFilter: {
        const allowList = map(this.state.allowList, rule => map(rule, o => o.id)).filter(
          sub => sub.length,
        );
        const ignoreList = map(this.state.ignoreList, o => o.id);
        fieldBody.push(JSON.stringify({ allowList, ignoreList }));
        break;
      }
      case objectFields.sorting: {
        fieldBody.push(JSON.stringify(rest[objectFields.sorting]));
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
          const displayName = `${this.state.selectedObject.name} (type: ${this.state.selectedObject.type})`;
          const objectUrl = `${apiConfig.production.protocol}${apiConfig.production.host}/object/${appendValue}`;
          return `@${author} added ${currentField} (${langReadable}):\n[${displayName}](${objectUrl})${
            alias ? ` as "${alias}"` : ''
          }`;
        }
        case objectFields.newsFilter: {
          let rulesAllow = `\n`;
          let rulesIgnore = '\nIgnore list:';
          let rulesCounter = 0;

          this.state.allowList.forEach(rule => {
            if (!isEmpty(rule)) {
              rulesAllow += `\n Filter rule #${rulesCounter + 1}:`;
              rule.forEach(item => {
                rulesAllow += ` <a href="${baseUrl}/object/${item.id}">${item.id}</a>,`;
              });
              // eslint-disable-next-line no-plusplus
              rulesCounter++;
            }
          });

          this.state.ignoreList.forEach((rule, index) => {
            if (!isEmpty(rule)) {
              const dotOrComma = this.state.ignoreList.length - 1 === index ? '.' : ',';
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

      data.wobjectName = getField(wObject, 'name');

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

  // News Filter Block

  // eslint-disable-next-line react/sort-comp
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

  handleSubmit = event => {
    if (event) event.preventDefault();
    console.log('handleSubmit.start');
    console.log(event);
    this.props.form.validateFieldsAndScroll((err, values) => {
      const identicalNameFields = this.props.ratingFields.reduce((acc, field) => {
        if (field.body === values.rating) {
          return field.locale === values.currentLocale ? [...acc, field] : acc;
        }

        return acc;
      }, []);

      if (!identicalNameFields.length) {
        const { form, intl } = this.props;
        const currentField = form.getFieldValue('currentField');
        console.log('getFieldValue.after');
        console.log(event);
        if (objectFields.newsFilter === currentField) {
          const allowList = map(this.state.allowList, rule => map(rule, o => o.id)).filter(
            sub => sub.length,
          );
          const ignoreList = map(this.state.ignoreList, o => o.id);
          if (!isEmpty(allowList) || !isEmpty(ignoreList)) this.onSubmit(values);
          else {
            message.error(
              intl.formatMessage({
                id: 'at_least_one',
                defaultMessage: 'You should add at least one object',
              }),
            );
          }
        } else if (err || this.checkRequiredField(form, currentField)) {
          // this.props.onError();
          console.log(err);
          console.log(event);
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
      console.log('checkRequiredField');
      const isSomeValueFilled = Object.values(formFields).some(f => Boolean(f));
      this.setState({ isSomeValue: isSomeValueFilled });
      return !isSomeValueFilled;
    }

    return false;
  };

  trimText = text => trimStart(text).replace(/\s{2,}/g, ' ');

  validateFieldValue = (rule, value, callback) => {
    console.log('validateFieldValue');
    console.log(rule);
    console.log(value);
    const { intl, wObject, form } = this.props;
    const currentField = form.getFieldValue('currentField');
    const currentLocale = form.getFieldValue('currentLocale');
    const fields = form.getFieldsValue();
    const triggerValue = this.trimText(fields[currentField]);
    const filtered = wObject.fields.filter(
      f => f.locale === currentLocale && f.name === currentField,
    );
    const trimNestedFields = name => {
      if (fields[name]) {
        form.setFieldsValue({
          [name]: this.trimText(fields[name]),
        });
      }
      console.log('trimNestedFields');
      console.log(name);
      console.log(fields[name]);
    };

    form.setFieldsValue({
      [currentField]: triggerValue,
    });

    if (currentField === objectFields.phone) {
      trimNestedFields(phoneFields.name);
      trimNestedFields(phoneFields.number);
    }

    if (currentField === objectFields.website) {
      trimNestedFields(websiteFields.title);
      trimNestedFields(websiteFields.link);
    }

    if (currentField === objectFields.address) {
      trimNestedFields(addressFields.street);
      trimNestedFields(addressFields.city);
      trimNestedFields(addressFields.state);
      trimNestedFields(addressFields.postalCode);
      trimNestedFields(addressFields.country);
    }

    if (filtered.map(f => f.body.toLowerCase()).includes(value)) {
      callback(
        intl.formatMessage({
          id: 'append_object_validation_msg',
          defaultMessage: 'The field with this value already exists',
        }),
      );
    }
    console.log('validateFieldValue');
    console.log(rule);
    console.log(value);
    callback();
  };

  handleChangeSorting = sortedList => {
    this.props.form.setFieldsValue({ [objectFields.sorting]: sortedList });
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

  handleSelectObject = obj => {
    const currentField = this.props.form.getFieldValue('currentField');
    if (obj && obj.id) {
      this.props.form.setFieldsValue({
        [currentField]: obj.id,
      });
      this.setState({ selectedObject: obj });
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
      console.log('getFieldRules');
      console.log(fieldName);
      return rule;
    });
  };

  renderContentValue = currentField => {
    const { loading, selectedObject } = this.state;
    const { intl, wObject } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

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
          this.props.currentField === TYPES_OF_MENU_ITEM.LIST ? OBJECT_TYPE.LIST : OBJECT_TYPE.PAGE;
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
              {selectedObject && <ObjectCardView wObject={this.state.selectedObject} />}
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
                </Select>,
              )}
            </Form.Item>
            {this.props.form.getFieldValue(statusFields.title) === 'relisted' && (
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
            )}
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
        const listItems =
          getListItems(wObject, { uniq: true, isMappedToClientWobject: true }).map(item => ({
            id: item.id,
            content: <DnDListItem name={item.name} type={item.type} />,
          })) || [];
        const button = getInnerFieldWithMaxWeight(wObject, objectFields.button);
        if (button) {
          listItems.push({
            id: TYPES_OF_MENU_ITEM.BUTTON,
            content: <DnDListItem name={button.title} type={objectFields.button} />,
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
                initialValue: listItems.map(item => item.id),
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
      default:
        return null;
    }
  };

  render() {
    const { intl, chosenLocale, usedLocale, currentField, form, wObject } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading } = this.state;

    const isCustomSortingList =
      wObject.object_type &&
      wObject.object_type.toLowerCase() === OBJECT_TYPE.LIST &&
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
    if (currentField === 'auto') {
      fieldOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_field" defaultMessage="Select your field" />
        </Select.Option>,
      );
    }

    getAllowedFieldsByObjType(wObject.object_type).forEach(option => {
      let intlId = option;
      let metaInfo = '';
      if (includes(TYPES_OF_MENU_ITEM, option)) {
        intlId = 'menuItem';
        metaInfo = option;
      }
      fieldOptions.push(
        <Select.Option key={option} value={option} className="Topnav__search-autocomplete">
          <FormattedMessage id={`object_field_${intlId}`} defaultMessage={option} />
          {metaInfo &&
            ` (${intl.formatMessage({ id: `object_field_${metaInfo}`, defaultMessage: option })})`}
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
              disabled={loading}
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
        <AppendFormFooter loading={loading} form={form} handleSubmit={this.handleSubmit} />
      </Form>
    );
  }
}
