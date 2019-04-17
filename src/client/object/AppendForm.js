import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Input, message, Select, Avatar, Rate, Icon } from 'antd';
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
} from '../../common/constants/listOfFields';
import {
  getObject,
  getRewardFund,
  getRate,
  getAuthenticatedUser,
  getVotingPower,
  getVotePercent,
  getFollowingObjectsList,
} from '../reducers';
import LANGUAGES from '../translations/languages';
import { PRIMARY_COLOR } from '../../common/constants/waivio';
import { getLanguageText } from '../translations';
import QuickPostEditorFooter from '../components/QuickPostEditor/QuickPostEditorFooter';
import { regexCoordsLatitude, regexCoordsLongitude } from '../components/Maps/mapHelper';
import Map from '../components/Maps/Map';
import './AppendForm.less';
import { getField } from '../objects/WaivioObject';
import { appendObject } from '../object/appendActions';
import { isValidImage } from '../helpers/image';
import withEditor from '../components/Editor/withEditor';
import {
  MAX_IMG_SIZE,
  ALLOWED_IMG_FORMATS,
  websiteTitleRegExp,
  objectURLValidationRegExp,
  phoneNameValidationRegExp,
  emailValidationRegExp,
} from '../../common/constants/validation';
import { getHasDefaultSlider, getVoteValue } from '../helpers/user';
import LikeSection from './LikeSection';
import { getFieldWithMaxWeight } from './wObjectHelper';
import FollowObjectForm from './FollowObjectForm';
import { followObject, rateObject } from '../object/wobjActions';
import SortingList from '../components/DnDList/DnDList';
import CatalogItem from './Catalog/CatalogItem';
import { getClientWObj } from '../adapters';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    wObject: getObject(state),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    sliderMode: getVotingPower(state),
    defaultVotePercent: getVotePercent(state),
    followingList: getFollowingObjectsList(state),
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

  onSubmit = async form => {
    this.setState({ loading: true });

    const {
      form: { getFieldValue },
      wObject,
    } = this.props;

    const postData = this.getNewPostData(form);

    /* eslint-disable no-restricted-syntax */
    for (const data of postData) {
      try {
        /* eslint-disable no-await-in-loop */
        const response = await this.props.appendObject(data);

        if (objectFields.rating === form.currentField && form.rate) {
          const { author, permlink } = response.value;
          await this.props.rateObject(
            author,
            permlink,
            wObject.author_permlink,
            ratePercent[form.rate - 1],
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

  getNewPostData = form => {
    const { wObject } = this.props;
    const { getFieldValue } = this.props.form;
    const { body, preview, currentField, currentLocale, like, follow, ...rest } = form;

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
      case objectFields.email: {
        fieldBody.push(rest[currentField]);
        break;
      }
      case objectFields.sorting: {
        fieldBody.push(JSON.stringify(rest[objectFields.sorting]));
        break;
      }
      // case objectFields.website: {
      //   fieldBody.push(rest[websiteFields.link]);
      //   break;
      // }
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

      data.body = `@${data.author} added ${field}(${langReadable}):\n ${bodyField.replace(
        /[{}"]/g,
        '',
      )}`;

      data.title = '';
      let fieldsObject = {
        name: field,
        body: bodyField,
        locale,
      };

      // if (field === objectFields.website) {
      //   fieldsObject = {
      //     ...fieldsObject,
      //     [websiteFields.title]: form[websiteFields.title],
      //   };
      // }

      if (field === objectFields.phone) {
        fieldsObject = {
          ...fieldsObject,
          [phoneFields.number]: form[phoneFields.number],
        };

        data.body = `@${data.author} added ${field}(${langReadable}):\n ${bodyField.replace(
          /[{}"]/g,
          '',
        )} ${form[phoneFields.number].replace(/[{}"]/g, '')}  `;
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
      if (err || this.checkRequiredField()) {
        // this.props.onError();
      } else {
        this.onSubmit(values);
      }
    });
  };

  checkRequiredField = () => {
    const { form } = this.props;
    const currentField = form.getFieldValue('currentField');

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
      case objectFields.name: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.name, {
              rules: [
                {
                  transform: value => value && value.toLowerCase(),
                },
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Name' },
                  ),
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
                  validator: this.validateFieldValue,
                },
              ],
            })(
              <Input
                className="AppendForm__title"
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
              {getFieldDecorator(currentField, {
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      {
                        field: intl.formatMessage({
                          id: 'photo_url_placeholder',
                          defaultMessage: 'Photo URL',
                        }),
                      },
                    ),
                  },
                  {
                    pattern: objectURLValidationRegExp,
                    message: intl.formatMessage({
                      id: 'image_link_validation',
                      defaultMessage: 'Please enter valid link',
                    }),
                  },
                ],
              })(
                <Input
                  className="AppendForm__title"
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
              rules: [
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
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Short description' },
                  ),
                },
                {
                  validator: this.validateFieldValue,
                },
              ],
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
      case objectFields.price: {
        return (
          <Form.Item>
            {getFieldDecorator(objectFields.price, {
              rules: [
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
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Short description' },
                  ),
                },
                {
                  validator: this.validateFieldValue,
                },
              ],
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
              rules: [
                {
                  max: 512,
                  message: intl.formatMessage(
                    {
                      id: 'value_error_long',
                      defaultMessage: "Value can't be longer than 512 characters.",
                    },
                    { value: 512 },
                  ),
                },
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Full description' },
                  ),
                },
                {
                  validator: this.validateFieldValue,
                },
              ],
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
              {getFieldDecorator(addressFields.country, {
                rules: [
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
                    validator: this.validateFieldValue,
                  },
                ],
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
            <Form.Item>
              {getFieldDecorator(addressFields.city, {
                rules: [
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
                    validator: this.validateFieldValue,
                  },
                ],
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
              {getFieldDecorator(addressFields.street, {
                rules: [
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
                    validator: this.validateFieldValue,
                  },
                ],
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
              {getFieldDecorator(addressFields.accommodation, {
                rules: [
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
                    validator: this.validateFieldValue,
                  },
                ],
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
            {combinedFieldValidationMsg}
          </React.Fragment>
        );
      }
      case objectFields.map: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(mapFields.latitude, {
                rules: [
                  {
                    pattern: regexCoordsLatitude,
                    message: intl.formatMessage(
                      {
                        id: 'value_invalid_latitude',
                        defaultMessage: 'Should be number from -85 to 85',
                      },
                      { value: 100 },
                    ),
                  },
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Latitude' },
                    ),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
                rules: [
                  {
                    pattern: regexCoordsLongitude,
                    message: intl.formatMessage(
                      {
                        id: 'value_invalid_longitude',
                        defaultMessage: 'Should be number from -180 to 180',
                      },
                      { value: 100 },
                    ),
                  },
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Longitude' },
                    ),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
            <Map
              markers={[
                {
                  lat: (mapFields.latitude && Number(getFieldValue(mapFields.latitude))) || 37.22,
                  lng:
                    (mapFields.longitude && Number(getFieldValue(mapFields.longitude))) || -101.39,
                },
              ]}
              setCoordinates={this.setCoordinates}
              wobjects={{ [wObject.id]: wObject }}
              mapHeigth={400}
              centerLat={(mapFields.latitude && Number(getFieldValue(mapFields.latitude))) || 37.22}
              centerLng={
                (mapFields.longitude && Number(getFieldValue(mapFields.longitude))) || -101.39
              }
            />
          </React.Fragment>
        );
      }
      case objectFields.website: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(websiteFields.title, {
                rules: [
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
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Title' },
                    ),
                  },
                  {
                    pattern: websiteTitleRegExp,
                    message: intl.formatMessage({
                      id: 'website_symbols_validation',
                      defaultMessage: 'Please dont use special symbols',
                    }),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
                rules: [
                  {
                    max: 255,
                    message: intl.formatMessage(
                      {
                        id: 'value_error_long',
                        defaultMessage: "Value can't be longer than 255 characters.",
                      },
                      { value: 255 },
                    ),
                  },
                  {
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Website' },
                    ),
                  },
                  {
                    pattern: objectURLValidationRegExp,
                    message: intl.formatMessage({
                      id: 'website_validation',
                      defaultMessage: 'Please enter valid website',
                    }),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
      case objectFields.hashtag: {
        return (
          <Form.Item
            extra={intl.formatMessage({
              id: 'hashtags_extra',
              defaultMessage:
                'Separate #tags with commas. Only lowercase letters, numbers and hyphen character is permitted.',
            })}
          >
            {getFieldDecorator(objectFields.hashtag, {
              initialValue: [],
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Hashtag' },
                  ),
                  type: 'array',
                },
                { validator: this.checkLengthHashtags(intl) },
                { validator: this.checkHashtags(intl) },
                {
                  validator: this.validateFieldValue,
                },
              ],
            })(
              <Select
                className="AppendForm__hashtags"
                mode="tags"
                placeholder={intl.formatMessage({
                  id: 'hashtag_value_placeholder',
                  defaultMessage: 'Add value',
                })}
                disabled={loading}
                dropdownStyle={{ display: 'none' }}
                tokenSeparators={[' ', ',']}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.phone: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator(phoneFields.name, {
                rules: [
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
                    pattern: phoneNameValidationRegExp,
                    message: intl.formatMessage({
                      id: 'website_symbols_validation',
                      defaultMessage: "Please don't use special symbols",
                    }),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
              })(
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
                rules: [
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
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Phone number' },
                    ),
                  },
                  {
                    pattern: phoneNameValidationRegExp,
                    message: intl.formatMessage({
                      id: 'website_symbols_validation',
                      defaultMessage: "Please don't use special symbols",
                    }),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
              rules: [
                {
                  max: 256,
                  message: intl.formatMessage(
                    {
                      id: 'value_error_long',
                      defaultMessage: "Value can't be longer than 100 characters.",
                    },
                    { value: 256 },
                  ),
                },
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Email address' },
                  ),
                },
                {
                  pattern: emailValidationRegExp,
                  message: intl.formatMessage({
                    id: 'email_append_validation',
                    defaultMessage: 'Please enter valid email',
                  }),
                },
                {
                  validator: this.validateFieldValue,
                },
              ],
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
          (wObject.listItems &&
            wObject.listItems.map(item => ({
              id: item.author_permlink,
              content: <CatalogItem wobject={getClientWObj(item)} />,
            }))) ||
          [];
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
                rules: [
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
                    required: true,
                    message: intl.formatMessage(
                      {
                        id: 'field_error',
                        defaultMessage: 'Field is required',
                      },
                      { field: 'Category' },
                    ),
                  },
                  { transform: value => value && value.trim() },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
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
      default:
        return null;
    }
  };

  render() {
    const { currentLocale, currentField, form, followingList, wObject } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading } = this.state;

    const isCustomSortingList =
      wObject.object_type &&
      wObject.object_type.toLowerCase() === 'list' &&
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
