import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import moment from 'moment';
import { Form, Input, Select, Button, Checkbox } from 'antd';
import BTooltip from '../BTooltip';
import { rewardsValues } from '../../../common/constants/rewards';
import Action from '../Button/Action';
import requiresLogin from '../../auth/requiresLogin';
import withEditor from './withEditor';
import EditorInput from './EditorInput';
import LinkedObjects from './LinkedObjects';
import { getClientWObj } from '../../adapters';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import { BENEFICIARY_PERCENT } from '../../helpers/constants';
import {
  WAIVIO_META_FIELD_NAME,
  INVESTARENA_META_FIELD_NAME,
  MAX_NEW_OBJECTS_NUMBER,
} from '../../../common/constants/waivio';
import {
  setInitialInfluence,
  changeObjInfluenceHandler,
  removeObjInfluenceHandler,
} from '../../helpers/wObjInfluenceHelper';
import './Editor.less';
import { currentTime } from '../../../investarena/helpers/currentTime';
import { forecastDateTimeFormat } from '../../../investarena/constants/constantsForecast';
import CreatePostForecast from '../../../investarena/components/CreatePostForecast';

@injectIntl
@requiresLogin
@Form.create()
@withEditor
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    // user: PropTypes.shape().isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    waivioData: PropTypes.shape(),
    // initialForecast: PropTypes.shape(),
    body: PropTypes.string,
    reward: PropTypes.string,
    beneficiary: PropTypes.bool,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
    saving: PropTypes.bool,
    draftId: PropTypes.string,
    initialObjPermlink: PropTypes.string,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    // from withEditor decorator
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    onCreateObject: PropTypes.func,
    getLinkedObjects: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    topics: [],
    waivioData: {},
    initialForecast: {},
    body: '',
    reward: rewardsValues.half,
    beneficiary: true,
    upvote: true,
    recentTopics: [],
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    draftId: null,
    initialObjPermlink: null,
    onUpdate: () => {},
    onDelete: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
    onCreateObject: () => {},
    getLinkedObjects: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
      linkedObjects: [],
      influenceRemain: 0,
      canCreateNewObject: true,
      isLinkedObjectsValid: true,
      forecastValues: { isValid: true },
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
    this.handleForecastChange = this.handleForecastChange.bind(this);
  }

  componentDidMount() {
    this.setValues(this.props);

    if (this.props.initialObjPermlink) {
      this.restoreLinkedObjects(this.props.waivioData.wobjects);
    }
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
    const { title, topics, waivioData, body, reward, beneficiary, upvote, draftId } = this.props;
    if (
      title !== nextProps.title ||
      !_.isEqual(topics, nextProps.topics) ||
      !_.isEqual(waivioData, nextProps.waivioData) ||
      body !== nextProps.body ||
      reward !== nextProps.reward ||
      beneficiary !== nextProps.beneficiary ||
      upvote !== nextProps.upvote ||
      (draftId && nextProps.draftId === null)
    ) {
      this.setValues(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    const { waivioData } = this.props;
    if (!_.isEqual(prevProps.waivioData, waivioData)) {
      this.restoreLinkedObjects(waivioData.wobjects);
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
      name: post.name,
      title: post.title,
      body: post.body,
      reward,
      beneficiary: post.beneficiary,
      upvote: post.upvote,
      [WAIVIO_META_FIELD_NAME]: post.waivioData,
    });
    if (post.initialForecast && !_.isEmpty(post.initialForecast)) {
      this.setState({ forecastValues: post.initialForecast });
    }
    this.setBodyAndRender(post.body);
  }

  setBodyAndRender(body) {
    this.setState({
      body,
      bodyHTML: remarkable.render(body),
    });
  }

  getForecastObject = (forecast, selectForecast) =>
    forecast && !_.isEmpty(forecast)
      ? {
          ...forecast,
          createdAt: moment.utc(currentTime.getTime()).format(forecastDateTimeFormat),
          expiredAt:
            selectForecast === 'Custom'
              ? forecast.expiredAt
              : moment
                  .utc(currentTime.getTime())
                  .add(selectForecast, 'seconds')
                  .format(forecastDateTimeFormat),
          tpPrice: forecast.tpPrice ? parseFloat(forecast.tpPrice) : null,
          slPrice: forecast.slPrice ? parseFloat(forecast.slPrice) : null,
        }
      : null;

  resetLinkedObjects = () => this.setState({ linkedObjects: [], influenceRemain: 0 });

  restoreLinkedObjects(wobjects) {
    if (_.isEmpty(wobjects)) {
      this.resetLinkedObjects();
      return;
    }
    const existingObjectIds = wobjects.filter(wo => !wo.isNew).map(wo => wo.author_permlink);
    this.props.getLinkedObjects(existingObjectIds).then(res => {
      const influenceRemain = 100 - wobjects.reduce((acc, curr) => acc + curr.percent, 0);
      const linkedObjects = wobjects.map(obj =>
        !obj.isNew && res.some(exObj => exObj.id === obj.author_permlink)
          ? {
              ..._.find(res, currObj => currObj.id === obj.author_permlink),
              influence: { value: obj.percent, max: obj.percent + influenceRemain },
            }
          : {
              ...getClientWObj({
                author_permlink: obj.author_permlink,
                fields: [{ name: 'name', body: obj.objectName }],
                isNew: true,
              }),
              influence: { value: obj.percent, max: obj.percent + influenceRemain },
            },
      );
      this.setState({
        linkedObjects,
        influenceRemain,
        canCreateNewObject: linkedObjects.length < MAX_NEW_OBJECTS_NUMBER,
      });
    });
  }

  checkLinkedObjects() {
    const areObjectsCreated = !this.state.linkedObjects.some(obj => obj.isNew);
    const isInfluenceRemain = this.state.influenceRemain !== 0;
    this.setState({
      isLinkedObjectsValid: areObjectsCreated && !isInfluenceRemain,
      isCreatePostClicked: true,
    });
    return !areObjectsCreated || isInfluenceRemain;
  }

  throttledUpdate() {
    const {
      linkedObjects,
      forecastValues: { selectForecast, ...forecast },
    } = this.state;
    const { form } = this.props;

    const values = form.getFieldsValue();
    this.setBodyAndRender(values.body);

    // if (Object.values(form.getFieldsError()).filter(e => e).length > 0) return;

    const topics = [...linkedObjects]
      .sort((a, b) => b.influence.value - a.influence.value)
      .slice(0, 4)
      .map(obj => obj.name);
    const wobjects = linkedObjects.map(obj => ({
      objectName: obj.name,
      author_permlink: obj.id,
      percent: obj.influence.value,
      isNew: Boolean(obj.isNew),
    }));

    this.props.onUpdate({
      ...values,
      topics,
      [WAIVIO_META_FIELD_NAME]: { wobjects },
      [INVESTARENA_META_FIELD_NAME]: this.getForecastObject(forecast, selectForecast),
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { linkedObjects, forecastValues } = this.state;

    this.props.form.validateFieldsAndScroll((err, values) => {
      const { isValid, selectForecast, ...forecast } = forecastValues;
      if (this.checkLinkedObjects() || !isValid || err) {
        this.props.onError();
      } else {
        const wobjects = linkedObjects.map(obj => ({
          author_permlink: obj.id,
          percent: obj.influence.value,
        }));
        this.props.onSubmit({
          ...values,
          [WAIVIO_META_FIELD_NAME]: { wobjects },
          [INVESTARENA_META_FIELD_NAME]: this.getForecastObject(forecast, selectForecast),
        });
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
          author_permlink: wObject.author_permlink.replace(' ', '-'),
        })
      : wObject;
    this.setState(prevState => {
      if (prevState.linkedObjects.some(obj => obj.id === wObject.id)) return prevState;
      const linkedObjects = setInitialInfluence(
        prevState.linkedObjects,
        selectedObj,
        prevState.influenceRemain,
      );
      return {
        linkedObjects,
        influenceRemain: 0,
        canCreateNewObject: linkedObjects.length < MAX_NEW_OBJECTS_NUMBER,
      };
    }, this.onUpdate);
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
                  id: `${res.objectPermlink}`,
                  isNew: false,
                  isCreating: false,
                }
              : obj,
          );
          return {
            linkedObjects,
            isLinkedObjectsValid:
              prevState.isLinkedObjectsValid ||
              !(prevState.isLinkedObjectsValid || linkedObjects.some(obj => obj.isNew)),
          };
        }, this.onUpdate);
      },
      () => {
        this.setState(prevState => {
          const linkedObjects = prevState.linkedObjects.map(obj =>
            obj.id === wObject.id ? { ...obj, isCreating: false } : obj,
          );
          return { linkedObjects };
        }, this.onUpdate);
      },
    );
  }

  handleRemoveObject(wObject) {
    this.setState(prevState => {
      const result = removeObjInfluenceHandler(
        prevState.linkedObjects,
        wObject,
        prevState.influenceRemain,
      );
      return {
        linkedObjects: result.linkedObjects,
        influenceRemain: result.influenceRemain,
        canCreateNewObject: result.linkedObjects.length < MAX_NEW_OBJECTS_NUMBER,
      };
    }, this.onUpdate);
  }

  handleChangeInfluence(wObj, influence) {
    const { influenceRemain, linkedObjects } = this.state;
    if (influenceRemain - (influence - wObj.influence.value) >= 0) {
      this.setState(
        changeObjInfluenceHandler(linkedObjects, wObj, influence, influenceRemain),
        this.onUpdate,
      );
    }
  }
  checkTopics = intl => (rule, value, callback) => {
    if (!value || value.length < 1 || value.length > 5) {
      callback(
        intl.formatMessage({
          id: 'topics_error_count',
          defaultMessage: 'You have to add 1 to 5 topics.',
        }),
      );
    }
    value
      .map(topic => ({ topic, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic) }))
      .filter(topic => !topic.valid)
      .map(topic =>
        callback(
          intl.formatMessage(
            {
              id: 'topics_error_invalid_topic',
              defaultMessage: 'Topic {topic} is invalid.',
            },
            {
              topic: topic.topic,
            },
          ),
        ),
      );
    callback();
  };

  handleForecastChange(forecastValues) {
    this.setState({ forecastValues }, this.onUpdate);
  }

  render() {
    const { intl, form, loading, isUpdating, saving, draftId } = this.props;
    const { getFieldDecorator } = form;
    const {
      body,
      bodyHTML,
      linkedObjects,
      forecastValues,
      influenceRemain,
      isLinkedObjectsValid,
      canCreateNewObject,
      isCreatePostClicked,
    } = this.state;

    const { words, minutes } = readingTime(bodyHTML);

    const linkedObjectsTitle = (
      <div className="ant-form-item-label">
        <BTooltip
          title={
            <FormattedMessage
              id="linked_objects_tooltip"
              defaultMessage="Add objects those described in the post, and set the value of belonging"
            />
          }
        >
          <label className="Editor__label" htmlFor="title">
            <FormattedMessage id="add_object" defaultMessage="Add object" />
          </label>
        </BTooltip>
      </div>
    );
    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })} - Waivio
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
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="topics" defaultMessage="Topics" />
            </span>
          }
          extra={intl.formatMessage({
            id: 'topics_extra',
            defaultMessage:
              'Separate topics with commas. Only lowercase letters, numbers and hyphen character is permitted.',
          })}
        >
          {getFieldDecorator('topics', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'topics_error_empty',
                  defaultMessage: 'Please enter topics',
                }),
                type: 'array',
              },
              { validator: this.checkTopics(intl) },
            ],
          })(
            <Select
              ref={ref => {
                this.select = ref;
              }}
              onChange={this.onUpdate}
              className="Editor__topics"
              mode="tags"
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add story topics here',
              })}
              dropdownStyle={{ display: 'none' }}
              tokenSeparators={[' ', ',']}
            />,
          )}
        </Form.Item>
        <LinkedObjects
          title={linkedObjectsTitle}
          canCreateNewObject={canCreateNewObject}
          influenceRemain={influenceRemain}
          linkedObjects={linkedObjects}
          isLinkedObjectsValid={isLinkedObjectsValid}
          handleAddLinkedObject={this.handleAddLinkedObject}
          handleCreateObject={this.handleCreateObject}
          handleRemoveObject={this.handleRemoveObject}
          handleChangeInfluence={this.handleChangeInfluence}
        />
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
        <Form.Item>
          {getFieldDecorator('beneficiary', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage
                id="add_waivio_beneficiary"
                defaultMessage="Share {share}% of this post rewards with Waivio"
                values={{
                  share: BENEFICIARY_PERCENT / 100,
                }}
              />
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
          {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage id="like_post" defaultMessage="Like this post" />
            </Checkbox>,
          )}
        </Form.Item>
        <CreatePostForecast
          forecastValues={forecastValues}
          onChange={this.handleForecastChange}
          isPosted={isCreatePostClicked}
          isUpdating={isUpdating}
        />
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
