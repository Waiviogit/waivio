import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import { Form, Input, Select } from 'antd';
import uuidv4 from 'uuid/v4';
import {
  supportedObjectFields,
  objectFields,
  socialObjectFields,
} from '../../../common/constants/listOfFields';
import Action from '../Button/Action';
import requiresLogin from '../../auth/requiresLogin';
import EditorInput from './EditorInput';
import withEditor from './withEditor';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import './Editor.less';
import { getLanguageText } from '../../translations';
import LANGUAGES from '../../translations/languages';
import { getField } from '../../objects/WaivioObject';
import QuickPostEditorFooter from '../QuickPostEditor/QuickPostEditorFooter';
import { isValidImage } from '../../helpers/image';

@injectIntl
@requiresLogin
@Form.create()
@withEditor
class AppendObjectPostEditor extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
    currentLocaleInList: PropTypes.shape().isRequired,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    loading: PropTypes.bool,
    saving: PropTypes.bool,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    currentField: PropTypes.string,
    changeCurrentField: PropTypes.func,
    changeCurrentLocale: PropTypes.func,
  };

  static defaultProps = {
    user: {},
    topics: [],
    body: '',
    currentLocaleInList: { id: 'auto', name: '', nativeName: '' },
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    wobject: { tag: '' },
    changeCurrentField: () => {},
    changeCurrentLocale: () => {},
    currentField: 'name',
    onDelete: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      currentLocaleInList: this.props.currentLocaleInList.id,
      bodyHTML: '',
      value: '',
      imageUploading: false,
      currentImage: [],
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const select = ReactDOM.findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { topics, body } = this.props;
    if (!_.isEqual(topics, nextProps.topics) || body !== nextProps.body) {
      this.setValues(nextProps);
    }
  }

  onUpdate() {
    _.throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  }

  setBodyAndRender(body, value) {
    this.setState({
      body,
      value,
      bodyHTML: remarkable.render(body),
    });
  }

  getInitialValue = (wobject, fieldName) => {
    const { currentField, currentLocaleInList } = this.props;

    const filtered =
      wobject.fields &&
      wobject.fields
        .filter(field => field.name === currentField && field.locale === currentLocaleInList.id)
        .sort((a, b) => b.weight - a.weight);

    if (!filtered || !filtered.length) return '';

    try {
      const parsed = JSON.parse(filtered[0].body);
      return parsed[fieldName];
    } catch (e) {
      return filtered[0].body;
    }
  };

  handleRemoveImage = () => {
    this.setState({ currentImage: [] });
    this.props.form.setFieldsValue({ image: '' });
    this.onUpdate();
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({ imageUploading: false, currentImage: [newImage] });
    this.props.form.setFieldsValue({ image });
    this.onUpdate();
  };

  handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.props.onImageInvalid();
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
      e.target.value = '';
    }
  }

  handleChangeLocale = localeToChange => {
    const { form, changeCurrentLocale } = this.props;
    const currValue = form.getFieldValue('value');
    changeCurrentLocale(localeToChange);
    form.setFieldsValue({ value: currValue });
    // this.setState({ body: '' });
    this.onUpdate();
  };

  handleChangeField = fieldToChange => {
    const { changeCurrentField } = this.props;
    this.setState({ body: '' });
    changeCurrentField(fieldToChange);
  };

  handleDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onDelete();
  }

  validateFieldValue = (rule, value, callback) => {
    const { intl, wobject, currentLocaleInList, currentField } = this.props;
    const filtered = wobject.fields.filter(
      f => f.locale === currentLocaleInList.id && f.name === currentField,
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

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) this.props.onError();
      else {
        const valuesToSend = {
          ...values,
          preview: this.state.body,
        };
        this.props.onSubmit(valuesToSend);
      }
    });
  }

  throttledUpdate() {
    const { form, user } = this.props;
    const values = form.getFieldsValue();

    const getBody = val => (val.body ? `<br /><br />${val.body}` : '');

    const getValues = valuesField => {
      const { body, ...rest } = valuesField;
      const items = _.pickBy(rest, _.identity);
      const list = _.map(items, (val, key) => `${key}: ${val} <br />`);
      return list.join(' ');
    };

    this.setBodyAndRender(
      `${this.props.intl.formatMessage(
        {
          id: 'updates_in_object1',
          defaultMessage: 'I recommend to add field:',
        },
        {
          user: user.name,
        },
      )} 
      ${getValues(values)} in '${getField(
        this.props.wobject,
        'name',
      )}' ${this.props.intl.formatMessage({
        id: 'object',
        defaultMessage: 'object',
      })} ${this.props.intl.formatMessage(
        {
          id: 'preview_locale',
          defaultMessage: 'in {locale} locale',
        },
        {
          locale: this.props.currentLocaleInList.name,
        },
      )}. ${getBody(values)}`,
    );
  }

  renderContentValue = currentField => {
    const { intl, wobject } = this.props;
    const { getFieldDecorator } = this.props.form;

    switch (currentField) {
      case objectFields.name: {
        return (
          <Form.Item>
            {getFieldDecorator('name', {
              initialValue: this.getInitialValue(wobject, this.props.currentField),
              rules: [
                {
                  transform: value => value.toLowerCase(),
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
                ref={value => {
                  this.value = value;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder={intl.formatMessage({
                  id: 'value_placeholder',
                  defaultMessage: 'Add value',
                })}
              />,
            )}
          </Form.Item>
        );
      }
      case objectFields.backgroundImage:
      case objectFields.avatarImage: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('image')(
                <Input onChange={this.onUpdate} className="Editor__hidden" />,
              )}
            </Form.Item>
            <QuickPostEditorFooter
              imageUploading={this.state.imageUploading}
              handleImageChange={this.handleImageChange}
              currentImages={this.state.currentImage}
              onRemoveImage={this.handleRemoveImage}
            />
          </React.Fragment>
        );
      }
      case objectFields.description: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('descriptionShort', {
                initialValue: this.getInitialValue(wobject, 'descriptionShort'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'description_short',
                    defaultMessage: 'Short description',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('descriptionFull', {
                initialValue: this.getInitialValue(wobject, 'descriptionFull'),
                rules: [
                  {
                    max: 255,
                    message: intl.formatMessage({
                      id: 'value_error_too_long',
                      defaultMessage: "Value can't be longer than 255 characters.",
                    }),
                  },
                  {
                    validator: this.validateFieldValue,
                  },
                ],
              })(
                <Input.TextArea
                  onChange={this.onUpdate}
                  className="Editor__input"
                  autosize={{ minRows: 4, maxRows: 8 }}
                  placeholder={intl.formatMessage({
                    id: 'description_full',
                    defaultMessage: 'Full description',
                  })}
                />,
              )}
            </Form.Item>
          </React.Fragment>
        );
      }
      case objectFields.location: {
        return (
          <React.Fragment>
            <Form.Item>
              {getFieldDecorator('locationCountry', {
                initialValue: this.getInitialValue(wobject, 'locationCountry'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_country',
                    defaultMessage: 'Country',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locationCity', {
                initialValue: this.getInitialValue(wobject, 'locationCity'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_city',
                    defaultMessage: 'City',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locationStreet', {
                initialValue: this.getInitialValue(wobject, 'locationStreet'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_street',
                    defaultMessage: 'Street',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locationAccommodation', {
                initialValue: this.getInitialValue(wobject, 'locationAccommodation'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_accommodation',
                    defaultMessage: 'Accommodation',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('postCode', {
                initialValue: this.getInitialValue(wobject, 'postCode'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'post_code',
                    defaultMessage: 'Post Code',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locationLatitude', {
                initialValue: this.getInitialValue(wobject, 'locationLatitude'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_latitude',
                    defaultMessage: 'Latitude',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locationLongitude', {
                initialValue: this.getInitialValue(wobject, 'locationLongitude'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'location_longitude',
                    defaultMessage: 'Longitude',
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
            <Form.Item>
              {getFieldDecorator('website', {
                initialValue: this.getInitialValue(wobject, 'website'),
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
                  onChange={this.onUpdate}
                  className="Editor__input"
                  placeholder={intl.formatMessage({
                    id: 'profile_website',
                    defaultMessage: 'Website',
                  })}
                />,
              )}
            </Form.Item>

            {_.map(socialObjectFields, profile => (
              <Form.Item key={profile.id}>
                {getFieldDecorator(`link${profile.name}`, {
                  initialValue: this.getInitialValue(wobject, `link${profile.name}`),
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
                    onChange={this.onUpdate}
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
          </React.Fragment>
        );
      }
      default:
        return null;
    }
  };

  render() {
    const { intl, form, loading, saving, currentField } = this.props;
    const { getFieldDecorator } = form;
    const { body, bodyHTML, currentLocaleInList } = this.state;

    const { words, minutes } = readingTime(bodyHTML);

    const languageOptions = [];

    if (currentLocaleInList === 'auto') {
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

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })} - Waivio
          </title>
        </Helmet>
        <div className="ant-form-item-label label Editor__appendTitles">
          <FormattedMessage id="suggest1" defaultMessage="I suggest to add field" />
        </div>
        <Select
          defaultValue={this.props.currentField}
          style={{ width: '100%' }}
          onChange={this.handleChangeField}
        >
          {_.map(supportedObjectFields, option => (
            <Select.Option key={option} value={option} className="Topnav__search-autocomplete">
              {option}
            </Select.Option>
          ))}
        </Select>
        <div className="ant-form-item-label Editor__appendTitles">
          <FormattedMessage id="suggest2" defaultMessage="With language" />
        </div>
        <Select
          defaultValue={this.props.currentLocaleInList.id}
          value={this.props.currentLocaleInList.id}
          style={{ width: '100%' }}
          onChange={this.handleChangeLocale}
        >
          {languageOptions}
        </Select>

        <div className="ant-form-item-label Editor__appendTitles">
          <FormattedMessage id="suggest3" defaultMessage="Value" />
        </div>
        {this.renderContentValue(currentField)}
        <Form.Item>
          {getFieldDecorator('body', {
            initialValue: '',
          })(
            <EditorInput
              rows={12}
              addon={
                <FormattedMessage
                  id="reading_time"
                  defaultMessage={'{words} words / {min} min read'}
                  values={{
                    words,
                    min: Math.ceil(minutes),
                  }}
                />
              }
              onChange={this.onUpdate}
              onImageUpload={this.props.onImageUpload}
              onImageInvalid={this.props.onImageInvalid}
              inputId={'editor-inputfile'}
            />,
          )}
        </Form.Item>
        {body && (
          <Form.Item
            label={
              <span className="Editor__label">
                <FormattedMessage id="preview" defaultMessage="Preview" />
              </span>
            }
          >
            <BodyContainer full body={body} />
          </Form.Item>
        )}
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="warning" defaultMessage="Warning!" />
            </span>
          }
        >
          <BodyContainer
            full
            body={`This action extends object will be created by Waivio Bot. And you will get 70% of Author rewards. You do not spend additional resource credits!`}
          />
        </Form.Item>
        <br />
        <div className="Editor__bottom">
          <span className="Editor__bottom__info">
            <i className="iconfont icon-markdown" />{' '}
            <FormattedMessage
              id="markdown_supported"
              defaultMessage="Styling with markdown supported"
            />
          </span>
          <div className="Editor__bottom__right">
            {saving && (
              <span className="Editor__bottom__right__saving">
                <FormattedMessage id="saving" defaultMessage="Saving..." />
              </span>
            )}
            <Form.Item className="Editor__bottom__submit">
              {loading ? (
                <Action primary big loading={loading} disabled={loading}>
                  <FormattedMessage
                    id={loading ? 'post_send_progress' : 'post_update_send'}
                    defaultMessage={loading ? 'Submitting' : 'Update post'}
                  />
                </Action>
              ) : (
                <Action primary big loading={loading} disabled={loading}>
                  <FormattedMessage
                    id={loading ? 'post_send_progress' : 'post_send'}
                    defaultMessage={loading ? 'Submitting' : 'Post'}
                  />
                </Action>
              )}
            </Form.Item>
          </div>
        </div>
      </Form>
    );
  }
}

export default AppendObjectPostEditor;
