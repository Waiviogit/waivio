import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import { Form, Input, Select } from 'antd';
import uuidv4 from 'uuid/v4';
import { supportedObjectFields, objectImageFields } from '../../../common/constants/listOfFields';
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

  throttledUpdate() {
    const { form, user } = this.props;

    const values = form.getFieldsValue();

    const getBody = val => (val.body ? `<br /><br />${val.body}` : '');

    this.setBodyAndRender(
      `${this.props.intl.formatMessage(
        {
          id: 'updates_in_object1',
          defaultMessage: 'I recommend to add field:',
        },
        {
          user: user.name,
          fieldName: this.props.currentField,
        },
      )} ${this.props.intl.formatMessage({
        id: 'updates_in_object2',
        defaultMessage: 'with value',
      })} '${values.value}' ${this.props.intl.formatMessage({
        id: 'updates_in_object3',
        defaultMessage: 'to',
      })} '${getField(this.props.wobject, 'name')}' ${this.props.intl.formatMessage({
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

  handleDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onDelete();
  }

  handleChangeField = fieldToChange => {
    this.props.changeCurrentField(fieldToChange);
    this.setState({ body: '' });
  };

  handleChangeLocale = localeToChange => {
    const { form, changeCurrentLocale } = this.props;
    const currValue = form.getFieldValue('value');
    changeCurrentLocale(localeToChange);
    form.setFieldsValue({ value: currValue });
    this.setState({ body: '' });
  };

  handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.props.onImageInvalid();
        return;
      }

      this.setState({
        imageUploading: true,
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      e.target.value = '';
    }
  }

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      imageUploading: false,
      currentImage: [newImage],
    });
    this.insertImage(image, imageName);
  };

  render() {
    const { intl, form, loading, saving, currentField } = this.props;
    const { getFieldDecorator } = form;
    const { body, bodyHTML, currentLocaleInList, imageUploading, currentImage } = this.state;

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

    const isImageValueRequire = objectImageFields.includes(currentField);

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
          defaultValue={supportedObjectFields[0]}
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

        <div className="ant-form-item-label label Editor__appendTitles">
          <FormattedMessage id="suggest3" defaultMessage="Value" />
        </div>
        {isImageValueRequire && (
          <QuickPostEditorFooter
            imageUploading={imageUploading}
            handleImageChange={this.handleImageChange}
            currentImages={currentImage}
            onRemoveImage={this.handleRemoveImage}
          />
        )}
        <Form.Item className={classNames({ Editor__hidden: isImageValueRequire })}>
          {getFieldDecorator('value', {
            initialValue: '',
            rules: [
              {
                transform: value => value.toLowerCase(),
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'value_error_empty',
                  defaultMessage: 'Please enter a value',
                }),
              },
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
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="preview" defaultMessage="Preview" />
            </span>
          }
        >
          <BodyContainer full body={body} />
        </Form.Item>

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
