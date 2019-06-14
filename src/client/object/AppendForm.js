import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Input, message, Select, Avatar, Rate, Icon } from 'antd';
import { fieldsRules } from './const/appendFormConstants';
import {
  linkFields,
  objectFields,
  mapFields,
  addressFields,
  socialObjectFields,
  websiteFields,
  objectImageFields,
  phoneFields,
  ratingFields,
  ratePercent,
  getAllowedFieldsByObjType,
  buttonFields,
  TYPES_OF_MENU_ITEM,
} from '../../common/constants/listOfFields';
import OBJECT_TYPE from '../object/const/objectTypes';
import {
  getObject,
  getRewardFund,
  getRate,
  getAuthenticatedUser,
  getVotingPower,
  getVotePercent,
  getFollowingObjectsList,
  getScreenSize,
} from '../reducers';
import LANGUAGES from '../translations/languages';
import { PRIMARY_COLOR } from '../../common/constants/waivio';
import { getLanguageText } from '../translations';
import QuickPostEditorFooter from '../components/QuickPostEditor/QuickPostEditorFooter';
import MapAppendObject from '../components/Maps/MapAppendObject';
import './AppendForm.less';
import { getField } from '../objects/WaivioObject';
import { appendObject } from '../object/appendActions';
import { isValidImage } from '../helpers/image';
import withEditor from '../components/Editor/withEditor';
import { MAX_IMG_SIZE, ALLOWED_IMG_FORMATS } from '../../common/constants/validation';
import { getHasDefaultSlider, getVoteValue } from '../helpers/user';
import LikeSection from './LikeSection';
import { getFieldWithMaxWeight, getListItems } from './wObjectHelper';
import FollowObjectForm from './FollowObjectForm';
import { followObject, rateObject } from '../object/wobjActions';
import SortingList from '../components/DnDList/DnDList';
import { getClientWObj } from '../adapters';
import SearchObjectsAutocomplete from '../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../objectCard/ObjectCardView';
import { getNewsFilterLayout } from './NewsFilter/newsFilterHelper';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    wObject: getObject(state),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    sliderMode: getVotingPower(state),
    defaultVotePercent: getVotePercent(state),
    followingList: getFollowingObjectsList(state),
    screenSize: getScreenSize(state),
  }),
  { appendObject, followObject, rateObject },
)
@injectIntl
@Form.create()
@withEditor
export default class AppendForm extends Component {
  static propTypes = {
    currentField: PropTypes.string,
    currentLocale: PropTypes.string,
    hideModal: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    wObject: PropTypes.shape(),
    form: PropTypes.shape(),
    appendObject: PropTypes.func,
    followObject: PropTypes.func,
    intl: PropTypes.shape(),
    user: PropTypes.shape(),
    rewardFund: PropTypes.shape(),
    rate: PropTypes.number,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    defaultVotePercent: PropTypes.number.isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string),
    rateObject: PropTypes.func,
  };

  static defaultProps = {
    currentField: 'auto',
    currentLocale: 'en-US',
    currentUsername: '',
    hideModal: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
    wObject: {},
    form: {},
    appendObject: () => {},
    followObject: () => {},
    intl: {},
    user: {},
    rewardFund: {},
    rate: 1,
    sliderMode: 'auto',
    defaultVotePercent: 100,
    followingList: [],
    rateObject: () => {},
  };

  state = {
    isSomeValue: true,
    imageUploading: false,
    currentImage: [],
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
    const { sliderMode, user } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
    this.calculateVoteWorth(this.state.votePercent);
  };

  onSubmit = async formValues => {
    this.setState({ loading: true });

    const {
      form: { getFieldValue },
      wObject,
    } = this.props;

    const postData = this.getNewPostData(formValues);

    /* eslint-disable no-restricted-syntax */
    for (const data of postData) {
      try {
        /* eslint-disable no-await-in-loop */
        const response = await this.props.appendObject(data);

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
        console.log(e);
        this.setState({ loading: false });
      }
    }

    if (getFieldValue('follow')) {
      await this.props.followObject(wObject.author_permlink);
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
    if (!_.isNan(value)) {
      this.props.form.setFieldsValue({
        [positionField]: Number(e.target.value),
      });
    }
  };

  getNewPostData = formValues => {
    const { wObject } = this.props;
    const { getFieldValue } = this.props.form;
    const { body, preview, currentField, currentLocale, like, follow, ...rest } = formValues;

    const field = getFieldValue('currentField');
    let locale = getFieldValue('currentLocale');
    if (locale === 'auto') locale = 'en-US';
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
        const allowList = _.map(this.state.allowList, rule => _.map(rule, o => o.id)).filter(
          sub => sub.length,
        );
        const ignoreList = _.map(this.state.ignoreList, o => o.id);
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
        fieldBody.push(rest[ratingFields.category]);
        break;
      }
      default:
        fieldBody.push(JSON.stringify(rest));
        break;
    }

    fieldBody.forEach(bodyField => {
      const data = {};

      data.author = this.props.user.name;
      data.parentAuthor = wObject.author;
      data.parentPermlink = wObject.author_permlink;

      const langReadable = _.filter(LANGUAGES, { id: locale })[0].name;

      data.body = `@${data.author} added ${field} (${langReadable}):\n ${bodyField.replace(
        /[{}"]/g,
        '',
      )}`;

      data.title = '';
      let fieldsObject = {
        name: _.includes(TYPES_OF_MENU_ITEM, field) ? objectFields.listItem : field,
        body: bodyField,
        locale,
      };

      if (field === objectFields.phone) {
        fieldsObject = {
          ...fieldsObject,
          [phoneFields.number]: formValues[phoneFields.number],
        };

        data.body = `@${data.author} added ${field}(${langReadable}):\n ${bodyField.replace(
          /[{}"]/g,
          '',
        )} ${formValues[phoneFields.number].replace(/[{}"]/g, '')}  `;
      }

      if (_.includes(TYPES_OF_MENU_ITEM, field)) {
        fieldsObject = {
          ...fieldsObject,
          type: field,
          alias: getFieldValue('menuItemName'),
        };
      }

      data.field = fieldsObject;

      data.permlink = `${data.author}-${Math.random()
        .toString(36)
        .substring(2)}`;
      data.lastUpdated = Date.now();

      data.wobjectName = getField(wObject, 'name');

      data.votePower = this.state.votePercent * 100;

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
    allowList[rowNum] = _.filter(allowList[rowNum], o => o.id !== id);
    this.setState({ allowList });
  };

  handleAddObjectToIgnoreList = obj => {
    const ignoreList = this.state.ignoreList;
    ignoreList.push(obj);
    this.setState({ ignoreList });
  };

  handleRemoveObjectFromIgnoreList = obj => {
    let ignoreList = this.state.ignoreList;
    ignoreList = _.filter(ignoreList, o => o.id !== obj.id);
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

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      const { form, intl } = this.props;
      const currentField = form.getFieldValue('currentField');
      if (objectFields.newsFilter === currentField) {
        const allowList = _.map(this.state.allowList, rule => _.map(rule, o => o.id)).filter(
          sub => sub.length,
        );
        const ignoreList = _.map(this.state.ignoreList, o => o.id);
        if (!_.isEmpty(allowList) || !_.isEmpty(ignoreList)) this.onSubmit(values);
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
      } else {
        this.onSubmit(values);
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

  validateFieldValue = (rule, value, callback) => {
    const { intl, wObject, form } = this.props;
    const currentField = form.getFieldValue('currentField');
    let currentLocale = form.getFieldValue('currentLocale');

    if (currentLocale === 'auto') currentLocale = 'en-US';

    const filtered = wObject.fields.filter(
      f => f.locale === currentLocale && f.name === currentField,
    );
    if (filtered.map(f => f.body.toLowerCase()).includes(value)) {
      callback(
        intl.formatMessage({
          id: 'append_object_validation_msg',
          defaultMessage: 'The field with this value already exists',
        }),
      );
    }
    callback();
  };

  handleChangeSorting = sortedList => {
    this.props.form.setFieldsValue({ [objectFields.sorting]: sortedList });
  };

  handleRemoveImage = () => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');

    this.setState({ currentImage: [] });
    this.props.form.setFieldsValue({ [currentField]: '' });
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');

    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({ imageUploading: false, currentImage: [newImage] });
    this.props.form.setFieldsValue({ [currentField]: image });
  };

  handleImageChange = e => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');

    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0], MAX_IMG_SIZE[currentField], ALLOWED_IMG_FORMATS)) {
        this.props.onImageInvalid(
          MAX_IMG_SIZE[currentField],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      this.setState({
        imageUploading: true,
        currentImage: [],
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
    }
  };

  handleOnChange = () => {
    const { getFieldValue } = this.props.form;
    const currentField = getFieldValue('currentField');

    if (objectImageFields.includes(currentField)) {
      this.setState({
        imageUploading: false,
        currentImage: [],
      });
    }
  };

  handleLikeClick = () => {
    const { sliderMode, user } = this.props;
    this.setState({
      sliderVisible: sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user)),
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
      if (_.has(rule, 'message')) {
        return {
          ...rule,
          message: intl.formatMessage(
            _.get(rule, 'message.intlId'),
            _.get(rule, 'message.intlMeta'),
          ),
        };
      }
      if (_.has(rule, 'validator')) {
        return { validator: this.validateFieldValue };
      }
      return rule;
    });
  };

  renderContentValue = currentField => {
    const { loading } = this.state;
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
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('menuItemName', {
                rules: this.getFieldRules('menuItemName'),
              })(
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
                  itemsIdsToOmit={_.get(wObject, 'menuItems', []).map(f => f.author_permlink)}
                  handleSelect={this.handleSelectObject}
                  objectType={
                    this.props.currentField === TYPES_OF_MENU_ITEM.LIST ? OBJECT_TYPE.LIST : ''
                  }
                />,
              )}
              {this.state.selectedObject && <ObjectCardView wObject={this.state.selectedObject} />}
            </Form.Item>
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
      case objectFields.tagCloud: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.tagCloud, {
              rules: this.getFieldRules(objectFields.tagCloud),
            })(
              <Input
                className="AppendForm__input"
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'tag_placeholder',
                  defaultMessage: 'Enter tag',
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
        const imageLink = getFieldValue(currentField);
        return (
          <div className="image-wrapper">
            <QuickPostEditorFooter
              imageUploading={this.state.imageUploading}
              handleImageChange={this.handleImageChange}
              currentImages={this.state.currentImage}
              onRemoveImage={this.handleRemoveImage}
              showAddButton={false}
            />
            <span>
              {intl.formatMessage({
                id: 'or',
                defaultMessage: 'or',
              })}
            </span>
            <Form.Item>
              {getFieldDecorator(currentField, { rules: this.getFieldRules(currentField) })(
                <Input
                  className="AppendForm__input"
                  disabled={loading}
                  placeholder={intl.formatMessage({
                    id: 'photo_url_placeholder',
                    defaultMessage: 'Photo URL',
                  })}
                />,
              )}
            </Form.Item>
            {imageLink && (
              <div className="AppendForm__previewWrap">
                {currentField === objectFields.avatar ? (
                  <Avatar shape="square" size={100} src={imageLink} className="avatar" />
                ) : (
                  <div
                    style={{
                      backgroundImage: `url(${imageLink})`,
                    }}
                    className="background"
                  />
                )}
              </div>
            )}
          </div>
        );
      }
      case objectFields.title: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.title, {
              rules: this.getFieldRules(objectFields.title),
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
              <Input
                className={classNames('AppendForm__input', {
                  'validation-error': !this.state.isSomeValue,
                })}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'work_time',
                  defaultMessage: 'Work time',
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
                autosize={{ minRows: 4, maxRows: 8 }}
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
                autosize={{ minRows: 4, maxRows: 8 }}
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
                rules: this.getFieldRules(websiteFields.title),
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
                rules: this.getFieldRules(websiteFields.link),
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
      case objectFields.button: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(buttonFields.title, {
                rules: this.getFieldRules(buttonFields.title),
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
                rules: this.getFieldRules(buttonFields.link),
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
              {getFieldDecorator(phoneFields.name, { rules: this.getFieldRules(phoneFields.name) })(
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
          getListItems(wObject, true).map(item => ({
            id: item.author_permlink,
            content: <ObjectCardView wObject={getClientWObj(item)} />,
          })) || [];
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
              {getFieldDecorator(ratingFields.category, {
                rules: this.getFieldRules(ratingFields.category),
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
      default:
        return null;
    }
  };

  render() {
    const { intl, currentLocale, currentField, form, followingList, wObject } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading } = this.state;

    const isCustomSortingList =
      wObject.object_type &&
      wObject.object_type.toLowerCase() === OBJECT_TYPE.LIST &&
      form.getFieldValue('currentField') === objectFields.sorting;

    const languageOptions = [];
    if (currentLocale === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_language" defaultMessage="Select your language" />
        </Select.Option>,
      );
    }

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
      if (_.includes(TYPES_OF_MENU_ITEM, option)) {
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
            <Select disabled={loading} style={{ width: '100%' }}>
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
            initialValue: currentLocale,
          })(
            <Select
              className={classNames({ AppendForm__hidden: isCustomSortingList })}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {languageOptions}
            </Select>,
          )}
        </Form.Item>

        {this.renderContentValue(getFieldValue('currentField'))}

        <LikeSection
          onVotePercentChange={this.calculateVoteWorth}
          votePercent={this.state.votePercent}
          voteWorth={this.state.voteWorth}
          form={form}
          sliderVisible={this.state.sliderVisible}
          onLikeClick={this.handleLikeClick}
          disabled={loading}
        />

        {followingList.includes(wObject.author_permlink) ? null : (
          <FollowObjectForm loading={loading} form={form} />
        )}

        {getFieldValue('currentField') !== 'auto' && (
          <Form.Item className="AppendForm__bottom__submit">
            <Button type="primary" loading={loading} disabled={loading} onClick={this.handleSubmit}>
              <FormattedMessage
                id={loading ? 'post_send_progress' : 'append_send'}
                defaultMessage={loading ? 'Submitting' : 'Suggest'}
              />
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  }
}
