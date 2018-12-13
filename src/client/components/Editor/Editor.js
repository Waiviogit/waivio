import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import { Checkbox, Form, Input, Select, Button } from 'antd';
import { rewardsValues } from '../../../common/constants/rewards';
import Action from '../Button/Action';
import requiresLogin from '../../auth/requiresLogin';
import withEditor from './withEditor';
import EditorInput from './EditorInput';
import EditorObject from '../EditorObject/EditorObject';
import { getClientWObj } from '../../adapters';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import { WAIVIO_META_FIELD_NAME, MAX_NEW_OBJECTS_NUMBER } from '../../../common/constants/waivio';
import {
  setInitialInfluence,
  changeObjInfluenceHandler,
  removeObjInfluenceHandler,
} from '../../helpers/wObjInfluenceHelper';
import './Editor.less';

@injectIntl
@requiresLogin
@Form.create()
@withEditor
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    waivioData: PropTypes.shape(),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
    saving: PropTypes.bool,
    draftId: PropTypes.string,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    onCreateObject: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    topics: [],
    waivioData: {},
    body: '',
    reward: rewardsValues.half,
    upvote: true,
    recentTopics: [],
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    draftId: null,
    onUpdate: () => {},
    onDelete: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
    onCreateObject: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
      linkedObjects: [],
      canCreateNewObject: true,
      isValid: true,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.setValues = this.setValues.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddLinkedObject = this.handleAddLinkedObject.bind(this);
    this.handleCreateObject = this.handleCreateObject.bind(this);
    this.handleRemoveObject = this.handleRemoveObject.bind(this);
    this.handleChangeInfluence = this.handleChangeInfluence.bind(this);
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
    const { title, topics, waivioData, body, reward, upvote, draftId } = this.props;
    if (
      title !== nextProps.title ||
      !_.isEqual(topics, nextProps.topics) ||
      !_.isEqual(waivioData, nextProps.waivioData) ||
      body !== nextProps.body ||
      reward !== nextProps.reward ||
      upvote !== nextProps.upvote ||
      (draftId && nextProps.draftId === null)
    ) {
      this.setValues(nextProps);
    }
  }

  onUpdate() {
    _.throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  }

  setValues(post) {
    // NOTE: Used to rollback damaged drafts - https://github.com/busyorg/busy/issues/1412
    // Might be deleted after a while.
    const { form } = this.props;

    let reward = rewardsValues.half;
    if (
      post.reward === rewardsValues.all ||
      post.reward === rewardsValues.half ||
      post.reward === rewardsValues.none
    ) {
      reward = post.reward;
    }

    form.setFieldsValue({
      title: post.title,
      body: post.body,
      reward,
      upvote: post.upvote,
    });
    this.setBodyAndRender(post.body);
  }

  setBodyAndRender(body) {
    this.setState({
      body,
      bodyHTML: remarkable.render(body),
    });
  }

  checkNewObjects() {
    const isObjectsCreated = !this.state.linkedObjects.some(obj => obj.isNew);
    this.setState({ isValid: isObjectsCreated });
    return !isObjectsCreated;
  }

  throttledUpdate() {
    const { linkedObjects } = this.state;
    const { form } = this.props;

    const values = form.getFieldsValue();
    this.setBodyAndRender(values.body);

    // if (Object.values(form.getFieldsError()).filter(e => e).length > 0) return;

    const topics = linkedObjects
      .sort((a, b) => b.influence.value - a.influence.value)
      .slice(0, 4)
      .map(obj => obj.name);
    const wobjects = linkedObjects.map(obj => ({
      author_permlink: obj.id,
      percent: obj.influence.value,
      isNew: Boolean(obj.isNew),
    }));

    this.props.onUpdate({ ...values, topics, [WAIVIO_META_FIELD_NAME]: { wobjects } });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { linkedObjects } = this.state;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.checkNewObjects() || err) {
        this.props.onError();
      } else {
        const topics = linkedObjects
          .sort((a, b) => b.influence.value - a.influence.value)
          .slice(0, 4)
          .map(obj => obj.name);
        const wobjects = linkedObjects.map(obj => ({
          author_permlink: obj.id,
          percent: obj.influence.value,
        }));
        this.props.onSubmit({ ...values, topics, [WAIVIO_META_FIELD_NAME]: { wobjects } });
      }
    });
  }

  handleDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onDelete();
  }

  handleAddLinkedObject(wObject) {
    const selectedObj = wObject.isNew
      ? getClientWObj({
          ...wObject,
          author_permlink: `${this.props.user.name}-${wObject.author_permlink}`,
        })
      : wObject;
    this.setState(prevState => {
      const linkedObjects = prevState.linkedObjects.some(obj => obj.id === selectedObj.id)
        ? prevState.linkedObjects
        : setInitialInfluence(prevState.linkedObjects, selectedObj);
      return {
        linkedObjects,
        canCreateNewObject: linkedObjects.length < MAX_NEW_OBJECTS_NUMBER,
      };
    }, this.onUpdate());
  }

  handleCreateObject(wObject) {
    this.setState(prevState => {
      const linkedObjects = prevState.linkedObjects.map(obj =>
        obj.id === wObject.id ? { ...obj, isCreating: true } : obj,
      );
      return { linkedObjects };
    });
    this.props.onCreateObject(
      wObject,
      res => {
        this.setState(prevState => {
          const linkedObjects = prevState.linkedObjects.map(obj =>
            obj.id === wObject.id
              ? {
                  ...obj,
                  id: `${res.objectAuthor}_${res.objectPermlink}`,
                  isNew: false,
                  isCreating: false,
                }
              : obj,
          );
          return {
            linkedObjects,
            isValid:
              prevState.isValid || !(prevState.isValid || linkedObjects.some(obj => obj.isNew)),
          };
        });
      },
      () => {
        this.setState(prevState => {
          const linkedObjects = prevState.linkedObjects.map(obj =>
            obj.id === wObject.id ? { ...obj, isCreating: false } : obj,
          );
          return { linkedObjects };
        });
      },
    );
  }

  handleRemoveObject(wObject) {
    this.setState(prevState => {
      const linkedObjects = removeObjInfluenceHandler(prevState.linkedObjects, wObject);
      return { linkedObjects, canCreateNewObject: linkedObjects.length < MAX_NEW_OBJECTS_NUMBER };
    }, this.onUpdate());
  }

  handleChangeInfluence(wObj, influence) {
    this.setState(prevState => {
      const linkedObjects = changeObjInfluenceHandler(prevState.linkedObjects, wObj, influence);
      return { linkedObjects };
    });
  }

  render() {
    const { intl, form, loading, isUpdating, saving, draftId } = this.props;
    const { getFieldDecorator } = form;
    const { body, bodyHTML, linkedObjects, isValid, canCreateNewObject } = this.state;

    const { words, minutes } = readingTime(bodyHTML);

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })} - Busy
          </title>
        </Helmet>
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="title" defaultMessage="Title" />
            </span>
          }
        >
          {getFieldDecorator('title', {
            initialValue: '',
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
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('body', {
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
              placeholder={intl.formatMessage({
                id: 'story_placeholder',
                defaultMessage: 'Add content',
              })}
              onChange={this.onUpdate}
              onImageUpload={this.props.onImageUpload}
              onImageInvalid={this.props.onImageInvalid}
              inputId={'editor-inputfile'}
              canCreateNewObject={canCreateNewObject}
              onAddLinkedObject={this.handleAddLinkedObject}
            />,
          )}
        </Form.Item>
        <div>
          <div className="ant-form-item-label">
            <label className="Editor__label" htmlFor="title">
              <FormattedMessage id="editor_linked_objects" defaultMessage="Linked objects" />
            </label>
          </div>
          {canCreateNewObject && (
            <SearchObjectsAutocomplete
              handleSelect={this.handleAddLinkedObject}
              canCreateNewObject={canCreateNewObject}
              linkedObjectsIds={linkedObjects.map(obj => obj.id)}
            />
          )}
          {Boolean(linkedObjects.length) &&
            linkedObjects.map(obj => (
              <EditorObject
                key={obj.id}
                wObject={obj}
                isValid={isValid}
                handleCreateObject={this.handleCreateObject}
                handleRemoveObject={this.handleRemoveObject}
                handleChangeInfluence={this.handleChangeInfluence}
              />
            ))}
        </div>
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
            <Form.Item className="Editor__bottom__cancel">
              {draftId && (
                <Button type="danger" size="large" disabled={loading} onClick={this.handleDelete}>
                  <FormattedMessage id="draft_delete" defaultMessage="Delete this draft" />
                </Button>
              )}
            </Form.Item>
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

export default Editor;
