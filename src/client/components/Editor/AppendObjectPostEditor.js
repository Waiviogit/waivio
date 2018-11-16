import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import { Checkbox, Form, Input, Select } from 'antd';
import { supportedObjectFields } from '../../../common/constants/listOfFields';
import { rewardsValues } from '../../../common/constants/rewards';
import Action from '../Button/Action';
import requiresLogin from '../../auth/requiresLogin';
import EditorInput from './EditorInput';
import withEditor from './withEditor';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import './Editor.less';
import { getLanguageText } from '../../translations';
import LANGUAGES from '../../translations/languages';

@injectIntl
@requiresLogin
@Form.create()
@withEditor
class AppendObjectPostEditor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
    title: PropTypes.string,
    currentLocaleInList: PropTypes.shape().isRequired,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
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
    title: '',
    topics: [],
    body: '',
    reward: rewardsValues.half,
    upvote: true,
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
      linkedObjects: [],
      value: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.setValues = this.setValues.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
  }

  componentDidMount() {
    this.setValues(this.props);

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
    const { title, topics, body, reward, upvote } = this.props;
    if (
      title !== nextProps.title ||
      !_.isEqual(topics, nextProps.topics) ||
      body !== nextProps.body ||
      reward !== nextProps.reward ||
      upvote !== nextProps.upvote
    ) {
      this.setValues(nextProps);
    }
  }

  onUpdate() {
    _.throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  }

  setValues(post) {
    let reward = rewardsValues.half;
    if (
      post.reward === rewardsValues.all ||
      post.reward === rewardsValues.half ||
      post.reward === rewardsValues.none
    ) {
      reward = post.reward;
    }

    this.props.form.setFieldsValue({
      reward,
      upvote: post.upvote,
    });

    this.setBodyAndRender(post.body, post.value);
  }

  setBodyAndRender(body, value) {
    this.setState({
      body,
      value,
      bodyHTML: remarkable.render(body),
    });
  }

  throttledUpdate() {
    const { form } = this.props;

    const values = form.getFieldsValue();
    this.setBodyAndRender(
      `${this.props.intl.formatMessage({
        id: 'updates_in_object1',
        defaultMessage: 'I recommend to add field:',
      })} "${this.props.currentField}" ${this.props.intl.formatMessage({
        id: 'updates_in_object2',
        defaultMessage: 'with value',
      })} ${values.value} ${this.props.intl.formatMessage({
        id: 'updates_in_object3',
        defaultMessage: 'to',
      })} ${this.props.wobject.tag} ${values.body}`,
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) this.props.onError();
      else {
        const valuesToSend = {
          ...values,
          topics: ['appendwaivioobject'],
          locale: this.state.currentLocaleInList,
        };
        this.props.onSubmit(valuesToSend);
      }
    });
  }

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
    this.props.changeCurrentLocale(localeToChange);
    this.setState({ body: '' });
  };
  render() {
    const { intl, form, loading, isUpdating, saving } = this.props;
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
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="suggest3" defaultMessage="Value" />
            </span>
          }
        >
          {getFieldDecorator('value', {
            initialValue: '',
            rules: [
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
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="title" defaultMessage="Title" />
            </span>
          }
        >
          {getFieldDecorator('title', {
            initialValue: `${intl.formatMessage({
              id: 'updates_in_object1',
              defaultMessage: 'I recommend to add field',
            })} "${this.props.currentField}" ${intl.formatMessage({
              id: 'updates_in_object3',
              defaultMessage: 'to',
            })} ${this.props.wobject.tag}`,
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'title_error_empty',
                  defaultMessage: 'title_error_empty',
                }),
              },
              {
                max: 255,
                message: intl.formatMessage({
                  id: 'title_error_too_long',
                  defaultMessage: "Title can't be longer than 255 characters.",
                }),
              },
            ],
          })(
            <Input
              ref={title => {
                this.title = title;
              }}
              onChange={this.onUpdate}
              className="Editor__title"
              placeholder={intl.formatMessage({
                id: 'title_placeholder',
                defaultMessage: 'Add title',
              })}
              disabled
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('body', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'story_error_empty',
                  defaultMessage: "Story content can't be empty.",
                }),
              },
            ],
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
          className={classNames({ Editor__hidden: isUpdating })}
          label={
            <span className="Editor__label">
              <FormattedMessage id="reward" defaultMessage="Reward" />
            </span>
          }
        >
          {getFieldDecorator('reward')(
            <Select onChange={this.onUpdate} disabled={isUpdating}>
              <Select.Option value={rewardsValues.all}>
                <FormattedMessage id="reward_option_100" defaultMessage="100% Steem Power" />
              </Select.Option>
              <Select.Option value={rewardsValues.half}>
                <FormattedMessage id="reward_option_50" defaultMessage="50% SBD and 50% SP" />
              </Select.Option>
              <Select.Option value={rewardsValues.none}>
                <FormattedMessage id="reward_option_0" defaultMessage="Declined" />
              </Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
          {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage id="like_post" defaultMessage="Like this post" />
            </Checkbox>,
          )}
        </Form.Item>
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
              {isUpdating ? (
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
