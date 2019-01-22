import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Input, message, Select } from 'antd';
import {
  linkFields,
  objectFields,
  mapFields,
  addressFields,
  socialObjectFields,
  supportedObjectFields,
  websiteFields,
} from '../../common/constants/listOfFields';
import { getObject, getAuthenticatedUserName, getIsAppendLoading } from '../reducers';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import QuickPostEditorFooter from '../components/QuickPostEditor/QuickPostEditorFooter';
import { regexCoordsLatitude, regexCoordsLongitude } from '../components/Maps/mapHelper';
import Map from '../components/Maps/Map';
import './AppendForm.less';
import improve from '../helpers/improve';
import { getField } from '../objects/WaivioObject';
import { appendObject } from '../object/appendActions';
import { isValidImage } from '../helpers/image';
import withEditor from '../components/Editor/withEditor';
import {
  MAX_IMG_SIZE,
  ALLOWED_IMG_FORMATS,
  objectNameValidationRegExp,
  objectURLValidationRegExp,
} from '../../common/constants/validation';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    loading: getIsAppendLoading(state),
  }),
  { appendObject },
)
@injectIntl
@Form.create()
@withEditor
export default class AppendForm extends Component {
  static propTypes = {
    currentField: PropTypes.string,
    currentLocale: PropTypes.string,
    currentUsername: PropTypes.string,
    loading: PropTypes.bool,
    hideModal: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    wObject: PropTypes.shape(),
    form: PropTypes.shape(),
    appendObject: PropTypes.func,
    intl: PropTypes.shape(),
  };

  static defaultProps = {
    currentField: 'auto',
    currentLocale: 'en-US',
    currentUsername: '',
    loading: false,
    hideModal: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
    wObject: {},
    form: {},
    appendObject: () => {},
    intl: {},
  };

  state = {
    isSomeValue: true,
    imageUploading: false,
    currentImage: [],
  };

  onSubmit = form => {
    const data = this.getNewPostData(form);
    data.body = improve(data.body);

    this.props
      .appendObject(data)
      .then(() => {
        this.props.hideModal();

        message.success(
          `You successfully have added the '${data.field.name}' field to '${
            data.wobjectName
          }' object`,
        );
      })
      .catch(err => {
        message.error("Couldn't append object.");
        console.log('err', err);
      });
  };

  onUpdateCoordinate = positionField => e => {
    this.props.form.setFieldsValue({
      [positionField]: Number(e.target.value),
    });
  };

  getNewPostData = form => {
    const { wObject } = this.props;
    const { getFieldValue } = this.props.form;

    const field = getFieldValue('currentField');
    let locale = getFieldValue('currentLocale');

    if (locale === 'auto') locale = 'en-US';

    const data = {};

    const getBody = formField => {
      const { body, preview, currentField, currentLocale, ...rest } = formField;

      switch (currentField) {
        case objectFields.name:
        case objectFields.title:
        case objectFields.description:
        case objectFields.avatar:
        case objectFields.background: {
          return rest[currentField];
        }
        case objectFields.website: {
          return rest[websiteFields.link];
        }
        default:
          return JSON.stringify(rest);
      }
    };

    data.author = this.props.currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    const langReadable = _.filter(LANGUAGES, { id: locale })[0].name;
    data.body = `@${data.author} added ${field}(${langReadable}):\n ${getBody(form).replace(
      /[{}"]/g,
      '',
    )}`;
    data.title = '';
    let fieldsObject = {
      name: field,
      body: getBody(form),
      locale,
    };

    if (field === objectFields.website) {
      fieldsObject = {
        ...fieldsObject,
        [websiteFields.title]: form[websiteFields.title],
      };
    }

    data.field = fieldsObject;

    data.permlink = `${data.author}-${Math.random()
      .toString(36)
      .substring(2)}`;
    data.lastUpdated = Date.now();

    data.wobjectName = getField(wObject, 'name');

    return data;
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
      [mapFields.latitude]: latLng.lat().toFixed(6),
      [mapFields.longitude]: latLng.lng().toFixed(6),
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err || this.checkRequiredField()) {
        // this.props.onError();
      } else {
        const valuesToSend = {
          ...values,
        };
        this.onSubmit(valuesToSend);
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

  renderContentValue = currentField => {
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
        this.state.imageUploading = false;
        this.state.currentImage = [];
        return (
          <React.Fragment>
            <QuickPostEditorFooter
              imageUploading={this.state.imageUploading}
              handleImageChange={this.handleImageChange}
              currentImages={this.state.currentImage}
              onRemoveImage={this.handleRemoveImage}
            />
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
                      { field: currentField },
                    ),
                  },
                ],
              })(<Input className="AppendForm__hidden" />)}
            </Form.Item>
            {getFieldValue(currentField) && (
              <div className="AppendForm__previewWrap">
                <img src={getFieldValue(currentField)} alt="pic" className="AppendForm__preview" />
              </div>
            )}
          </React.Fragment>
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
                placeholder={intl.formatMessage({
                  id: 'description_short',
                  defaultMessage: 'Short description',
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
                      id: 'value_error_too_long',
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
                  placeholder={intl.formatMessage({
                    id: 'location_longitude',
                    defaultMessage: 'Longitude',
                  })}
                />,
              )}
            </Form.Item>
            <Map
              isMarkerShown
              setCoordinates={this.setCoordinates}
              wobject={wObject}
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              lat={Number(getFieldValue(mapFields.latitude)) || 37.22}
              lng={Number(getFieldValue(mapFields.longitude)) || -101.39}
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
                    pattern: objectNameValidationRegExp,
                    message: intl.formatMessage({
                      id: 'validation_special_symbols',
                      defaultMessage: 'Please dont use special symbols like "/", "?", "%", "&"',
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
                    placeholder={profile.name}
                  />,
                )}
              </Form.Item>
            ))}
            {combinedFieldValidationMsg}
          </React.Fragment>
        );
      }
      default:
        return null;
    }
  };

  render() {
    const { currentLocale, currentField, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

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

    supportedObjectFields.forEach(option => {
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
          })(<Select style={{ width: '100%' }}>{fieldOptions}</Select>)}
        </Form.Item>

        <div className="ant-form-item-label AppendForm__appendTitles">
          <FormattedMessage id="suggest2" defaultMessage="With language" />
        </div>

        <Form.Item>
          {getFieldDecorator('currentLocale', {
            initialValue: currentLocale,
          })(<Select style={{ width: '100%' }}>{languageOptions}</Select>)}
        </Form.Item>

        {this.renderContentValue(getFieldValue('currentField'))}

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
